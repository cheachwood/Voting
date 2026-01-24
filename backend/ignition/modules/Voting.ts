import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

export default buildModule('VotingModule', (m) => {
  const voting = m.contract('VotingCorrected');

  return { voting };
});
