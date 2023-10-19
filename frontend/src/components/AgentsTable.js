import React, { useState, useEffect } from 'react';

function AgentsTable() {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/agents')
      .then(response => response.json())
      .then(data => setAgents(data.results))
      .catch(error => console.error('Error fetching agents:', error));
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Agent Code</th>
          <th>Agent Name</th>
          <th>Contract Level</th>
          <th>Upline</th>
        </tr>
      </thead>
      <tbody>
        {agents.map((agent) => (
          <tr key={agent.agent_code}>
            <td>{agent.agent_code}</td>
            <td>{agent.agent_name}</td>
            <td>{agent.contract_level}</td>
            <td>{agent.upline}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AgentsTable;
