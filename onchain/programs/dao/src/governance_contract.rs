use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("GovContract111111111111111111111111111111111111");

#[program]
pub mod governance_contract {
    use super::*;

    pub fn create_proposal(
        ctx: Context<CreateProposal>,
        title: String,
        description: String,
        proposal_type: ProposalType,
        execution_delay: i64,
    ) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal;
        let creator = &ctx.accounts.creator;
        
        // Check if creator has enough DMTX tokens (minimum 10M DMTX for governance)
        let creator_balance = ctx.accounts.creator_token_account.amount;
        require!(
            creator_balance >= 10_000_000_000, // 10M DMTX (with 9 decimals)
            GovernanceError::InsufficientGovernanceTokens
        );
        
        proposal.creator = creator.key();
        proposal.title = title;
        proposal.description = description;
        proposal.proposal_type = proposal_type;
        proposal.status = ProposalStatus::Active;
        proposal.yes_votes = 0;
        proposal.no_votes = 0;
        proposal.abstain_votes = 0;
        proposal.created_at = Clock::get()?.unix_timestamp;
        proposal.execution_delay = execution_delay;
        proposal.execution_time = Clock::get()?.unix_timestamp + execution_delay;
        proposal.quorum_met = false;
        
        emit!(ProposalCreated {
            proposal: proposal.key(),
            creator: creator.key(),
            title: proposal.title.clone(),
        });
        
        Ok(())
    }

    pub fn vote(
        ctx: Context<Vote>,
        vote_choice: VoteChoice,
        vote_weight: u64,
    ) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal;
        let voter = &ctx.accounts.voter;
        let vote_record = &mut ctx.accounts.vote_record;
        
        // Check if proposal is still active
        require!(
            proposal.status == ProposalStatus::Active,
            GovernanceError::ProposalNotActive
        );
        
        // Check if voter has enough DMTX tokens
        let voter_balance = ctx.accounts.voter_token_account.amount;
        require!(
            voter_balance >= vote_weight,
            GovernanceError::InsufficientVotingPower
        );
        
        // Check if voter hasn't already voted
        require!(
            !vote_record.has_voted,
            GovernanceError::AlreadyVoted
        );
        
        // Record the vote
        vote_record.proposal = proposal.key();
        vote_record.voter = voter.key();
        vote_record.vote_choice = vote_choice;
        vote_record.vote_weight = vote_weight;
        vote_record.voted_at = Clock::get()?.unix_timestamp;
        vote_record.has_voted = true;
        
        // Update proposal vote counts
        match vote_choice {
            VoteChoice::Yes => proposal.yes_votes += vote_weight,
            VoteChoice::No => proposal.no_votes += vote_weight,
            VoteChoice::Abstain => proposal.abstain_votes += vote_weight,
        }
        
        // Check if quorum is met (25M DMT quorum requirement)
        let total_votes = proposal.yes_votes + proposal.no_votes + proposal.abstain_votes;
        if total_votes >= 25_000_000_000 && !proposal.quorum_met {
            proposal.quorum_met = true;
        }
        
        emit!(VoteCast {
            proposal: proposal.key(),
            voter: voter.key(),
            vote_choice,
            vote_weight,
        });
        
        Ok(())
    }

    pub fn execute_proposal(ctx: Context<ExecuteProposal>) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal;
        
        // Check if proposal can be executed
        require!(
            proposal.status == ProposalStatus::Active,
            GovernanceError::ProposalNotActive
        );
        require!(
            Clock::get()?.unix_timestamp >= proposal.execution_time,
            GovernanceError::ExecutionDelayNotMet
        );
        require!(
            proposal.quorum_met,
            GovernanceError::QuorumNotMet
        );
        
        // Determine if proposal passed
        let total_votes = proposal.yes_votes + proposal.no_votes + proposal.abstain_votes;
        let yes_percentage = (proposal.yes_votes as f64 / total_votes as f64) * 100.0;
        
        if yes_percentage >= 60.0 {
            proposal.status = ProposalStatus::Passed;
            
            // Distribute rewards to voters (0.1-1 DMT per proposal)
            let reward_per_voter = 100_000; // 0.1 DMT (with 6 decimals)
            
            // Transfer rewards from treasury
            let transfer_ctx = CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.treasury_account.to_account_info(),
                    to: ctx.accounts.rewards_pool.to_account_info(),
                    authority: ctx.accounts.treasury_authority.to_account_info(),
                },
            );
            token::transfer(transfer_ctx, reward_per_voter)?;
            
            emit!(ProposalExecuted {
                proposal: proposal.key(),
                status: ProposalStatus::Passed,
                yes_percentage,
            });
        } else {
            proposal.status = ProposalStatus::Rejected;
            
            emit!(ProposalExecuted {
                proposal: proposal.key(),
                status: ProposalStatus::Rejected,
                yes_percentage,
            });
        }
        
        Ok(())
    }

    pub fn claim_rewards(ctx: Context<ClaimRewards>) -> Result<()> {
        let voter = &ctx.accounts.voter;
        let vote_record = &ctx.accounts.vote_record;
        let proposal = &ctx.accounts.proposal;
        
        // Check if proposal has been executed
        require!(
            proposal.status == ProposalStatus::Passed || proposal.status == ProposalStatus::Rejected,
            GovernanceError::ProposalNotExecuted
        );
        
        // Check if voter has already claimed rewards
        require!(
            !vote_record.rewards_claimed,
            GovernanceError::RewardsAlreadyClaimed
        );
        
        // Calculate rewards based on vote weight and proposal outcome
        let base_reward = 100_000; // 0.1 DMT base reward
        let vote_weight_multiplier = vote_record.vote_weight / 1_000_000; // 1 DMT = 1 multiplier
        let total_reward = base_reward * vote_weight_multiplier.max(1);
        
        // Transfer rewards to voter
        let transfer_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.rewards_pool.to_account_info(),
                to: ctx.accounts.voter_token_account.to_account_info(),
                authority: ctx.accounts.rewards_authority.to_account_info(),
            },
        );
        token::transfer(transfer_ctx, total_reward)?;
        
        // Mark rewards as claimed
        let vote_record = &mut ctx.accounts.vote_record;
        vote_record.rewards_claimed = true;
        vote_record.rewards_amount = total_reward;
        
        emit!(RewardsClaimed {
            voter: voter.key(),
            proposal: proposal.key(),
            reward_amount: total_reward,
        });
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateProposal<'info> {
    #[account(
        init,
        payer = creator,
        space = 8 + Proposal::LEN,
        seeds = [b"proposal", creator.key().as_ref(), &Clock::get()?.unix_timestamp.to_le_bytes()],
        bump
    )]
    pub proposal: Account<'info, Proposal>,
    
    #[account(mut)]
    pub creator: Signer<'info>,
    
    #[account(
        constraint = creator_token_account.owner == creator.key()
    )]
    pub creator_token_account: Account<'info, TokenAccount>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Vote<'info> {
    #[account(mut)]
    pub proposal: Account<'info, Proposal>,
    
    #[account(mut)]
    pub voter: Signer<'info>,
    
    #[account(
        init_if_needed,
        payer = voter,
        space = 8 + VoteRecord::LEN,
        seeds = [b"vote", proposal.key().as_ref(), voter.key().as_ref()],
        bump
    )]
    pub vote_record: Account<'info, VoteRecord>,
    
    #[account(
        constraint = voter_token_account.owner == voter.key()
    )]
    pub voter_token_account: Account<'info, TokenAccount>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ExecuteProposal<'info> {
    #[account(mut)]
    pub proposal: Account<'info, Proposal>,
    
    #[account(mut)]
    pub treasury_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub rewards_pool: Account<'info, TokenAccount>,
    
    /// CHECK: This is the treasury authority
    pub treasury_authority: UncheckedAccount<'info>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct ClaimRewards<'info> {
    #[account(mut)]
    pub voter: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"vote", proposal.key().as_ref(), voter.key().as_ref()],
        bump,
        has_one = voter
    )]
    pub vote_record: Account<'info, VoteRecord>,
    
    pub proposal: Account<'info, Proposal>,
    
    #[account(mut)]
    pub voter_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub rewards_pool: Account<'info, TokenAccount>,
    
    /// CHECK: This is the rewards authority
    pub rewards_authority: UncheckedAccount<'info>,
    
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct Proposal {
    pub creator: Pubkey,
    pub title: String,
    pub description: String,
    pub proposal_type: ProposalType,
    pub status: ProposalStatus,
    pub yes_votes: u64,
    pub no_votes: u64,
    pub abstain_votes: u64,
    pub created_at: i64,
    pub execution_delay: i64,
    pub execution_time: i64,
    pub quorum_met: bool,
}

impl Proposal {
    pub const LEN: usize = 32 + 128 + 512 + 1 + 1 + 8 + 8 + 8 + 8 + 8 + 8 + 1;
}

#[account]
pub struct VoteRecord {
    pub proposal: Pubkey,
    pub voter: Pubkey,
    pub vote_choice: VoteChoice,
    pub vote_weight: u64,
    pub voted_at: i64,
    pub has_voted: bool,
    pub rewards_claimed: bool,
    pub rewards_amount: u64,
}

impl VoteRecord {
    pub const LEN: usize = 32 + 32 + 1 + 8 + 8 + 1 + 1 + 8;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum ProposalType {
    ProtocolUpgrade,
    TokenomicsChange,
    FeatureAddition,
    EmergencyAction,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum ProposalStatus {
    Active,
    Passed,
    Rejected,
    Cancelled,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum VoteChoice {
    Yes,
    No,
    Abstain,
}

#[event]
pub struct ProposalCreated {
    pub proposal: Pubkey,
    pub creator: Pubkey,
    pub title: String,
}

#[event]
pub struct VoteCast {
    pub proposal: Pubkey,
    pub voter: Pubkey,
    pub vote_choice: VoteChoice,
    pub vote_weight: u64,
}

#[event]
pub struct ProposalExecuted {
    pub proposal: Pubkey,
    pub status: ProposalStatus,
    pub yes_percentage: f64,
}

#[event]
pub struct RewardsClaimed {
    pub voter: Pubkey,
    pub proposal: Pubkey,
    pub reward_amount: u64,
}

#[error_code]
pub enum GovernanceError {
    #[msg("Insufficient governance tokens")]
    InsufficientGovernanceTokens,
    #[msg("Proposal is not active")]
    ProposalNotActive,
    #[msg("Insufficient voting power")]
    InsufficientVotingPower,
    #[msg("Already voted on this proposal")]
    AlreadyVoted,
    #[msg("Execution delay not met")]
    ExecutionDelayNotMet,
    #[msg("Quorum not met")]
    QuorumNotMet,
    #[msg("Proposal not executed")]
    ProposalNotExecuted,
    #[msg("Rewards already claimed")]
    RewardsAlreadyClaimed,
} 