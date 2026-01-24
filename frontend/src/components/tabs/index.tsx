export type Proposal = {
  description: string;
  voteCount: bigint;
};

export const WorkflowStatusValues = {
  RegisteringVoters: 0,
  ProposalsRegistrationStarted: 1,
  ProposalsRegistrationEnded: 2,
  VotingSessionStarted: 3,
  VotingSessionEnded: 4,
  VotesTallied: 5,
} as const;

// On extrait les valeurs possibles (0 | 1 | 2 | 3 | 4 | 5)
export type WorkflowStatus = (typeof WorkflowStatusValues)[keyof typeof WorkflowStatusValues];

export interface WorkflowCardProps {
  title: string;
  description: string;
  isAvailable: boolean; // true = actif, false = disabled
  onAction: () => void; // Fonction à appeler au clic
  buttonLabel: string; // "Démarrer", "Terminer", "Compter"
  buttonColor?: 'blue' | 'red'; // Optionnel, "blue" par défaut
  worflowStatus: WorkflowStatus;
}
