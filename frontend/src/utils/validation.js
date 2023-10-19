export const isUplineValid = (uplineContractLevel, agentContractLevel) => {
    const contractLevelOrder = ['SGA', 'RGA', 'MGA', 'GA', 'SA', 'AGT'];
    const uplineIndex = contractLevelOrder.indexOf(uplineContractLevel);
    const agentIndex = contractLevelOrder.indexOf(agentContractLevel);
    return uplineIndex < agentIndex;
  };
  