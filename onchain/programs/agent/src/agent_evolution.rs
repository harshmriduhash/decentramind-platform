use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod agent_evolution {
    use super::*;

    pub fn initialize_agent(
        ctx: Context<InitializeAgent>,
        agent_name: String,
        agent_type: AgentType,
        initial_level: u8,
    ) -> Result<()> {
        let agent = &mut ctx.accounts.agent;
        agent.owner = ctx.accounts.owner.key();
        agent.name = agent_name;
        agent.agent_type = agent_type;
        agent.level = initial_level;
        agent.xp = 0;
        agent.performance = 100;
        agent.tasks_completed = 0;
        agent.created_at = Clock::get()?.unix_timestamp;
        agent.last_updated = Clock::get()?.unix_timestamp;
        
        Ok(())
    }

    pub fn complete_task(
        ctx: Context<CompleteTask>,
        task_xp: u32,
        performance_boost: u32,
    ) -> Result<()> {
        let agent = &mut ctx.accounts.agent;
        
        // Add XP and update performance
        agent.xp += task_xp;
        agent.performance = agent.performance.saturating_add(performance_boost);
        agent.tasks_completed += 1;
        agent.last_updated = Clock::get()?.unix_timestamp;
        
        // Check for level up
        let new_level = calculate_level(agent.xp);
        if new_level > agent.level {
            agent.level = new_level;
            emit!(AgentLevelUp {
                agent: agent.key(),
                new_level,
                xp: agent.xp,
            });
        }
        
        Ok(())
    }

    pub fn train_agent(
        ctx: Context<TrainAgent>,
        training_cost: u64,
        skill_boost: u32,
    ) -> Result<()> {
        let agent = &mut ctx.accounts.agent;
        
        // Transfer training cost
        let transfer_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.user_token_account.to_account_info(),
                to: ctx.accounts.training_fee_account.to_account_info(),
                authority: ctx.accounts.owner.to_account_info(),
            },
        );
        token::transfer(transfer_ctx, training_cost)?;
        
        // Apply skill boost
        agent.performance = agent.performance.saturating_add(skill_boost);
        agent.last_updated = Clock::get()?.unix_timestamp;
        
        emit!(AgentTrained {
            agent: agent.key(),
            training_cost,
            new_performance: agent.performance,
        });
        
        Ok(())
    }

    pub fn stake_agent(
        ctx: Context<StakeAgent>,
        stake_amount: u64,
        lock_period: i64,
    ) -> Result<()> {
        let agent = &mut ctx.accounts.agent;
        let staking_info = &mut ctx.accounts.staking_info;
        
        // Transfer stake amount
        let transfer_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.user_token_account.to_account_info(),
                to: ctx.accounts.staking_pool.to_account_info(),
                authority: ctx.accounts.owner.to_account_info(),
            },
        );
        token::transfer(transfer_ctx, stake_amount)?;
        
        // Update staking info
        staking_info.agent = agent.key();
        staking_info.owner = ctx.accounts.owner.key();
        staking_info.stake_amount = stake_amount;
        staking_info.lock_period = lock_period;
        staking_info.staked_at = Clock::get()?.unix_timestamp;
        staking_info.is_active = true;
        
        // Boost agent performance based on stake
        let performance_boost = (stake_amount / 1_000_000) as u32; // 1 DMT = 1 performance point
        agent.performance = agent.performance.saturating_add(performance_boost);
        
        emit!(AgentStaked {
            agent: agent.key(),
            stake_amount,
            lock_period,
            new_performance: agent.performance,
        });
        
        Ok(())
    }

    pub fn unstake_agent(ctx: Context<UnstakeAgent>) -> Result<()> {
        let staking_info = &mut ctx.accounts.staking_info;
        let agent = &mut ctx.accounts.agent;
        
        require!(staking_info.is_active, AgentError::NotStaked);
        require!(
            Clock::get()?.unix_timestamp >= staking_info.staked_at + staking_info.lock_period,
            AgentError::LockPeriodNotExpired
        );
        
        // Calculate rewards
        let time_staked = Clock::get()?.unix_timestamp - staking_info.staked_at;
        let apy = 12_50; // 12.5% APY (in basis points)
        let rewards = (staking_info.stake_amount as u128)
            .checked_mul(apy as u128)
            .unwrap()
            .checked_mul(time_staked as u128)
            .unwrap()
            .checked_div(365 * 24 * 60 * 60 * 10000) // Convert to daily rate
            .unwrap() as u64;
        
        // Transfer stake back + rewards
        let total_return = staking_info.stake_amount + rewards;
        let transfer_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.staking_pool.to_account_info(),
                to: ctx.accounts.user_token_account.to_account_info(),
                authority: ctx.accounts.staking_authority.to_account_info(),
            },
        );
        token::transfer(transfer_ctx, total_return)?;
        
        // Reset staking info
        staking_info.is_active = false;
        staking_info.stake_amount = 0;
        
        emit!(AgentUnstaked {
            agent: agent.key(),
            stake_returned: staking_info.stake_amount,
            rewards_earned: rewards,
        });
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeAgent<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + Agent::LEN,
        seeds = [b"agent", owner.key().as_ref()],
        bump
    )]
    pub agent: Account<'info, Agent>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CompleteTask<'info> {
    #[account(
        mut,
        seeds = [b"agent", agent.owner.as_ref()],
        bump,
        has_one = owner
    )]
    pub agent: Account<'info, Agent>,
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct TrainAgent<'info> {
    #[account(
        mut,
        seeds = [b"agent", agent.owner.as_ref()],
        bump,
        has_one = owner
    )]
    pub agent: Account<'info, Agent>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub training_fee_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct StakeAgent<'info> {
    #[account(
        mut,
        seeds = [b"agent", agent.owner.as_ref()],
        bump,
        has_one = owner
    )]
    pub agent: Account<'info, Agent>,
    
    #[account(
        init_if_needed,
        payer = owner,
        space = 8 + StakingInfo::LEN,
        seeds = [b"staking", agent.key().as_ref()],
        bump
    )]
    pub staking_info: Account<'info, StakingInfo>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub staking_pool: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct UnstakeAgent<'info> {
    #[account(
        mut,
        seeds = [b"agent", agent.owner.as_ref()],
        bump,
        has_one = owner
    )]
    pub agent: Account<'info, Agent>,
    
    #[account(
        mut,
        seeds = [b"staking", agent.key().as_ref()],
        bump,
        has_one = owner
    )]
    pub staking_info: Account<'info, StakingInfo>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub staking_pool: Account<'info, TokenAccount>,
    
    /// CHECK: This is the staking pool authority
    pub staking_authority: UncheckedAccount<'info>,
    
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct Agent {
    pub owner: Pubkey,
    pub name: String,
    pub agent_type: AgentType,
    pub level: u8,
    pub xp: u32,
    pub performance: u32,
    pub tasks_completed: u32,
    pub created_at: i64,
    pub last_updated: i64,
}

impl Agent {
    pub const LEN: usize = 32 + 64 + 1 + 1 + 4 + 4 + 4 + 8 + 8;
}

#[account]
pub struct StakingInfo {
    pub agent: Pubkey,
    pub owner: Pubkey,
    pub stake_amount: u64,
    pub lock_period: i64,
    pub staked_at: i64,
    pub is_active: bool,
}

impl StakingInfo {
    pub const LEN: usize = 32 + 32 + 8 + 8 + 8 + 1;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum AgentType {
    VisionSync,    // Main Agent - Epic, $5, Grok
    DomainSync,    // Sub Agent - Common: $1, LLaMA; Rare: $2, ChatGPT/LLaMA 3; Legendary: $10, CrewAI
}

fn calculate_level(xp: u32) -> u8 {
    // Level calculation: each level requires more XP
    // Level 1: 0 XP, Level 2: 100 XP, Level 3: 300 XP, etc.
    let mut level = 1;
    let mut required_xp = 0;
    
    while xp >= required_xp && level < 100 {
        level += 1;
        required_xp += level * 100;
    }
    
    level.min(100)
}

#[event]
pub struct AgentLevelUp {
    pub agent: Pubkey,
    pub new_level: u8,
    pub xp: u32,
}

#[event]
pub struct AgentTrained {
    pub agent: Pubkey,
    pub training_cost: u64,
    pub new_performance: u32,
}

#[event]
pub struct AgentStaked {
    pub agent: Pubkey,
    pub stake_amount: u64,
    pub lock_period: i64,
    pub new_performance: u32,
}

#[event]
pub struct AgentUnstaked {
    pub agent: Pubkey,
    pub stake_returned: u64,
    pub rewards_earned: u64,
}

#[error_code]
pub enum AgentError {
    #[msg("Agent is not staked")]
    NotStaked,
    #[msg("Lock period has not expired")]
    LockPeriodNotExpired,
} 