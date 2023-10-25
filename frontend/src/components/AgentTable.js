import React, { useState, useMemo } from 'react';
import AgentRow from './AgentRow';
import styles from './AgentTable.module.css';

function AgentTable({ agents, isEditMode, editAgent, setFormData, setIsEditMode, fetchAndDisplayAgents }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const filteredAndSortedAgents = useMemo(() => {
    // Filter agents based on search term
    const filteredAgents = agents.filter((agent) =>
      agent.agent_code.toString().includes(searchTerm) ||
      agent.agent_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.contract_level.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.upline.toString().includes(searchTerm)
    );

    // Sort agents based on the selected column and direction
    const sortedAgents = filteredAgents.slice().sort((a, b) => {
      if (sortColumn === 'agent_code') {
        return sortDirection === 'asc' ? a.agent_code - b.agent_code : b.agent_code - a.agent_code;
      } else if (sortColumn === 'agent_name') {
        return sortDirection === 'asc' ? a.agent_name.localeCompare(b.agent_name) : b.agent_name.localeCompare(a.agent_name);
      } else if (sortColumn === 'contract_level') {
        // Custom sorting logic for "Contract" column
        const contractOrder = ["SGA", "RGA", "MGA", "GA", "SA", "AGT"];
        const aIndex = contractOrder.indexOf(a.contract_level);
        const bIndex = contractOrder.indexOf(b.contract_level);
        return sortDirection === 'asc' ? aIndex - bIndex : bIndex - aIndex;
      } else if (sortColumn === 'upline') {
        return sortDirection === 'asc' ? a.upline - b.upline : b.upline - a.upline;
      }
      return 0;
    });

    return sortedAgents;
  }, [agents, searchTerm, sortColumn, sortDirection]);

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table className={styles.table}>
      <thead>
          <tr>
            <th onClick={() => handleSort('agent_code')}>
              Agent Code
              {sortColumn === 'agent_code' && (
                <span className={sortDirection === 'asc' ? styles.arrowUp : styles.arrowDown}></span>
              )}
            </th>
            <th onClick={() => handleSort('agent_name')}>
              Agent Name
              {sortColumn === 'agent_name' && (
                <span className={sortDirection === 'asc' ? styles.arrowUp : styles.arrowDown}></span>
              )}
            </th>
            <th onClick={() => handleSort('contract_level')}>
              Contract
              {sortColumn === 'contract_level' && (
                <span className={sortDirection === 'asc' ? styles.arrowUp : styles.arrowDown}></span>
              )}
            </th>
            <th onClick={() => handleSort('upline')}>
              Upline
              {sortColumn === 'upline' && (
                <span className={sortDirection === 'asc' ? styles.arrowUp : styles.arrowDown}></span>
              )}
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedAgents.map((agent) => (
            <AgentRow
              key={agent.agent_code}
              agent={agent}
              isEditMode={isEditMode}
              editAgent={editAgent}
              setFormData={setFormData}
              setIsEditMode={setIsEditMode}
              fetchAndDisplayAgents={fetchAndDisplayAgents}
              agents={agents}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AgentTable;
