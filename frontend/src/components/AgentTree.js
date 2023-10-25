import React, { useState } from 'react';
import styles from './AgentTree.module.css';

const AgentTree = ({ agents }) => {
  const [expandedNodes, setExpandedNodes] = useState([]);

  const toggleNode = (agentCode) => {
    if (expandedNodes.includes(agentCode)) {
      setExpandedNodes(expandedNodes.filter((code) => code !== agentCode));
    } else {
      setExpandedNodes([...expandedNodes, agentCode]);
    }
  };

  const renderTree = (agent, level = 0) => {
    const subordinates = agents.filter((subAgent) => subAgent.upline === agent.agent_code);
    let totalSubordinates = subordinates.length;
  // Inside your renderTree function
const isExpanded = expandedNodes.includes(agent.agent_code);

// Use the isExpanded variable to conditionally apply the triangle class
<span
    className={`${styles['level-' + level]}`}
    onClick={() => toggleNode(agent.agent_code)}
>
    <span
        className={`${styles['AgentTree-nodeTriangle']} ${
            isExpanded ? styles['expanded'] : ''
        }`}
    ></span>
    {agent.agent_name} ({agent.contract_level}) ({totalSubordinates})
</span>

    // Recursively calculate the total number of downlines for this manager
    subordinates.forEach((subAgent) => {
      totalSubordinates += calculateTotalDownlines(subAgent);
    });

    const showDownlinesCount = agent.contract_level !== 'AGT';
  
    return (
      <ul>
        <li key={agent.agent_code}>
          <span
            className={`${styles['level-' + level]}`}
            onClick={() => toggleNode(agent.agent_code)}
          >
            {agent.agent_name} ({agent.contract_level}) ({totalSubordinates})
          </span>
          {expandedNodes.includes(agent.agent_code) && totalSubordinates > 0 && (
            <ul>
              {subordinates.map((subAgent) => (
                <li key={subAgent.agent_code}>
                  {renderTree(subAgent, level + 1)}
                </li>
              ))}
            </ul>
          )}
        </li>
      </ul>
    );
  };
  
  // Function to calculate the total number of downlines for an agent (including nested downlines)
  const calculateTotalDownlines = (agent) => {
    const subordinates = agents.filter((subAgent) => subAgent.upline === agent.agent_code);
    let totalSubordinates = subordinates.length;
  
    subordinates.forEach((subAgent) => {
      totalSubordinates += calculateTotalDownlines(subAgent);
    });
  
    return totalSubordinates;
  };
  
  

  return (
    <div>
      <h2>Agent Hierarchy</h2>
      <div className={styles['agent-tree']}>
        {agents
          .filter((agent) => agent.contract_level === 'SGA')
          .map((rootAgent) => renderTree(rootAgent))}
      </div>
    </div>
  );
};

export default AgentTree;