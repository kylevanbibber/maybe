import React from 'react';
import AgentRow from './AgentRow';

function AgentTable({ agents, isEditMode, editAgent, setFormData, setIsEditMode, fetchAndDisplayAgents }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Agent Code</th>
          <th>Agent Name</th>
          <th>Contract</th>
          <th>Upline</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {agents.map((agent) => (
          <AgentRow 
            key={agent.agent_code} 
            agent={agent} 
            isEditMode={isEditMode}
            editAgent={editAgent}
            setFormData={setFormData}
            setIsEditMode={setIsEditMode}
            fetchAndDisplayAgents={fetchAndDisplayAgents}
            agents={agents}
          />
        ))}
      </tbody>
    </table>
  );
}

export default AgentTable;