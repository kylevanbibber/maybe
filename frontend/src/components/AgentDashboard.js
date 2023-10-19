import React, { useState, useEffect } from 'react';
import AgentTable from './AgentTable';
import AddAgent from './AddAgent';
import { fetchAndDisplayAgents } from '../api/agentsAPI';

function AgentDashboard() {
  const [agents, setAgents] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  const fetchData = async () => {
    try {
      const data = await fetchAndDisplayAgents();
      if (data && data.results) {
        const sortedAgents = data.results.sort((a, b) => {
          if (typeof a.upline === "string" && typeof b.upline === "string") {
            return a.upline.localeCompare(b.upline);
          } else if (typeof a.upline === "number" && typeof b.upline === "number") {
            return a.upline - b.upline;
          } else {
            return 0;  // default case if upline is of some other type or if inconsistent
          }
        });

        setAgents(sortedAgents);
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  };

  useEffect(() => {
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
        fetchAndDisplayAgents={fetchData} // passing fetchData instead, so it sorts after each fetch
      />
    </div>
  );
}

export default AgentDashboard;
