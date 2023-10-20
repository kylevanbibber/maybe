import React, { useState } from 'react';
import { updateAgent, deleteAgent } from '../api/agentsAPI';

function AgentRow({ agent, fetchAndDisplayAgents, agents }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAgent, setEditedAgent] = useState(agent);

  const contractLevels = ["AGT", "SA", "GA", "MGA", "RGA", "SGA"];

  const handleEditAgent = () => {
    setIsEditing(true);
  };

  const handleDeleteAgent = async (agentCode) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this agent?');
    if (isConfirmed) {
      await deleteAgent(agentCode);
      fetchAndDisplayAgents();
    }
  };

  const handleSave = async () => {
    try {
      await updateAgent(editedAgent.agent_code, editedAgent);
      setIsEditing(false);
      fetchAndDisplayAgents();
    } catch (error) {
      console.error("Error updating agent:", error);
    }
  };

  const getValidUplines = () => {
    const currentContractLevel = editedAgent.contract_level;
    const validUplines = agents.filter(a => {
      const uplineContractLevel = a.contract_level;

      if (currentContractLevel === "AGT") {
        return ["SA", "GA", "MGA", "SGA"].includes(uplineContractLevel);
      } else if (currentContractLevel === "SA") {
        return ["GA", "MGA", "SGA"].includes(uplineContractLevel);
      } else if (currentContractLevel === "GA") {
        return ["MGA", "SGA"].includes(uplineContractLevel);
      } else if (currentContractLevel === "MGA") {
        return ["RGA", "SGA"].includes(uplineContractLevel);
      } else if (currentContractLevel === "RGA") {
        return uplineContractLevel === "SGA";
      } else if (currentContractLevel === "SGA") {
        return false; // SGA has no upline
      }

      return false; // Default case, should not happen
    });

    return validUplines;
};



  const validUplines = getValidUplines();

  return (
    <tr>
      <td>{editedAgent.agent_code}</td>
      {isEditing ? (
        <>
          <td><input value={editedAgent.agent_name} onChange={e => setEditedAgent({...editedAgent, agent_name: e.target.value})} /></td>
          <td>
            <select value={editedAgent.contract_level} onChange={e => setEditedAgent({...editedAgent, contract_level: e.target.value})}>
              {contractLevels.map(level => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </td>
          <td>
            <select value={editedAgent.upline} onChange={e => setEditedAgent({...editedAgent, upline: e.target.value})}>
              <option value="">Select Upline</option>
              {validUplines.map(a => (
                <option key={a.agent_code} value={a.agent_code}>
                  {a.agent_name} ({a.contract_level})
                </option>
              ))}
            </select>
          </td>
          <td>
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </td>
        </>
      ) : (
        <>
          <td>{editedAgent.agent_name}</td>
          <td>{editedAgent.contract_level}</td>
          <td>{editedAgent.upline}</td>
          <td>
            <button onClick={handleEditAgent}>Edit</button>
            <button onClick={() => handleDeleteAgent(editedAgent.agent_code)}>Delete</button>
          </td>
        </>
      )}
    </tr>
  );
}

export default AgentRow;
