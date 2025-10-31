'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import ConsoleLayout from '../shared/ConsoleLayout';

interface AgentManagementLayoutProps {
  children: ReactNode;
  agentCount: number;
}

const AgentManagementLayout: React.FC<AgentManagementLayoutProps> = ({
  children,
  agentCount
}) => {
  return (
    <ConsoleLayout
      title="Agent Management"
      subtitle={`${agentCount} Total Agents`}
      showWalletStatus={true}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </ConsoleLayout>
  );
};

export default AgentManagementLayout;
