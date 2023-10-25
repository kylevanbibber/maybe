import React, { useState, useEffect, useCallback } from 'react';
import { addAgent, updateAgent } from '../api/agentsAPI';
import { isUplineValid } from '../utils/validation';

const AgentForm = ({
  agents,
  formData,
  setFormData,
  isEditMode,
  editAgent,
  setIsEditMode,
  addNewAgentToLocalState,
}) => {
  const { agentName, contractLevel, upline } = formData;
  const [possibleUplines, setPossibleUplines] = useState([]);

  const updatePossibleUplines = useCallback((selectedContractLevel) => {
    let updatedUplines = [];
  
    if (selectedContractLevel === 'AGT') {
      updatedUplines = agents.filter((agent) => ['SA', 'GA', 'MGA', 'RGA', 'SGA'].includes(agent.contract_level));
      updatedUplines.push({ agent_code: '0', agent_name: 'Home Office', contract_level: 'SGA' });
    } else if (selectedContractLevel === 'SA') {
      updatedUplines = agents.filter((agent) => ['GA', 'MGA', 'RGA', 'SGA'].includes(agent.contract_level));
    } else if (selectedContractLevel === 'GA') {
      updatedUplines = agents.filter((agent) => ['MGA', 'RGA', 'SGA'].includes(agent.contract_level));
    } else if (selectedContractLevel === 'MGA') {
      updatedUplines = agents.filter((agent) => ['RGA', 'SGA'].includes(agent.contract_level));
    } else if (selectedContractLevel === 'RGA') {
      // Allow RGAs to select other RGAs, SGAs, and Home Office as uplines
      updatedUplines = agents.filter((agent) => ['RGA', 'SGA'].includes(agent.contract_level));
      updatedUplines.push({ agent_code: '0', agent_name: 'Home Office', contract_level: 'SGA' });
    } else if (selectedContractLevel === 'SGA') {
      // Allow SGAs to select other SGAs and Home Office as uplines
      updatedUplines = agents.filter((agent) => ['SGA'].includes(agent.contract_level));
      updatedUplines.push({ agent_code: '0', agent_name: 'Home Office', contract_level: 'SGA' });
    }
  
    setPossibleUplines(updatedUplines);
  }, [agents]);
  
  
  

  useEffect(() => {
    updatePossibleUplines(contractLevel);
  }, [contractLevel, agents, updatePossibleUplines]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isUplineValid(upline, contractLevel, agents)) {
      const newAgent = {
        agent_name: agentName,
        contract_level: contractLevel,
        upline: upline,
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
          upline: '',
        });
      } catch (error) {
        console.error('Error adding/updating agent:', error);
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
          onChange={(e) =>
            setFormData((prevState) => ({
              ...prevState,
              agentName: e.target.value,
            }))
          }
        />
      </label>

      <label>
        Contract Level:
        <select
          value={contractLevel}
          onChange={(e) => {
            const selectedContractLevel = e.target.value;
            setFormData((prevState) => ({
              ...prevState,
              contractLevel: selectedContractLevel,
            }));
            updatePossibleUplines(selectedContractLevel);
          }}
        >
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
          onChange={(e) =>
            setFormData((prevState) => ({
              ...prevState,
              upline: e.target.value,
            }))
          }
        >
          <option value="">Select Upline</option>
          {possibleUplines.map((agent) => (
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
