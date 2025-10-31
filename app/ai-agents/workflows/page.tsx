'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import TaskManagement from '../../components/TaskManagement';
import agentService from '../../services/agentService';

function WorkflowsContent() {
  const searchParams = useSearchParams();
  const agentId = searchParams.get('agentId');
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAgent = async () => {
      if (agentId) {
        try {
          // Get all agents and find the one with matching ID
          const agents = agentService.getAgentsSync();
          const agent = agents.find(a => a.id === agentId);
          
          if (agent) {
            setSelectedAgent({
              id: agent.id,
              name: agent.name,
              level: agent.level,
              capabilities: agent.capabilities || agent.skills || [],
              dmtBalance: 1000, // Mock balance
            });
          }
        } catch (error) {
          console.error('Failed to load agent:', error);
        }
      }
      setLoading(false);
    };

    loadAgent();
  }, [agentId]);

  const handleTaskCompleted = (agentId: string, xpGained: number, dmtSpent: number) => {
    console.log('Task completed:', { agentId, xpGained, dmtSpent });
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        color: 'white',
        fontSize: '18px'
      }}>
        Loading agent...
      </div>
    );
  }

  return (
    <TaskManagement 
      selectedAgent={selectedAgent}
      onTaskCompleted={handleTaskCompleted}
    />
  );
}

export default function AgentWorkflowsPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        color: 'white',
        fontSize: '18px'
      }}>
        Loading workflows...
      </div>
    }>
      <WorkflowsContent />
    </Suspense>
  );
}

