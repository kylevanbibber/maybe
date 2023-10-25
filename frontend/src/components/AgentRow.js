import React, { useState } from 'react';
import { updateAgent, deleteAgent } from '../api/agentsAPI';
import styles from './AgentRow.module.css';

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

  const isValidUpline = (editedAgent, agents) => {
    const uplineAgent = agents.find(agent => agent.agent_code === Number(editedAgent.upline));
    const currentContractLevel = editedAgent.contract_level;
  
    if (!uplineAgent) {
      return false;
    }
  
    // Define the valid upline contract levels based on the current contract level
    const validUplineContractLevels = {
      "AGT": ["SA", "GA", "MGA", "RGA", "SGA"],
      "SA": ["GA", "MGA", "RGA", "SGA"],
      "GA": ["MGA", "RGA", "SGA"],
      "MGA": ["RGA", "SGA"],
      "RGA": ["RGA", "SGA"], // Allow "SGA" and "MGA" as uplines for "RGA"
      "SGA": ["Home Office"], // SGAs can have "Home Office" as an upline
    };
  
    // Special case for SGAs with "Home Office" upline
    if (currentContractLevel === "SGA" && editedAgent.upline === "0") {
      return true;
    }
  
    const validUplines = agents.filter(a => {
      const uplineContractLevel = a.contract_level;
      return validUplineContractLevels[currentContractLevel]?.includes(uplineContractLevel);
    });
  
    return validUplines.some(a => a.agent_code === Number(editedAgent.upline));
  };
  

  const validUplines = isValidUpline(editedAgent, agents) ? agents.filter(a => a.agent_code !== editedAgent.agent_code) : [];

  const handleSave = async () => {
    try {
      // Add upline validation here
      if (isValidUpline(editedAgent, agents)) {
        await updateAgent(editedAgent.agent_code, editedAgent);
        setIsEditing(false);
        fetchAndDisplayAgents();
      } else {
        alert('Invalid upline. Please select a valid upline.');
      }
    } catch (error) {
      console.error("Error updating agent:", error);
    }
  };

  return (
    <tr className={styles.tr}>
      <td className={styles.td}>{editedAgent.agent_code}</td>
      {isEditing ? (
        <>
          <td className={styles.td}>
            <input 
              value={editedAgent.agent_name} 
              onChange={e => setEditedAgent({...editedAgent, agent_name: e.target.value})} 
            />
          </td>
          <td className={styles.td}>
            <select 
              value={editedAgent.contract_level} 
              onChange={e => setEditedAgent({...editedAgent, contract_level: e.target.value})}
            >
              {contractLevels.map(level => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </td>
          <td className={styles.td}>
            <select 
              value={editedAgent.upline} 
              onChange={e => setEditedAgent({...editedAgent, upline: e.target.value})}
            >
              <option value="">Select Upline</option>
              {validUplines.map(a => (
                <option key={a.agent_code} value={a.agent_code}>
                  {a.agent_name} ({a.contract_level})
                </option>
              ))}
            </select>
          </td>
          <td className={styles.td}>
            <button className={styles.button} onClick={handleSave}>Save</button>
            <button className={styles.button} onClick={() => setIsEditing(false)}>Cancel</button>
          </td>
        </>
      ) : (
        <>
          <td className={styles.td}>{editedAgent.agent_name}</td>
          <td className={styles.td}>{editedAgent.contract_level}</td>
          <td className={styles.td}>{editedAgent.upline}</td>
          <td className={styles.td}>
            <button className={styles.button} onClick={handleEditAgent}>Edit</button>
            <button className={styles.button} onClick={() => handleDeleteAgent(editedAgent.agent_code)}>Delete</button>
          </td>
        </>
      )}
    </tr>
  );
}

export default AgentRow;
