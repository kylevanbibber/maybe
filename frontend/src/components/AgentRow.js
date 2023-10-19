import React from 'react';
import { deleteAgent } from '../api/agentsAPI';

function AgentRow({ agent, isEditMode, editAgent, setFormData, setIsEditMode, fetchAndDisplayAgents }) {
  
  const handleDeleteAgent = (agentCode) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this agent?');
    if (isConfirmed) {
      deleteAgent(agentCode).then(fetchAndDisplayAgents);
    }
  };

  const handleEditAgent = (agent) => {
    setIsEditMode(true);
    editAgent(agent); // This should be correct as `setEditAgent` was not passed as a prop, but rather `editAgent` was. 
    setFormData({
      agentName: agent.agent_name,
      contractLevel: agent.contract_level,
      upline: agent.upline,
    });
  };

  return (
    <tr>
      <td>{agent.agent_code}</td>
      <td>{agent.agent_name}</td>
      <td>{agent.contract_level}</td>
      <td>{agent.upline}</td>
      <td>
        <button onClick={() => handleEditAgent(agent)}>Edit</button>
        <button onClick={() => handleDeleteAgent(agent.agent_code)}>Delete</button>
      </td>
    </tr>
  );
}

export default AgentRow;
