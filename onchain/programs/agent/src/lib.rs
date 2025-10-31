use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("AgentSys11111111111111111111111111111111111");

#[program]
pub mod decentramind_agent {
    use super::*;

    pub fn initialize_master_agent(
        ctx: Context<InitializeMasterAgent>,
        name: String,
        role: String,
        bump: u8,
    ) -> Result<()> {
        let master_agent = &mut ctx.accounts.master_agent;
        master_agent.authority = ctx.accounts.authority.key();
        master_agent.name = name;
        master_agent.role = role;
        master_agent.level = 1;
        master_agent.total_xp = 0;
        master_agent.nft_mint = None;
        master_agent.created_at = Clock::get()?.unix_timestamp;
        master_agent.last_active_at = Clock::get()?.unix_timestamp;
        master_agent.bump = bump;
        
        // Initialize dashboard KPIs
        master_agent.dashboard = DashboardKPIs {
            agent_xp_earned: 0,
            tasks_completed: 0,
            dao_proposals: 0,
            rewards_claimed: 0,
            active_agents: 0,
            total_agents: 0,
            system_uptime: 100_00, // 100.00% in basis points
        };

        emit!(MasterAgentInitialized {
            master_agent: master_agent.key(),
            authority: ctx.accounts.authority.key(),
            name: master_agent.name.clone(),
        });

        Ok(())
    }

    pub fn create_sub_agent(
        ctx: Context<CreateSubAgent>,
        agent_type: SubAgentType,
        name: String,
        purpose: String,
        bump: u8,
    ) -> Result<()> {
        let sub_agent = &mut ctx.accounts.sub_agent;
        let master_agent = &mut ctx.accounts.master_agent;

        sub_agent.master_agent = master_agent.key();
        sub_agent.agent_type = agent_type;
        sub_agent.name = name;
        sub_agent.purpose = purpose;
        sub_agent.status = AgentStatus::Active;
        sub_agent.xp = AgentXP {
            current: 0,
            total: 0,
            level: 1,
            next_level_requirement: 100,
        };
        sub_agent.metrics = AgentMetrics {
            tasks_completed: 0,
            total_xp: 0,
            active_streak_days: 0,
            average_completion_time: 0,
            success_rate: 0,
        };
        sub_agent.created_at = Clock::get()?.unix_timestamp;
        sub_agent.last_active_at = Clock::get()?.unix_timestamp;
        sub_agent.bump = bump;

        // Update master agent stats
        master_agent.dashboard.total_agents += 1;
        master_agent.dashboard.active_agents += 1;
        master_agent.last_active_at = Clock::get()?.unix_timestamp;

        emit!(SubAgentCreated {
            sub_agent: sub_agent.key(),
            master_agent: master_agent.key(),
            agent_type,
            name: sub_agent.name.clone(),
        });

        Ok(())
    }

    pub fn assign_task(
        ctx: Context<AssignTask>,
        title: String,
        description: String,
        priority: TaskPriority,
        xp_reward: u64,
        tags: Vec<String>,
        bump: u8,
    ) -> Result<()> {
        let task = &mut ctx.accounts.task;
        let sub_agent = &mut ctx.accounts.sub_agent;
        let master_agent = &mut ctx.accounts.master_agent;

        task.assigned_to = sub_agent.key();
        task.title = title;
        task.description = description;
        task.status = TaskStatus::Pending;
        task.priority = priority;
        task.xp_reward = xp_reward;
        task.tags = tags;
        task.created_at = Clock::get()?.unix_timestamp;
        task.updated_at = Clock::get()?.unix_timestamp;
        task.bump = bump;

        // Update agent activity
        sub_agent.last_active_at = Clock::get()?.unix_timestamp;
        master_agent.last_active_at = Clock::get()?.unix_timestamp;

        emit!(TaskAssigned {
            task: task.key(),
            sub_agent: sub_agent.key(),
            title: task.title.clone(),
            xp_reward,
        });

        Ok(())
    }

    pub fn complete_task(ctx: Context<CompleteTask>) -> Result<()> {
        let task = &mut ctx.accounts.task;
        let sub_agent = &mut ctx.accounts.sub_agent;
        let master_agent = &mut ctx.accounts.master_agent;

        require!(task.status == TaskStatus::Pending || task.status == TaskStatus::InProgress, 
                AgentError::TaskAlreadyCompleted);

        let current_time = Clock::get()?.unix_timestamp;
        
        // Update task
        task.status = TaskStatus::Completed;
        task.completed_at = Some(current_time);
        task.updated_at = current_time;

        // Update sub-agent XP and metrics
        sub_agent.xp.current += task.xp_reward;
        sub_agent.xp.total += task.xp_reward;
        sub_agent.metrics.tasks_completed += 1;
        sub_agent.metrics.total_xp += task.xp_reward;

        // Check for level up
        if sub_agent.xp.current >= sub_agent.xp.next_level_requirement {
            sub_agent.xp.level += 1;
            sub_agent.xp.current = sub_agent.xp.current - sub_agent.xp.next_level_requirement;
            sub_agent.xp.next_level_requirement = calculate_next_level_requirement(sub_agent.xp.level);
            
            emit!(AgentLevelUp {
                sub_agent: sub_agent.key(),
                new_level: sub_agent.xp.level,
                total_xp: sub_agent.xp.total,
            });
        }

        // Update master agent dashboard
        master_agent.dashboard.tasks_completed += 1;
        master_agent.dashboard.agent_xp_earned += task.xp_reward;
        master_agent.total_xp += task.xp_reward;

        // Update activity timestamps
        sub_agent.last_active_at = current_time;
        master_agent.last_active_at = current_time;

        emit!(TaskCompleted {
            task: task.key(),
            sub_agent: sub_agent.key(),
            xp_earned: task.xp_reward,
            new_agent_level: sub_agent.xp.level,
        });

        Ok(())
    }

    pub fn create_proposal(
        ctx: Context<CreateProposal>,
        title: String,
        description: String,
        proposal_type: ProposalType,
        voting_period_days: u8,
        bump: u8,
    ) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal;
        let master_agent = &mut ctx.accounts.master_agent;

        let current_time = Clock::get()?.unix_timestamp;
        let voting_ends_at = current_time + (voting_period_days as i64 * 24 * 60 * 60);

        proposal.master_agent = master_agent.key();
        proposal.title = title;
        proposal.description = description;
        proposal.proposal_type = proposal_type;
        proposal.status = ProposalStatus::Pending;
        proposal.votes_for = 0;
        proposal.votes_against = 0;
        proposal.required_votes = 3; // Configurable
        proposal.created_at = current_time;
        proposal.voting_ends_at = voting_ends_at;
        proposal.bump = bump;

        // Update master agent
        master_agent.dashboard.dao_proposals += 1;
        master_agent.last_active_at = current_time;

        emit!(ProposalCreated {
            proposal: proposal.key(),
            master_agent: master_agent.key(),
            title: proposal.title.clone(),
            proposal_type,
        });

        Ok(())
    }

    pub fn vote_on_proposal(
        ctx: Context<VoteOnProposal>,
        vote: bool, // true for yes, false for no
    ) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal;
        let voter = &ctx.accounts.voter;

        require!(proposal.status == ProposalStatus::Pending, AgentError::ProposalNotActive);
        require!(Clock::get()?.unix_timestamp <= proposal.voting_ends_at, AgentError::VotingPeriodEnded);

        if vote {
            proposal.votes_for += 1;
        } else {
            proposal.votes_against += 1;
        }

        // Check if proposal passes
        if proposal.votes_for >= proposal.required_votes {
            proposal.status = ProposalStatus::Approved;
            
            emit!(ProposalApproved {
                proposal: proposal.key(),
                votes_for: proposal.votes_for,
                votes_against: proposal.votes_against,
            });
        } else if proposal.votes_against >= proposal.required_votes {
            proposal.status = ProposalStatus::Rejected;
            
            emit!(ProposalRejected {
                proposal: proposal.key(),
                votes_for: proposal.votes_for,
                votes_against: proposal.votes_against,
            });
        }

        emit!(VoteCast {
            proposal: proposal.key(),
            voter: voter.key(),
            vote,
        });

        Ok(())
    }

    pub fn claim_reward(ctx: Context<ClaimReward>, amount: u64) -> Result<()> {
        let master_agent = &mut ctx.accounts.master_agent;
        
        // Transfer tokens from reward vault to user
        let cpi_accounts = Transfer {
            from: ctx.accounts.reward_vault.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.reward_vault_authority.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        token::transfer(cpi_ctx, amount)?;

        // Update master agent dashboard
        master_agent.dashboard.rewards_claimed += amount;
        master_agent.last_active_at = Clock::get()?.unix_timestamp;

        emit!(RewardClaimed {
            master_agent: master_agent.key(),
            amount,
            recipient: ctx.accounts.user_token_account.key(),
        });

        Ok(())
    }

    pub fn update_agent_status(
        ctx: Context<UpdateAgentStatus>,
        new_status: AgentStatus,
    ) -> Result<()> {
        let sub_agent = &mut ctx.accounts.sub_agent;
        let master_agent = &mut ctx.accounts.master_agent;

        let old_status = sub_agent.status;
        sub_agent.status = new_status;
        sub_agent.last_active_at = Clock::get()?.unix_timestamp;

        // Update master agent active count
        match (old_status, new_status) {
            (AgentStatus::Inactive, AgentStatus::Active) | 
            (AgentStatus::Maintenance, AgentStatus::Active) => {
                master_agent.dashboard.active_agents += 1;
            },
            (AgentStatus::Active, AgentStatus::Inactive) | 
            (AgentStatus::Active, AgentStatus::Maintenance) => {
                master_agent.dashboard.active_agents = master_agent.dashboard.active_agents.saturating_sub(1);
            },
            _ => {}
        }

        master_agent.last_active_at = Clock::get()?.unix_timestamp;

        emit!(AgentStatusUpdated {
            sub_agent: sub_agent.key(),
            old_status,
            new_status,
        });

        Ok(())
    }
}

// Helper function
fn calculate_next_level_requirement(level: u32) -> u64 {
    (level as u64 * 100) + 50 // Exponential growth
}

// Account structures
#[account]
pub struct MasterAgent {
    pub authority: Pubkey,
    pub name: String,
    pub role: String,
    pub level: u32,
    pub total_xp: u64,
    pub nft_mint: Option<Pubkey>,
    pub dashboard: DashboardKPIs,
    pub created_at: i64,
    pub last_active_at: i64,
    pub bump: u8,
}

#[account]
pub struct SubAgent {
    pub master_agent: Pubkey,
    pub agent_type: SubAgentType,
    pub name: String,
    pub purpose: String,
    pub status: AgentStatus,
    pub xp: AgentXP,
    pub metrics: AgentMetrics,
    pub created_at: i64,
    pub last_active_at: i64,
    pub bump: u8,
}

#[account]
pub struct AgentTask {
    pub assigned_to: Pubkey,
    pub title: String,
    pub description: String,
    pub status: TaskStatus,
    pub priority: TaskPriority,
    pub xp_reward: u64,
    pub tags: Vec<String>,
    pub created_at: i64,
    pub updated_at: i64,
    pub completed_at: Option<i64>,
    pub bump: u8,
}

#[account]
pub struct AgentProposal {
    pub master_agent: Pubkey,
    pub title: String,
    pub description: String,
    pub proposal_type: ProposalType,
    pub status: ProposalStatus,
    pub votes_for: u32,
    pub votes_against: u32,
    pub required_votes: u32,
    pub created_at: i64,
    pub voting_ends_at: i64,
    pub implemented_at: Option<i64>,
    pub bump: u8,
}

// Data structures
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub struct DashboardKPIs {
    pub agent_xp_earned: u64,
    pub tasks_completed: u64,
    pub dao_proposals: u64,
    pub rewards_claimed: u64,
    pub active_agents: u32,
    pub total_agents: u32,
    pub system_uptime: u32, // in basis points (10000 = 100%)
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub struct AgentXP {
    pub current: u64,
    pub total: u64,
    pub level: u32,
    pub next_level_requirement: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub struct AgentMetrics {
    pub tasks_completed: u64,
    pub total_xp: u64,
    pub active_streak_days: u32,
    pub average_completion_time: u32, // in hours
    pub success_rate: u32, // percentage
}

// Enums
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum SubAgentType {
    DevOps,
    Funding,
    Community,
    AITraining,
    Compliance,
    ESG,
    Legal,
    Marketing,
    Documentation,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum AgentStatus {
    Active,
    Inactive,
    Maintenance,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum TaskStatus {
    Pending,
    InProgress,
    Completed,
    Failed,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum TaskPriority {
    Low,
    Medium,
    High,
    Critical,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum ProposalType {
    TaskAssignment,
    ResourceAllocation,
    SystemUpgrade,
    NewAgent,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum ProposalStatus {
    Pending,
    Approved,
    Rejected,
    Implemented,
}

// Context structures
#[derive(Accounts)]
#[instruction(name: String, role: String, bump: u8)]
pub struct InitializeMasterAgent<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 64 + 64 + 4 + 8 + 33 + 8 + 8 + 8 + 1, // Adjust size as needed
        seeds = [b"master_agent", authority.key().as_ref()],
        bump
    )]
    pub master_agent: Account<'info, MasterAgent>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(agent_type: SubAgentType, name: String, purpose: String, bump: u8)]
pub struct CreateSubAgent<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 1 + 64 + 128 + 1 + 32 + 64 + 8 + 8 + 1, // Adjust size as needed
        seeds = [b"sub_agent", master_agent.key().as_ref(), &[agent_type as u8]],
        bump
    )]
    pub sub_agent: Account<'info, SubAgent>,
    #[account(
        mut,
        seeds = [b"master_agent", authority.key().as_ref()],
        bump = master_agent.bump
    )]
    pub master_agent: Account<'info, MasterAgent>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title: String, description: String, priority: TaskPriority, xp_reward: u64, tags: Vec<String>, bump: u8)]
pub struct AssignTask<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 64 + 256 + 1 + 1 + 8 + 128 + 8 + 8 + 9 + 1, // Adjust size as needed
        seeds = [b"task", sub_agent.key().as_ref(), &Clock::get().unwrap().unix_timestamp.to_le_bytes()],
        bump
    )]
    pub task: Account<'info, AgentTask>,
    #[account(mut)]
    pub sub_agent: Account<'info, SubAgent>,
    #[account(
        mut,
        seeds = [b"master_agent", authority.key().as_ref()],
        bump = master_agent.bump
    )]
    pub master_agent: Account<'info, MasterAgent>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CompleteTask<'info> {
    #[account(mut)]
    pub task: Account<'info, AgentTask>,
    #[account(mut)]
    pub sub_agent: Account<'info, SubAgent>,
    #[account(mut)]
    pub master_agent: Account<'info, MasterAgent>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(title: String, description: String, proposal_type: ProposalType, voting_period_days: u8, bump: u8)]
pub struct CreateProposal<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 64 + 256 + 1 + 1 + 4 + 4 + 4 + 8 + 8 + 9 + 1, // Adjust size as needed
        seeds = [b"proposal", master_agent.key().as_ref(), &Clock::get().unwrap().unix_timestamp.to_le_bytes()],
        bump
    )]
    pub proposal: Account<'info, AgentProposal>,
    #[account(
        mut,
        seeds = [b"master_agent", authority.key().as_ref()],
        bump = master_agent.bump
    )]
    pub master_agent: Account<'info, MasterAgent>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct VoteOnProposal<'info> {
    #[account(mut)]
    pub proposal: Account<'info, AgentProposal>,
    pub voter: Signer<'info>,
}

#[derive(Accounts)]
pub struct ClaimReward<'info> {
    #[account(mut)]
    pub master_agent: Account<'info, MasterAgent>,
    #[account(mut)]
    pub reward_vault: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    /// CHECK: This is the PDA authority for the reward vault
    pub reward_vault_authority: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct UpdateAgentStatus<'info> {
    #[account(mut)]
    pub sub_agent: Account<'info, SubAgent>,
    #[account(mut)]
    pub master_agent: Account<'info, MasterAgent>,
    pub authority: Signer<'info>,
}

// Events
#[event]
pub struct MasterAgentInitialized {
    pub master_agent: Pubkey,
    pub authority: Pubkey,
    pub name: String,
}

#[event]
pub struct SubAgentCreated {
    pub sub_agent: Pubkey,
    pub master_agent: Pubkey,
    pub agent_type: SubAgentType,
    pub name: String,
}

#[event]
pub struct TaskAssigned {
    pub task: Pubkey,
    pub sub_agent: Pubkey,
    pub title: String,
    pub xp_reward: u64,
}

#[event]
pub struct TaskCompleted {
    pub task: Pubkey,
    pub sub_agent: Pubkey,
    pub xp_earned: u64,
    pub new_agent_level: u32,
}

#[event]
pub struct AgentLevelUp {
    pub sub_agent: Pubkey,
    pub new_level: u32,
    pub total_xp: u64,
}

#[event]
pub struct ProposalCreated {
    pub proposal: Pubkey,
    pub master_agent: Pubkey,
    pub title: String,
    pub proposal_type: ProposalType,
}

#[event]
pub struct ProposalApproved {
    pub proposal: Pubkey,
    pub votes_for: u32,
    pub votes_against: u32,
}

#[event]
pub struct ProposalRejected {
    pub proposal: Pubkey,
    pub votes_for: u32,
    pub votes_against: u32,
}

#[event]
pub struct VoteCast {
    pub proposal: Pubkey,
    pub voter: Pubkey,
    pub vote: bool,
}

#[event]
pub struct RewardClaimed {
    pub master_agent: Pubkey,
    pub amount: u64,
    pub recipient: Pubkey,
}

#[event]
pub struct AgentStatusUpdated {
    pub sub_agent: Pubkey,
    pub old_status: AgentStatus,
    pub new_status: AgentStatus,
}

// Errors
#[error_code]
pub enum AgentError {
    #[msg("Task is already completed")]
    TaskAlreadyCompleted,
    #[msg("Proposal is not active")]
    ProposalNotActive,
    #[msg("Voting period has ended")]
    VotingPeriodEnded,
    #[msg("Insufficient privileges")]
    InsufficientPrivileges,
    #[msg("Agent is not active")]
    AgentNotActive,
    #[msg("Invalid agent type")]
    InvalidAgentType,
    #[msg("Task not found")]
    TaskNotFound,
    #[msg("Proposal not found")]
    ProposalNotFound,
} 