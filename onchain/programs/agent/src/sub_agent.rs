use solana_program::{
    account_info::{next_account_info, AccountInfo},
    program_error::ProgramError,
    pubkey::Pubkey,
    msg,
};
use borsh::{BorshDeserialize, BorshSerialize};

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub enum AgentType {
    Coder,
    Tester,
    Documentation,
    Integration,
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct SubAgent {
    pub is_initialized: bool,
    pub master_agent: Pubkey,
    pub agent_type: AgentType,
    pub xp: u64,
    pub task_count: u64,
    pub last_task: u64,
    pub capabilities: Vec<String>,
}

impl SubAgent {
    pub const LEN: usize = 1 + 32 + 1 + 8 + 8 + 8 + 32; // Adjust based on actual data

    pub fn initialize(
        &mut self,
        master_agent: Pubkey,
        agent_type: AgentType,
        capabilities: Vec<String>,
    ) -> Result<(), ProgramError> {
        if self.is_initialized {
            return Err(ProgramError::AccountAlreadyInitialized);
        }
        self.is_initialized = true;
        self.master_agent = master_agent;
        self.agent_type = agent_type;
        self.xp = 0;
        self.task_count = 0;
        self.last_task = 0;
        self.capabilities = capabilities;
        Ok(())
    }

    pub fn add_xp(&mut self, amount: u64) -> Result<(), ProgramError> {
        self.xp = self.xp.checked_add(amount)
            .ok_or(ProgramError::ArithmeticOverflow)?;
        Ok(())
    }

    pub fn complete_task(&mut self, xp_reward: u64) -> Result<(), ProgramError> {
        self.task_count = self.task_count.checked_add(1)
            .ok_or(ProgramError::ArithmeticOverflow)?;
        self.last_task = solana_program::clock::Clock::get()?.unix_timestamp as u64;
        self.add_xp(xp_reward)?;
        Ok(())
    }

    pub fn add_capability(&mut self, capability: String) -> Result<(), ProgramError> {
        self.capabilities.push(capability);
        Ok(())
    }
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub enum SubAgentInstruction {
    Initialize {
        agent_type: AgentType,
        capabilities: Vec<String>,
    },
    CompleteTask {
        xp_reward: u64,
    },
    AddCapability {
        capability: String,
    },
}

pub fn process_sub_agent_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> Result<(), ProgramError> {
    let instruction = SubAgentInstruction::try_from_slice(instruction_data)?;
    let accounts_iter = &mut accounts.iter();

    match instruction {
        SubAgentInstruction::Initialize { agent_type, capabilities } => {
            msg!("Instruction: Initialize Sub-Agent");
            let sub_agent_account = next_account_info(accounts_iter)?;
            let master_agent = next_account_info(accounts_iter)?;

            if !master_agent.is_signer {
                return Err(ProgramError::MissingRequiredSignature);
            }

            let mut sub_agent_data = SubAgent::try_from_slice(&sub_agent_account.data.borrow())?;
            sub_agent_data.initialize(*master_agent.key, agent_type, capabilities)?;
            sub_agent_data.serialize(&mut *sub_agent_account.data.borrow_mut())?;
        }
        SubAgentInstruction::CompleteTask { xp_reward } => {
            msg!("Instruction: Complete Task");
            let sub_agent_account = next_account_info(accounts_iter)?;
            let master_agent = next_account_info(accounts_iter)?;

            if !master_agent.is_signer {
                return Err(ProgramError::MissingRequiredSignature);
            }

            let mut sub_agent_data = SubAgent::try_from_slice(&sub_agent_account.data.borrow())?;
            if sub_agent_data.master_agent != *master_agent.key {
                return Err(ProgramError::InvalidAccountData);
            }

            sub_agent_data.complete_task(xp_reward)?;
            sub_agent_data.serialize(&mut *sub_agent_account.data.borrow_mut())?;
        }
        SubAgentInstruction::AddCapability { capability } => {
            msg!("Instruction: Add Capability");
            let sub_agent_account = next_account_info(accounts_iter)?;
            let master_agent = next_account_info(accounts_iter)?;

            if !master_agent.is_signer {
                return Err(ProgramError::MissingRequiredSignature);
            }

            let mut sub_agent_data = SubAgent::try_from_slice(&sub_agent_account.data.borrow())?;
            if sub_agent_data.master_agent != *master_agent.key {
                return Err(ProgramError::InvalidAccountData);
            }

            sub_agent_data.add_capability(capability)?;
            sub_agent_data.serialize(&mut *sub_agent_account.data.borrow_mut())?;
        }
    }

    Ok(())
} 