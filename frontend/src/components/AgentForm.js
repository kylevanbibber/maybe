import React, { useState, useEffect, useCallback } from 'react';
import { addAgent, updateAgent } from '../api/agentsAPI';
import { isUplineValid } from '../utils/validation';

const AgentForm = ({ agents, formData, setFormData, isEditMode, editAgent, setIsEditMode, addNewAgentToLocalState }) => {
  const { agentName, contractLevel, upline } = formData;
  const [possibleUplines, setPossibleUplines] = useState([]);

  const updatePossibleUplines = useCallback((selectedContractLevel) => {
    const updatedUplines = agents.filter(agent => isUplineValid(agent.agent_code, selectedContractLevel, agents));
    
    if (['AGT', 'SA', 'GA'].includes(selectedContractLevel)) {
      setPossibleUplines(updatedUplines.filter(agent => agent.contract_level !== 'RGA'));
    } else {
      setPossibleUplines(updatedUplines);
    }
  }, [agents]);

  useEffect(() => {
    updatePossibleUplines(contractLevel);
  }, [contractLevel, agents, updatePossibleUplines]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    console.log('Upline:', upline);
    console.log('Contract Level:', contractLevel);
    console.log('All Agents:', agents);
    

    if (isUplineValid(upline, contractLevel, agents)) {
      const newAgent = {
        agent_name: agentName,
        contract_level: contractLevel,
        upline: upline
      };
  
      try {
        if (isEditMode) {
          await updateAgent(editAgent.agent_code, newAgent);
          setIsEditMode(false);
        } else {
          const addedAgent = await addAgent(newAgent);
          addNewAgentToLocalState(addedAgent);
        }
  
        setFormData({
          agentName: '',
          contractLevel: 'AGT',
          upline: ''
        });
      } catch (error) {
        console.error("Error adding/updating agent:", error);
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
          onChange={(e) => {
            const selectedContractLevel = e.target.value;
            setFormData(prevState => ({
              ...prevState,
              contractLevel: selectedContractLevel
            }));
            updatePossibleUplines(selectedContractLevel);
          }}>
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
              {agent.agent_name} ({agent.contract_level})
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