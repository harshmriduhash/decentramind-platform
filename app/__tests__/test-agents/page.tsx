'use client';

import { useEffect, useState } from 'react';
import agentService from '../services/agentService';

export default function TestAgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testAgents = async () => {
      try {
        console.log('Testing agentService...');
        const agentData = await agentService.getAgents();
        console.log('Agent data received:', agentData);
        setAgents(agentData);
      } catch (err) {
        console.error('Error loading agents:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    testAgents();
  }, []);

  if (loading) {
    return <div>Loading agents...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Test Agents Page</h1>
      <p>Total agents: {agents.length}</p>
      {agents.map((agent, index) => (
        <div key={index}>
          <h3>{agent.name}</h3>
          <p>ID: {agent.id}</p>
          <p>Domain: {agent.domain}</p>
          <p>XP: {agent.xp}</p>
          <p>Level: {agent.level}</p>
        </div>
      ))}
    </div>
  );
}




