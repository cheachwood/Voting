export interface WorkflowCardProps {
  title: string;
  description: string;
  isAvailable: boolean; // true = actif, false = disabled
  onAction: () => void; // Fonction à appeler au clic
  buttonLabel: string; // "Démarrer", "Terminer", "Compter"
  buttonColor?: 'blue' | 'red'; // Optionnel, "blue" par défaut
}
