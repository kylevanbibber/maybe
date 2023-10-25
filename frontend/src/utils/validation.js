export const isUplineValid = (uplineAgentCode, agentContractLevel, agents) => {
  const uplineAgent = agents.find(agent => agent.agent_code === Number(uplineAgentCode));

  if (!uplineAgent) {
    return false;
  }

  const contractLevelOrder = ['SGA', 'RGA', 'MGA', 'GA', 'SA', 'AGT'];
  const uplineIndex = contractLevelOrder.indexOf(uplineAgent.contract_level);
  const agentIndex = contractLevelOrder.indexOf(agentContractLevel);

  return uplineIndex < agentIndex;
};