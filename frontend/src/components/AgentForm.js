import React, { useState, useEffect } from 'react';
import { addAgent, updateAgent } from '../api/agentsAPI';
import { isUplineValid } from '../utils/validation';

const AgentForm = ({ agents, formData, setFormData, isEditMode, editAgent, setIsEditMode, addNewAgentToLocalState }) => {
  const { agentName, contractLevel, upline } = formData;
  const [possibleUplines, setPossibleUplines] = useState([]);

  useEffect(() => {
    // This updates the possible uplines based on the selected contract level
    const updatedUplines = agents.filter(agent => isUplineValid(agent.contractLevel, contractLevel));
    setPossibleUplines(updatedUplines);
  }, [contractLevel, agents]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isUplineValid(upline, contractLevel)) {
      const newAgent = {
        agent_name: agentName,
        contract_level: contractLevel,
        upline: upline
      };

      if (isEditMode) {
        updateAgent(editAgent.agent_code, newAgent).then(() => {
          setIsEditMode(false);
          setFormData({
            agentName: '',
            contractLevel: 'AGT',
            upline: ''
          });
        });
      } else {
        addAgent(newAgent).then((addedAgent) => {
          // Assuming the API returns the added agent with its unique agent_code
          addNewAgentToLocalState(addedAgent); 
          setFormData({
            agentName: '',
            contractLevel: 'AGT',
            upline: ''
          });
        });
      }
    } else {
      alert('Invalid upline. Please select a valid upline.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Agent Name:
        <input 
          type="text" 
          value={agentName} 
          onChange={(e) => setFormData(prevState => ({
            ...prevState,
            agentName: e.target.value
          }))} 
        />
      </label>

      <label>
        Contract Level:
        <select 
          value={contractLevel} 
          onChange={(e) => setFormData(prevState => ({
            ...prevState,
            contractLevel: e.target.value
          }))}>
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
        <select 
          value={upline} 
          onChange={(e) => setFormData(prevState => ({
            ...prevState,
            upline: e.target.value
          }))}>
          <option value="">Select Upline</option>
          {possibleUplines.map(agent => (
            <option key={agent.agent_code} value={agent.agent_code}>
              {agent.agent_name} ({agent.agent_code})
            </option>
          ))}
        </select>
      </label>
      
      <button type="submit">
        {isEditMode ? 'Update Agent' : 'Add Agent'}
      </button>
    </form>
  );
};

export default AgentForm;
