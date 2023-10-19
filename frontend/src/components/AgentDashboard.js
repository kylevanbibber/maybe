import React, { useState, useEffect, useCallback, useMemo } from 'react';
import AgentTable from './AgentTable';
import { fetchAndDisplayAgents } from '../api/agentsAPI';
import AgentForm from './AgentForm';

function AgentDashboard() {
  const [agents, setAgents] = useState([]);
  const [triggerSort, setTriggerSort] = useState(false);
  const contractLevels = useMemo(() => ["SGA", "RGA", "MGA", "GA", "SA", "AGT"], []);
  const [formData, setFormData] = useState({
    agentName: '',
    contractLevel: 'AGT',
    upline: ''
  });

  

  const sortAgents = useCallback((agentsArray) => {
    return agentsArray.sort((a, b) => {
      const levelDiff = contractLevels.indexOf(b.contract_level) - contractLevels.indexOf(a.contract_level);
      if (levelDiff !== 0) return levelDiff;

      if (a.upline < b.upline) return -1;
      if (a.upline > b.upline) return 1;
      return 0;
    });
  }, [contractLevels]);

  const addNewAgentToLocalState = (newAgent) => {
    setAgents(prevAgents => sortAgents([...prevAgents, newAgent]));
  };
  
  const fetchData = useCallback(async () => {
    try {
      const data = await fetchAndDisplayAgents();
      if (data && data.results) {
        const sortedAgents = sortAgents(data.results);
        setAgents(sortedAgents);
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  }, [sortAgents]);

  useEffect(() => {
    fetchData();
  }, [triggerSort, fetchData]);
  

  return (
    <div>
      <AgentForm 
  setAgents={setAgents} 
  agents={agents}
  formData={formData}
  addNewAgentToLocalState={addNewAgentToLocalState}
  fetchAndDisplayAgents={fetchAndDisplayAgents} 
  setFormData={setFormData}
  setTriggerSort={setTriggerSort}
  contractLevels={contractLevels} // Pass contract levels
/>

      <AgentTable 
        agents={agents} 
        fetchAndDisplayAgents={fetchAndDisplayAgents} 
      />
    </div>
  );
}

export default AgentDashboard;
