import React, { useState, useEffect } from 'react';
import AgentTable from './AgentTable';
import AddAgent from './AddAgent';
import { fetchAndDisplayAgents } from '../api/agentsAPI';

function AgentDashboard() {
  const [agents, setAgents] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchAndDisplayAgents();
        if (data && data.results) {
          setAgents(data.results);
        }
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    }

    fetchData();
  }, []);

  const handleEdit = (agent) => {
    setIsEditMode(true);
    setFormData(agent);
  };

  return (
    <div>
      <AddAgent 
        formData={formData} 
        setFormData={setFormData} 
        isEditMode={isEditMode} 
        setIsEditMode={setIsEditMode} 
        setAgents={setAgents} 
      />
      <AgentTable 
        agents={agents} 
        isEditMode={isEditMode} 
        editAgent={handleEdit} 
        setFormData={setFormData} 
        setIsEditMode={setIsEditMode}
        fetchAndDisplayAgents={fetchAndDisplayAgents} 
      />
    </div>
  );
}

export default AgentDashboard;
