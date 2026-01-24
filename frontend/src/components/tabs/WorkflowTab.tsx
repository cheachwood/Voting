import { WorkflowStatusValues } from '.';
import { WorkflowCard } from './WorkflowCard';
import { useVotingContract } from '../hooks/useVotingContract';

export const WorkflowTab = () => {
  const { wfStatus, startProposalsRegistering, endProposalsRegistering, startVotingSession, endVotingSession, tallyVotes } = useVotingContract();

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Gestion du Workflow (Owner)</h3>

      <div className="space-y-4">
        <WorkflowCard
          title="Démarrer l'enregistrement des propositions"
          description="RegisteringVoters → ProposalsRegistrationStarted"
          isAvailable={wfStatus === WorkflowStatusValues.RegisteringVoters}
          onAction={startProposalsRegistering}
          buttonLabel="Démarrer"
          worflowStatus={WorkflowStatusValues.ProposalsRegistrationStarted}
        />

        <WorkflowCard
          title="Terminer l'enregistrement des propositions"
          description="ProposalsRegistrationStarted → ProposalsRegistrationEnded"
          isAvailable={wfStatus === WorkflowStatusValues.ProposalsRegistrationStarted}
          onAction={endProposalsRegistering}
          buttonLabel="Terminer"
          buttonColor="red"
          worflowStatus={WorkflowStatusValues.ProposalsRegistrationEnded}
        />

        <WorkflowCard
          title="Démarrer la session de vote"
          description="ProposalsRegistrationEnded → VotingSessionStarted"
          isAvailable={wfStatus === WorkflowStatusValues.ProposalsRegistrationEnded}
          onAction={startVotingSession}
          buttonLabel="Démarrer"
          worflowStatus={WorkflowStatusValues.VotingSessionStarted}
        />

        <WorkflowCard
          title="Terminer la session de vote"
          description="VotingSessionStarted → VotingSessionEnded"
          isAvailable={wfStatus === WorkflowStatusValues.VotingSessionStarted}
          onAction={endVotingSession}
          buttonLabel="Terminer"
          buttonColor="red"
          worflowStatus={WorkflowStatusValues.VotingSessionEnded}
        />

        <WorkflowCard
          title="Compter les votes"
          description="VotingSessionEnded → VotesTallied"
          isAvailable={wfStatus === WorkflowStatusValues.VotingSessionEnded}
          onAction={tallyVotes}
          buttonLabel="Compter"
          buttonColor="red"
          worflowStatus={WorkflowStatusValues.VotesTallied}
        />
      </div>
    </div>
  );
};
