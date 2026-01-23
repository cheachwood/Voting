import { useEffect, useState } from 'react';
import { WorkflowStatusValues } from '.';
import { WorkflowCard } from './WorkflowCard';
import { useWriteContract, usePublicClient } from 'wagmi';
import { VOTING_ABI, VOTING_ADDRESS } from '@/lib/votingContract';

export const WorkflowTab = () => {
  const { mutateAsync } = useWriteContract();
  const publicClient = usePublicClient();
  const [wfStatus, setWfStatus] = useState(0);

  useEffect(() => {
    if (!publicClient) return;

    const unwatch = publicClient.watchContractEvent({
      address: VOTING_ADDRESS,
      abi: VOTING_ABI,
      eventName: 'WorkflowStatusChange',
      onLogs: (logs) => {
        const newStatus = Number(logs[0].args.newStatus);
        setWfStatus(newStatus);
        console.log('Nouveau status:', newStatus);
      },
    });

    // Charger le status initial
    const fetchInitialStatus = async () => {
      const events = await publicClient.getContractEvents({
        address: VOTING_ADDRESS,
        abi: VOTING_ABI,
        eventName: 'WorkflowStatusChange',
        fromBlock: 0n,
      });
      if (events.length > 0) {
        setWfStatus(Number(events[events.length - 1]?.args.newStatus));
      }
    };

    fetchInitialStatus();

    return () => unwatch();
  }, [publicClient]);

  const handleProposalsRegistrationStarted = async () => {
    await mutateAsync({
      address: VOTING_ADDRESS,
      abi: VOTING_ABI,
      functionName: 'startProposalsRegistering',
    });
  };

  const handleProposalsRegistrationEnded = async () => {
    await mutateAsync({
      address: VOTING_ADDRESS,
      abi: VOTING_ABI,
      functionName: 'endProposalsRegistering',
    });
  };

  const handleVotingSessionStarted = async () => {
    await mutateAsync({
      address: VOTING_ADDRESS,
      abi: VOTING_ABI,
      functionName: 'startVotingSession',
    });
  };

  const handleVotingSessionEnded = async () => {
    await mutateAsync({
      address: VOTING_ADDRESS,
      abi: VOTING_ABI,
      functionName: 'endVotingSession',
    });
  };

  const handleVotesTallied = async () => {
    await mutateAsync({
      address: VOTING_ADDRESS,
      abi: VOTING_ABI,
      functionName: 'tallyVotes',
    });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Gestion du Workflow (Owner)</h3>

      <div className="space-y-4">
        <WorkflowCard
          title="Démarrer l'enregistrement des propositions"
          description="RegisteringVoters → ProposalsRegistrationStarted"
          isAvailable={wfStatus === WorkflowStatusValues.RegisteringVoters}
          onAction={handleProposalsRegistrationStarted}
          buttonLabel="Démarrer"
          worflowStatus={WorkflowStatusValues.ProposalsRegistrationStarted}
        />

        <WorkflowCard
          title="Terminer l'enregistrement des propositions"
          description="ProposalsRegistrationStarted → ProposalsRegistrationEnded"
          isAvailable={wfStatus === WorkflowStatusValues.ProposalsRegistrationStarted}
          onAction={handleProposalsRegistrationEnded}
          buttonLabel="Terminer"
          buttonColor="red"
          worflowStatus={WorkflowStatusValues.ProposalsRegistrationEnded}
        />

        <WorkflowCard
          title="Démarrer la session de vote"
          description="ProposalsRegistrationEnded → VotingSessionStarted"
          isAvailable={wfStatus === WorkflowStatusValues.ProposalsRegistrationEnded}
          onAction={handleVotingSessionStarted}
          buttonLabel="Démarrer"
          worflowStatus={WorkflowStatusValues.VotingSessionStarted}
        />

        <WorkflowCard
          title="Terminer la session de vote"
          description="VotingSessionStarted → VotingSessionEnded"
          isAvailable={wfStatus === WorkflowStatusValues.VotingSessionStarted}
          onAction={handleVotingSessionEnded}
          buttonLabel="Terminer"
          buttonColor="red"
          worflowStatus={WorkflowStatusValues.VotingSessionEnded}
        />

        <WorkflowCard
          title="Compter les votes"
          description="VotingSessionEnded → VotesTallied"
          isAvailable={wfStatus === WorkflowStatusValues.VotingSessionEnded}
          onAction={handleVotesTallied}
          buttonLabel="Compter"
          buttonColor="red"
          worflowStatus={WorkflowStatusValues.VotesTallied}
        />
      </div>
    </div>
  );
};
