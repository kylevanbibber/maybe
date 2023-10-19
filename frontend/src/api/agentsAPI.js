


export const fetchAndDisplayAgents = () => {
    return fetch('/api/agents')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch agents. Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => data)
      .catch((error) => {
        console.error('Error fetching agents:', error);
        throw error;
      });
  };
  
  export const deleteAgent = (agentCode) => {
    return fetch(`/api/agents/${agentCode}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to delete agent with code ${agentCode}. Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => data)
      .catch((error) => {
        console.error('Error deleting agent:', error);
        throw error;
      });
  };
  
  export const addAgent = (data) => {
    return fetch('/api/agents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to add agent. Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => data)
      .catch((error) => {
        console.error('Error adding agent:', error);
        throw error;
      });
  };
  
  export const updateAgent = (agentCode, data) => {
    return fetch(`/api/agents/${agentCode}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to update agent with code ${agentCode}. Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => data)
      .catch((error) => {
        console.error('Error updating agent:', error);
        throw error;
      });
  };
  