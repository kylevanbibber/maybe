export const isUplineValid = (uplineAgentCode, agentContractLevel, agents) => {
  const uplineAgent = agents.find(agent => agent.agent_code === uplineAgentCode);

  if (!uplineAgent) {
    // Handle the case where the upline agent doesn't exist.
    return false;
  }

  const contractLevelOrder = ['SGA', 'RGA', 'MGA', 'GA', 'SA', 'AGT'];
  const uplineIndex = contractLevelOrder.indexOf(uplineAgent.contract_level);
  const agentIndex = contractLevelOrder.indexOf(agentContractLevel);

  return uplineIndex < agentIndex;
};
