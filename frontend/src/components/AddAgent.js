import React, { useState } from 'react';
import { addAgent, updateAgent } from '../api/agentsAPI';
import { isUplineValid } from '../utils/validation';

const AgentForm = ({ agents, isEditMode, editAgent, setFormData, formData, setIsEditMode, fetchAndDisplayAgents }) => {
  const [agentName, setAgentName] = useState('');
  const [contractLevel, setContractLevel] = useState('');
  const [upline, setUpline] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isUplineValid(upline, agents)) {
      const newAgent = { agentName, contractLevel, upline };

      if (isEditMode) {
        updateAgent(editAgent.agent_code).then(() => {
          setIsEditMode(false);
          setFormData({
            agentName: '',
            contractLevel: 'AGT',
            upline: '',
          });
          fetchAndDisplayAgents();
        });
      } else {
        addAgent(newAgent).then(() => {
          setFormData({
            agentName: '',
            contractLevel: 'AGT',
            upline: '',
          });
          fetchAndDisplayAgents();
        });
      }
    } else {
      alert('Invalid upline. Please enter a valid upline.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Agent Name:
        <input type="text" value={agentName} onChange={(e) => setAgentName(e.target.value)} />
      </label>
      <label>
        Contract Level:
        <select value={contractLevel} onChange={(e) => setContractLevel(e.target.value)}>
          <option value="">Select Contract Level</option>
          <option value="AGT">AGT</option>
          <option value="SA">SA</option>
          <option value="GA">GA</option>
          <option value="MGA">MGA</option>
          <option value="RGA">RGA</option>
          <option value="SGA">SGA</option>
        </select>
      </label>
      <label>
        Upline:
        <input type="text" value={upline} onChange={(e) => setUpline(e.target.value)} />
      </label>
      <button type="submit">Add Agent</button>
    </form>
  );
};

export default AgentForm;
