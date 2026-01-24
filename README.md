# 🗳️ Voting DApp

Application décentralisée (DApp) de vote construite avec React, TypeScript, Wagmi v3 et Solidity.

## 📋 Table des matières

- [Présentation](#présentation)
- [Architecture](#architecture)
- [Smart Contract](#smart-contract)
- [Frontend](#frontend)
- [Installation](#installation)
- [Utilisation](#utilisation)

## 🎯 Présentation

Cette DApp permet de gérer un système de vote décentralisé avec :

- Enregistrement des votants par l'owner
- Soumission de propositions par les votants
- Session de vote
- Dépouillement automatique
- Affichage des résultats

## 🏗️ Architecture

### Stack Technique

**Frontend :**

- React 18
- TypeScript
- Wagmi v3 (interaction blockchain)
- Viem (utilitaires Ethereum)
- Tailwind CSS (styling)
- Sonner (notifications)

**Smart Contract :**

- Solidity 0.8.28
- Hardhat (développement et tests)
- OpenZeppelin (Ownable)

## 📜 Smart Contract

### VotingCorrected.sol

Le contrat gère un workflow de vote en 6 étapes :

```
0. RegisteringVoters           → L'owner enregistre les votants
1. ProposalsRegistrationStarted → Les votants soumettent des propositions
2. ProposalsRegistrationEnded   → Fin de l'enregistrement des propositions
3. VotingSessionStarted         → Les votants votent pour une proposition
4. VotingSessionEnded           → Fin de la session de vote
5. VotesTallied                 → Dépouillement effectué, résultats disponibles
```

### Fonctionnalités Principales

**Pour l'Owner :**

- `addVoter(address)` - Enregistrer un votant
- `startProposalsRegistering()` - Démarrer l'enregistrement des propositions
- `endProposalsRegistering()` - Terminer l'enregistrement des propositions
- `startVotingSession()` - Démarrer la session de vote
- `endVotingSession()` - Terminer la session de vote
- `tallyVotes()` - Décompter les votes

**Pour les Votants :**

- `addProposal(string)` - Soumettre une proposition
- `setVote(uint)` - Voter pour une proposition
- `getVoter(address)` - Récupérer les infos d'un votant
- `getOneProposal(uint)` - Récupérer une proposition

### Optimisations

- **Storage Packing** : Structure `Voter` optimisée (80 bits dans un seul slot)
- **Gas Optimization** : `winningProposalID` mis à jour en temps réel (pas de boucle dans `tallyVotes`)
- **Anti-Spam** : Limite de 10 propositions par votant

## 🎨 Frontend

### 📁 Structure du Projet

```
frontend/
├── src/
│   ├── assets/                    # Ressources statiques
│   ├── components/
│   │   ├── hooks/
│   │   │   └── useVotingContract.ts   # Hook centralisé blockchain
│   │   └── tabs/
│   │       ├── index.tsx              # Types et constantes
│   │       ├── ProposalsTab.tsx       # Onglet propositions
│   │       ├── ResultsTab.tsx         # Onglet résultats
│   │       ├── Tabs.tsx               # Composant principal navigation
│   │       ├── VotersTab.tsx          # Onglet votants (owner)
│   │       ├── VoteTab.tsx            # Onglet vote
│   │       ├── WorkflowCard.tsx       # Carte workflow
│   │       └── WorkflowTab.tsx        # Onglet workflow (owner)
│   ├── ui/
│   │   └── sonner.tsx                 # Configuration toast notifications
│   ├── layout/
│   │   ├── Header.tsx                 # En-tête application
│   │   └── index.tsx
│   ├── lib/
│   │   ├── appkit.tsx                 # Configuration wallet
│   │   ├── index.tsx
│   │   ├── utils.ts                   # Fonctions utilitaires
│   │   └── votingContract.tsx         # Config contrat (address, ABI)
│   ├── styles/
│   │   ├── App.css
│   │   └── index.css
│   ├── App.tsx                        # Composant racine
│   └── main.tsx                       # Point d'entrée
├── public/
└── node_modules/
```

### Fichiers Clés

**`lib/votingContract.tsx`** - Configuration du contrat

```typescript
export const VOTING_ADDRESS = '0x...'  // À configurer après déploiement
export const VOTING_ABI = [...]         // ABI du contrat
export const CHAIN_ID = 31337          // Chain ID (31337 pour localhost)
```

**`components/hooks/useVotingContract.ts`** - Hook principal

- Centralise toutes les interactions blockchain
- Gère les watchers d'événements
- Optimise le chargement des données

**`components/tabs/`** - Composants d'interface

- Tous les onglets utilisent le hook `useVotingContract`
- Séparation claire entre logique (hook) et affichage (composants)

### Hook Principal : `useVotingContract`

Le hook centralise toute la logique d'interaction avec la blockchain :

```typescript
const {
  // States
  isOwner, // true si l'utilisateur est l'owner
  wfStatus, // Statut actuel du workflow (0-5)
  voters, // Liste des adresses enregistrées
  proposals, // Liste des propositions
  winningProposal, // Proposition gagnante (après tallyVotes)
  activeTab, // Onglet actif

  // Functions
  addVoter, // Ajouter un votant
  addProposal, // Ajouter une proposition
  vote, // Voter pour une proposition
  startProposalsRegistering,
  endProposalsRegistering,
  startVotingSession,
  endVotingSession,
  tallyVotes,
  getVoterInfo, // Récupérer les infos d'un votant
} = useVotingContract();
```

### Fonctionnalités Temps Réel

- **Watchers d'événements** : Les données se mettent à jour automatiquement
- **Chargement optimisé** : Les données ne se chargent que sur l'onglet actif
- **Synchronisation multi-utilisateurs** : Tous les utilisateurs voient les mêmes données en temps réel

### Permissions

- **Owner uniquement** :
  - Onglet "Votants" (enregistrement)
  - Onglet "Workflow" (gestion des étapes)
- **Votants enregistrés** :
  - Soumission de propositions
  - Vote pour une proposition
- **Tous** :
  - Consultation des propositions
  - Consultation des résultats (après dépouillement)

## 🚀 Installation

### Prérequis

- Node.js 18+
- Yarn ou npm
- MetaMask ou autre wallet compatible

### Backend (Smart Contract)

```bash
# Installer les dépendances
npm install

# Compiler le contrat
npx hardhat compile

# Démarrer un nœud local
npx hardhat node

# Déployer le contrat
npx hardhat run scripts/deploy.js --network localhost
```

### Frontend

```bash
# Installer les dépendances
npm install

# Configurer le contrat dans lib/votingContract.ts
export const VOTING_ADDRESS = '0x...' // Adresse du contrat déployé
export const CHAIN_ID = 31337         // ID de la chaîne locale

# Démarrer l'application
npm run dev
```

## 📖 Utilisation

### 1. Phase d'Enregistrement (Owner)

1. Connecter votre wallet en tant qu'owner
2. Aller sur l'onglet **Votants**
3. Ajouter les adresses des votants
4. Aller sur l'onglet **Workflow**
5. Cliquer sur **"Démarrer l'enregistrement des propositions"**

### 2. Phase de Propositions (Votants)

1. Connecter votre wallet (adresse enregistrée)
2. L'onglet **Propositions** s'affiche automatiquement
3. Soumettre vos propositions dans le formulaire
4. Les propositions apparaissent dans le tableau en temps réel

### 3. Terminer les Propositions (Owner)

1. Retourner sur l'onglet **Workflow**
2. Cliquer sur **"Terminer l'enregistrement des propositions"**

### 4. Phase de Vote (Owner puis Votants)

**Owner :**

1. Onglet **Workflow** → **"Démarrer la session de vote"**

**Votants :**

1. L'onglet **Voter** s'affiche automatiquement
2. Sélectionner une proposition
3. Cliquer sur **"Confirmer mon vote"**
4. Les compteurs de votes se mettent à jour en temps réel

### 5. Fin de Vote et Dépouillement (Owner)

1. Onglet **Workflow** → **"Terminer la session de vote"**
2. Onglet **Workflow** → **"Compter les votes"**

### 6. Résultats

1. L'onglet **Résultats** s'affiche automatiquement
2. La proposition gagnante est mise en évidence
3. Tous les votants peuvent consulter les résultats

## 🔧 Configuration

### Modifier l'Adresse du Contrat

```typescript
// lib/votingContract.ts
export const VOTING_ADDRESS = '0xYourContractAddress';
export const CHAIN_ID = 31337; // Localhost
```

### Modifier la Limite de Propositions

```solidity
// VotingCorrected.sol
uint public constant MAX_PROPOSALS_PER_VOTER = 10; // Modifier cette valeur
```

## 🐛 Dépannage

### "Already voted" alors que je n'ai pas voté

- Vérifiez que vous êtes connecté avec la bonne adresse
- Changez de compte MetaMask et reconnectez-vous

### Les données ne se mettent pas à jour

- Actualisez la page (F5)
- Vérifiez que votre nœud Hardhat est actif
- Vérifiez la connexion MetaMask

### "You're not a voter"

- Assurez-vous que votre adresse a été enregistrée par l'owner
- Vérifiez que vous êtes sur la bonne phase du workflow

## 📝 Notes Importantes

### Genesis Proposal

Le contrat crée automatiquement une proposition "GENESIS" à l'index 0 lors du démarrage de l'enregistrement des propositions. Cette proposition n'apparaît pas dans l'interface utilisateur mais existe dans le contrat.

### Décalage des Index

Dans le frontend, les propositions sont affichées avec des ID 1, 2, 3, 4...
Dans le contrat, elles sont aux index 1, 2, 3, 4... (0 étant GENESIS)

Le hook gère automatiquement ce décalage.

## 🎮 Tests

Pour tester l'application complète :

```bash
# Terminal 1 : Démarrer le nœud Hardhat
npx hardhat node

# Terminal 2 : Déployer et récupérer l'adresse
npx hardhat run scripts/deploy.js --network localhost

# Terminal 3 : Démarrer le frontend
npm run dev

# Dans MetaMask :
# - Ajouter le réseau localhost (RPC: http://127.0.0.1:8545, Chain ID: 31337)
# - Importer les comptes de test Hardhat
```

## 📄 Licence

MIT

---

Développé avec ❤️ et beaucoup de sueur, mais pas trop de jurons finalement
