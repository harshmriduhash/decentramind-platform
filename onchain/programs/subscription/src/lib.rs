use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("22222222222222222222222222222222");

#[program]
pub mod subscription {
    use super::*;

    pub fn create_subscription(
        ctx: Context<CreateSubscription>,
        tier: u8,
        duration_days: u32,
    ) -> Result<()> {
        let subscription = &mut ctx.accounts.subscription;
        subscription.user = ctx.accounts.user.key();
        subscription.tier = tier;
        subscription.start_date = Clock::get()?.unix_timestamp;
        subscription.end_date = Clock::get()?.unix_timestamp + (duration_days as i64 * 24 * 60 * 60);
        subscription.status = SubscriptionStatus::Active as u8;
        subscription.credits_remaining = get_tier_credits(tier);
        subscription.credits_used = 0;
        subscription.total_paid = get_tier_price(tier);
        subscription.total_burned = calculate_burn_amount(get_tier_price(tier));

        // Transfer payment
        let transfer_amount = get_tier_price(tier);
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.treasury_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };

        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, transfer_amount)?;

        // Burn tokens
        let burn_amount = calculate_burn_amount(transfer_amount);
        if burn_amount > 0 {
            let burn_cpi_accounts = Transfer {
                from: ctx.accounts.treasury_account.to_account_info(),
                to: ctx.accounts.burn_account.to_account_info(),
                authority: ctx.accounts.treasury_authority.to_account_info(),
            };

            let burn_cpi_program = ctx.accounts.token_program.to_account_info();
            let burn_cpi_ctx = CpiContext::new(burn_cpi_program, burn_cpi_accounts);
            token::transfer(burn_cpi_ctx, burn_amount)?;
        }

        Ok(())
    }

    pub fn use_credits(
        ctx: Context<UseCredits>,
        credits_used: u32,
    ) -> Result<()> {
        let subscription = &mut ctx.accounts.subscription;
        
        require!(
            subscription.status == SubscriptionStatus::Active as u8,
            SubscriptionError::SubscriptionInactive
        );
        
        require!(
            subscription.credits_remaining >= credits_used,
            SubscriptionError::InsufficientCredits
        );

        subscription.credits_remaining -= credits_used;
        subscription.credits_used += credits_used;

        Ok(())
    }

    pub fn cancel_subscription(
        ctx: Context<CancelSubscription>,
    ) -> Result<()> {
        let subscription = &mut ctx.accounts.subscription;
        
        require!(
            subscription.user == ctx.accounts.user.key(),
            SubscriptionError::Unauthorized
        );

        subscription.status = SubscriptionStatus::Cancelled as u8;

        Ok(())
    }

    pub fn renew_subscription(
        ctx: Context<RenewSubscription>,
        duration_days: u32,
    ) -> Result<()> {
        let subscription = &mut ctx.accounts.subscription;
        
        require!(
            subscription.user == ctx.accounts.user.key(),
            SubscriptionError::Unauthorized
        );

        let tier_price = get_tier_price(subscription.tier);
        
        // Transfer payment
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.treasury_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };

        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, tier_price)?;

        // Update subscription
        subscription.start_date = Clock::get()?.unix_timestamp;
        subscription.end_date = Clock::get()?.unix_timestamp + (duration_days as i64 * 24 * 60 * 60);
        subscription.status = SubscriptionStatus::Active as u8;
        subscription.credits_remaining = get_tier_credits(subscription.tier);
        subscription.total_paid += tier_price;
        subscription.total_burned += calculate_burn_amount(tier_price);

        // Burn tokens
        let burn_amount = calculate_burn_amount(tier_price);
        if burn_amount > 0 {
            let burn_cpi_accounts = Transfer {
                from: ctx.accounts.treasury_account.to_account_info(),
                to: ctx.accounts.burn_account.to_account_info(),
                authority: ctx.accounts.treasury_authority.to_account_info(),
            };

            let burn_cpi_program = ctx.accounts.token_program.to_account_info();
            let burn_cpi_ctx = CpiContext::new(burn_cpi_program, burn_cpi_accounts);
            token::transfer(burn_cpi_ctx, burn_amount)?;
        }

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateSubscription<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 1 + 8 + 8 + 1 + 4 + 4 + 8 + 8, // user + tier + start_date + end_date + status + credits_remaining + credits_used + total_paid + total_burned
    )]
    pub subscription: Account<'info, Subscription>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub treasury_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub burn_account: Account<'info, TokenAccount>,
    
    pub treasury_authority: AccountInfo<'info>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UseCredits<'info> {
    #[account(mut)]
    pub subscription: Account<'info, Subscription>,
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct CancelSubscription<'info> {
    #[account(mut)]
    pub subscription: Account<'info, Subscription>,
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct RenewSubscription<'info> {
    #[account(mut)]
    pub subscription: Account<'info, Subscription>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub treasury_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub burn_account: Account<'info, TokenAccount>,
    
    pub treasury_authority: AccountInfo<'info>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Subscription {
    pub user: Pubkey,
    pub tier: u8, // 0=freemium, 1=basic, 2=pro, 3=enterprise
    pub start_date: i64,
    pub end_date: i64,
    pub status: u8, // 0=active, 1=cancelled, 2=expired
    pub credits_remaining: u32,
    pub credits_used: u32,
    pub total_paid: u64,
    pub total_burned: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum SubscriptionStatus {
    Active,
    Cancelled,
    Expired,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum SubscriptionTier {
    Freemium,
    Basic,
    Pro,
    Enterprise,
}

fn get_tier_price(tier: u8) -> u64 {
    match tier {
        0 => 0,      // Freemium
        1 => 9,      // Basic
        2 => 29,     // Pro
        3 => 99,     // Enterprise
        _ => 0,
    }
}

fn get_tier_credits(tier: u8) -> u32 {
    match tier {
        0 => 5,      // Freemium
        1 => 20,     // Basic
        2 => 50,     // Pro
        3 => 200,    // Enterprise
        _ => 0,
    }
}

fn calculate_burn_amount(amount: u64) -> u64 {
    // 20% burning rate for all paid subscriptions
    amount * 20 / 100
}

#[error_code]
pub enum SubscriptionError {
    #[msg("Subscription is not active")]
    SubscriptionInactive,
    #[msg("Insufficient credits")]
    InsufficientCredits,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Invalid tier")]
    InvalidTier,
} 