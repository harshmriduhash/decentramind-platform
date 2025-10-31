'use client';

import React, { ReactNode } from 'react';
import ConsoleLayout from '../shared/ConsoleLayout';

interface WorkflowLayoutProps {
  children: ReactNode;
}

const WorkflowLayout: React.FC<WorkflowLayoutProps> = ({ children }) => {
  return (
    <ConsoleLayout
      title="Agent Workflows"
      subtitle="Design, manage, and execute AI agent workflows"
      showWalletStatus={true}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </ConsoleLayout>
  );
};

export default WorkflowLayout;
