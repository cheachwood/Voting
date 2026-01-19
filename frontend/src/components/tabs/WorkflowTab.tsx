import { WorkflowCard } from './WorkflowCard';

export const WorkflowTab = () => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Gestion du Workflow (Owner)</h3>

      <div className="space-y-4">
        <WorkflowCard title="Démarrer l'enregistrement des propositions" description="RegisteringVoters → ProposalsRegistrationStarted" isAvailable={true} onAction={() => console.log('Démarrer propositions')} buttonLabel="Démarrer" />

        <WorkflowCard
          title="Terminer l'enregistrement des propositions"
          description="ProposalsRegistrationStarted → ProposalsRegistrationEnded"
          isAvailable={false}
          onAction={() => console.log('Terminer propositions')}
          buttonLabel="Terminer"
          buttonColor="red"
        />

        <WorkflowCard title="Démarrer la session de vote" description="ProposalsRegistrationEnded → VotingSessionStarted" isAvailable={false} onAction={() => console.log('Démarrer vote')} buttonLabel="Démarrer" />

        <WorkflowCard title="Terminer la session de vote" description="VotingSessionStarted → VotingSessionEnded" isAvailable={false} onAction={() => console.log('Terminer vote')} buttonLabel="Terminer" buttonColor="red" />

        <WorkflowCard title="Compter les votes" description="VotingSessionEnded → VotesTallied" isAvailable={false} onAction={() => console.log('Compter votes')} buttonLabel="Compter" buttonColor="red" />
      </div>
    </div>
  );
};
