# 🚀 Guide Complet : Déploiement DApp sur Vercel + Contrat sur Sepolia avec Alchemy

Guide exhaustif pour déployer votre DApp de vote en production.

---

## 📋 Table des Matières

1. [Vue d'Ensemble](#vue-densemble)
2. [Prérequis](#prérequis)
3. [Partie 1 : Configuration Alchemy](#partie-1--configuration-alchemy)
4. [Partie 2 : Déploiement du Contrat sur Sepolia](#partie-2--déploiement-du-contrat-sur-sepolia)
5. [Partie 3 : Configuration du Frontend](#partie-3--configuration-du-frontend)
6. [Partie 4 : Déploiement sur Vercel](#partie-4--déploiement-sur-vercel)
7. [Partie 5 : Tests et Vérification](#partie-5--tests-et-vérification)
8. [Dépannage](#dépannage)
9. [Maintenance et Mises à Jour](#maintenance-et-mises-à-jour)

---

## 🎯 Vue d'Ensemble

### Architecture Finale

```
┌─────────────────┐
│   Utilisateur   │
│   (MetaMask)    │
└────────┬────────┘
         │
         ↓
┌─────────────────┐     ┌──────────────┐
│  Frontend sur   │────→│   Alchemy    │
│     Vercel      │     │   RPC API    │
└─────────────────┘     └──────┬───────┘
                               │
                               ↓
                        ┌──────────────┐
                        │   Sepolia    │
                        │  Blockchain  │
                        │  (Contrat)   │
                        └──────────────┘
```

### Technologies

- **Backend :** Solidity, Hardhat 3, Hardhat Ignition
- **Frontend :** React, TypeScript, Vite, Wagmi v3, Viem
- **RPC Provider :** Alchemy
- **Testnet :** Sepolia
- **Hébergement :** Vercel
- **Version Control :** Git, GitHub

---

## 🔑 Prérequis

### Comptes à Créer

- [ ] Compte GitHub
- [ ] Compte Alchemy (gratuit)
- [ ] Compte Vercel (gratuit)
- [ ] Compte MetaMask

### Logiciels Installés

- [ ] Node.js 18+ (`node --version`)
- [ ] npm ou yarn (`npm --version`)
- [ ] Git (`git --version`)
- [ ] Un éditeur de code (VS Code recommandé)

### Connaissances Requises

- [ ] Bases de Git/GitHub
- [ ] Bases de la ligne de commande
- [ ] Bases de Ethereum et MetaMask

### Fonds Nécessaires

- [ ] **0.1 SepoliaETH minimum** pour déployer le contrat
- [ ] SepoliaETH supplémentaires pour les tests

---

## Partie 1 : Configuration Alchemy

### Pourquoi Alchemy ?

Alchemy est un fournisseur RPC (Remote Procedure Call) qui permet :
- ✅ Connexion fiable à la blockchain Ethereum
- ✅ Support complet des events et logs
- ✅ Pas de limite de 50 000 blocs comme Infura
- ✅ Meilleure performance pour les `getContractEvents`
- ✅ WebSocket disponible pour les watchers en temps réel
- ✅ Dashboard avec analytics

### 1.1 Créer un Compte Alchemy

**Étapes :**

1. Allez sur **[https://www.alchemy.com](https://www.alchemy.com)**
2. Cliquez sur **"Sign Up"** (en haut à droite)
3. Inscrivez-vous avec :
   - Votre email professionnel ou personnel
   - Ou connectez-vous avec GitHub
4. Confirmez votre email
5. Complétez le questionnaire d'onboarding (optionnel)

### 1.2 Créer une App Sepolia

**Étapes :**

1. Une fois connecté, vous arrivez sur le **Dashboard**
2. Cliquez sur **"Create New App"** ou **"+ Create new app"**
3. Remplissez le formulaire :
   - **Name :** `Voting DApp` (ou un nom de votre choix)
   - **Description :** `Voting smart contract on Sepolia`
   - **Chain :** Sélectionnez **Ethereum**
   - **Network :** Sélectionnez **Sepolia** (testnet)
4. Cliquez sur **"Create App"**

### 1.3 Récupérer les Identifiants

**Étapes :**

1. Sur le Dashboard, cliquez sur votre nouvelle app **"Voting DApp"**
2. Vous verrez la page de l'app avec plusieurs informations
3. Dans la section **"API Key"** ou **"Endpoints"**, vous verrez :

```
HTTPS Endpoint
https://eth-sepolia.g.alchemy.com/v2/abc123def456...
                                        ↑
                                    Votre API Key
```

4. **Copiez l'URL complète** : `https://eth-sepolia.g.alchemy.com/v2/abc123def456...`

**Note :** Vous pouvez aussi copier juste l'API Key : `abc123def456...`

### 1.4 (Optionnel) WebSocket pour Watchers Temps Réel

Si vous voulez que les watchers d'événements fonctionnent en temps réel :

```
WSS Endpoint
wss://eth-sepolia.g.alchemy.com/v2/abc123def456...
```

Copiez également cette URL pour plus tard.

---

## Partie 2 : Déploiement du Contrat sur Sepolia

### 2.1 Préparer l'Environnement Backend

**Structure attendue :**

```
projet/
├── backend/
│   ├── contracts/
│   │   └── VotingCorrected.sol
│   ├── ignition/
│   │   └── modules/
│   │       └── VotingModule.ts
│   ├── hardhat.config.ts
│   ├── package.json
│   └── .env (à créer)
└── frontend/
    └── ...
```

### 2.2 Installer les Dépendances

**Depuis le dossier `backend/` :**

```bash
cd backend
npm install
```

**Vérifiez que ces packages sont installés :**

```bash
npm list dotenv
npm list @nomicfoundation/hardhat-toolbox-viem
```

Si manquants, installez-les :

```bash
npm install dotenv
npm install --save-dev @nomicfoundation/hardhat-toolbox-viem
```

### 2.3 Créer le Fichier .env

**Dans `backend/`, créez un fichier `.env` :**

**Sur WSL/Linux/Mac :**
```bash
touch .env
```

**Sur Windows (PowerShell) :**
```powershell
New-Item -ItemType File -Force -Path .env
```

**Ouvrez `.env` et ajoutez :**

```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/VOTRE_API_KEY
SEPOLIA_PRIVATE_KEY=votre_clé_privée_metamask_sans_0x
```

**Exemple concret :**

```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/yF30cHt5yFXxN8bo9HBS6
SEPOLIA_PRIVATE_KEY=ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

⚠️ **IMPORTANT :**
- Remplacez `VOTRE_API_KEY` par votre vraie API Key Alchemy
- Remplacez `votre_clé_privée_metamask_sans_0x` par votre vraie clé privée **SANS** le préfixe `0x`
- **N'utilisez JAMAIS votre compte principal** - créez un compte de test dédié

### 2.4 Sécuriser le .env

**Ajoutez `.env` au `.gitignore` :**

```bash
echo ".env" >> .gitignore
```

**Vérifiez :**

```bash
cat .gitignore | grep .env
```

Vous devriez voir `.env` dans la liste.

### 2.5 Configurer Hardhat

**Ouvrez `hardhat.config.ts` et vérifiez/modifiez :**

```typescript
import hardhatToolboxViemPlugin from '@nomicfoundation/hardhat-toolbox-viem';
import { defineConfig } from 'hardhat/config';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

export default defineConfig({
  plugins: [hardhatToolboxViemPlugin],
  solidity: {
    profiles: {
      default: {
        version: '0.8.28',
      },
      production: {
        version: '0.8.28',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    localhost: {
      type: 'http',
      chainType: 'l1',
      url: 'http://127.0.0.1:8545',
    },
    sepolia: {
      type: 'http',
      chainType: 'l1',
      url: process.env.SEPOLIA_RPC_URL!,
      accounts: [process.env.SEPOLIA_PRIVATE_KEY!],
    },
  },
});
```

### 2.6 Créer le Module Ignition

**Structure attendue :**

```
backend/
└── ignition/
    └── modules/
        └── VotingModule.ts
```

**Créez les dossiers si nécessaire :**

```bash
mkdir -p ignition/modules
```

**Créez `ignition/modules/VotingModule.ts` :**

```typescript
import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

export default buildModule('VotingModule', (m) => {
  const voting = m.contract('VotingCorrected');

  return { voting };
});
```

### 2.7 Obtenir des SepoliaETH

**Pourquoi ?**
Vous avez besoin de SepoliaETH (ETH de test) pour payer les frais de gas du déploiement.

**Faucets Recommandés :**

1. **Alchemy Faucet** (le plus simple) :
   - [https://www.alchemy.com/faucets/ethereum-sepolia](https://www.alchemy.com/faucets/ethereum-sepolia)
   - Connectez-vous avec votre compte Alchemy
   - Collez votre adresse MetaMask
   - Recevez 0.5 SepoliaETH

2. **Infura Faucet** :
   - [https://www.infura.io/faucet/sepolia](https://www.infura.io/faucet/sepolia)
   - Nécessite un compte Infura

3. **QuickNode Faucet** :
   - [https://faucet.quicknode.com/ethereum/sepolia](https://faucet.quicknode.com/ethereum/sepolia)

**Vérification :**

Après avoir demandé des ETH, vérifiez votre balance :
- Dans MetaMask (assurez-vous d'être sur Sepolia)
- Ou sur Etherscan : `https://sepolia.etherscan.io/address/VOTRE_ADRESSE`

**Vous devriez avoir au minimum 0.05 SepoliaETH.**

### 2.8 Compiler le Contrat

```bash
npx hardhat compile
```

**Sortie attendue :**

```
Compiled 1 Solidity file successfully (evm target: paris).
```

**En cas d'erreur :**
- Vérifiez la syntaxe de votre contrat
- Vérifiez la version Solidity dans `hardhat.config.ts`

### 2.9 Déployer sur Sepolia

```bash
npx hardhat ignition deploy ignition/modules/VotingModule.ts --network sepolia --deployment-id sepolia-prod-v1
```

**Explication des paramètres :**
- `--network sepolia` : Déploie sur le réseau Sepolia
- `--deployment-id sepolia-prod-v1` : Identifiant unique pour ce déploiement

**Interaction attendue :**

```
√ Confirm deploy to network sepolia (11155111)? ... yes
```

Tapez **Yes** et appuyez sur Entrée.

**Sortie attendue :**

```
Hardhat Ignition 🚀

Deploying [ VotingModule ]

Batch #1
  Executed VotingModule#VotingCorrected

[ VotingModule ] successfully deployed 🚀

Deployed Addresses

VotingModule#VotingCorrected - 0x00bDc3021D57c4bAc9dc0d96a77ad897AB8AC03f
```

**🎉 Succès ! Notez cette adresse : `0x00bDc3021D57c4bAc9dc0d96a77ad897AB8AC03f`**

### 2.10 Vérifier le Déploiement sur Etherscan

1. Allez sur **[https://sepolia.etherscan.io](https://sepolia.etherscan.io)**
2. Collez l'adresse du contrat dans la barre de recherche
3. Vous devriez voir :
   - ✅ Le contrat avec son bytecode
   - ✅ La transaction de création
   - ✅ Le solde (0 ETH normalement)

**Trouvez le numéro de bloc :**

Sur la page du contrat, regardez dans les transactions.
La première transaction (Contract Creation) a un numéro de bloc, par exemple : **Block: 10126656**

**Notez ce numéro, vous en aurez besoin pour le frontend.**

### 2.11 (Optionnel) Vérifier le Code Source

**Pourquoi ?**
- Rend le code source public sur Etherscan
- Permet aux utilisateurs d'interagir directement depuis Etherscan
- Augmente la transparence et la confiance

**Étapes :**

1. Obtenez une API Key Etherscan :
   - [https://etherscan.io/register](https://etherscan.io/register)
   - Allez dans "API Keys"
   - Créez une nouvelle clé

2. Ajoutez-la dans `.env` :

```env
ETHERSCAN_API_KEY=votre_clé_etherscan
```

3. Modifiez `hardhat.config.ts` :

```typescript
export default defineConfig({
  // ... config existante
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY!,
  },
});
```

4. Vérifiez le contrat :

```bash
npx hardhat verify --network sepolia 0x00bDc3021D57c4bAc9dc0d96a77ad897AB8AC03f
```

**Succès :**

```
Successfully verified contract VotingCorrected on Etherscan.
https://sepolia.etherscan.io/address/0x00bDc3021D57c4bAc9dc0d96a77ad897AB8AC03f#code
```

---

## Partie 3 : Configuration du Frontend

### 3.1 Copier l'ABI du Contrat

L'ABI (Application Binary Interface) permet au frontend de communiquer avec le contrat.

**Depuis le dossier `backend/` :**

```bash
cp artifacts/contracts/VotingCorrected.sol/VotingCorrected.json ../frontend/src/lib/VotingCorrected.json
```

**Vérifiez :**

```bash
ls -l ../frontend/src/lib/VotingCorrected.json
```

Le fichier doit exister.

### 3.2 Mettre à Jour votingContract.tsx

**Ouvrez `frontend/src/lib/votingContract.tsx` :**

**Remplacez TOUT le contenu par :**

```typescript
import VotingArtifact from './VotingCorrected.json';

export const VOTING_ADDRESS = '0x00bDc3021D57c4bAc9dc0d96a77ad897AB8AC03f'; // ← Votre adresse de contrat
export const CHAIN_ID = 11155111; // Sepolia
export const VOTING_ABI = VotingArtifact.abi;
```

⚠️ **Remplacez `0x00bDc3021D57c4bAc9dc0d96a77ad897AB8AC03f` par VOTRE adresse de contrat.**

### 3.3 Mettre à Jour useVotingContract.ts

**Ouvrez `frontend/src/components/hooks/useVotingContract.ts` :**

**Trouvez la ligne (tout en haut, ligne 9 environ) :**

```typescript
const DEPLOYMENT_BLOCK = 10115418n;
```

**Remplacez par votre numéro de bloc :**

```typescript
const DEPLOYMENT_BLOCK = 10126656n; // ← Votre numéro de bloc trouvé sur Etherscan
```

### 3.4 Tester Localement

**Depuis `frontend/` :**

```bash
cd frontend
npm install
npm run dev
```

**Ouvrez votre navigateur :**

```
http://localhost:5173
```

**Tests à faire :**

1. **Connectez MetaMask** (assurez-vous d'être sur Sepolia)
2. **Vérifiez que l'adresse s'affiche** en haut
3. **Testez l'enregistrement d'un votant** (si vous êtes owner)
4. **Testez le workflow complet** si possible

**Si ça marche localement, vous êtes prêt pour Vercel ! 🚀**

---

## Partie 4 : Déploiement sur Vercel

### 4.1 Préparer le Repository GitHub

**Étapes :**

1. **Assurez-vous que `.env` est dans `.gitignore`** :

```bash
cat frontend/.gitignore | grep .env
cat backend/.gitignore | grep .env
```

Si absent, ajoutez-le :

```bash
echo ".env" >> backend/.gitignore
echo ".env" >> frontend/.gitignore
```

2. **Commitez tous vos changements :**

```bash
git add .
git commit -m "Ready for Vercel deployment with Alchemy"
git status
```

Le `git status` doit montrer : `nothing to commit, working tree clean`

3. **Poussez sur GitHub :**

```bash
git push origin main
```

Ou si vous utilisez `master` :

```bash
git push origin master
```

### 4.2 Créer un Compte Vercel

**Étapes :**

1. Allez sur **[https://vercel.com](https://vercel.com)**
2. Cliquez sur **"Sign Up"**
3. Choisissez **"Continue with GitHub"**
4. Autorisez Vercel à accéder à vos repositories
5. Complétez votre profil si demandé

### 4.3 Importer le Projet

**Étapes :**

1. Sur le Dashboard Vercel, cliquez sur **"Add New..."** → **"Project"**
2. Vous voyez la liste de vos repositories GitHub
3. Trouvez votre projet (ex: `Voting`)
4. Cliquez sur **"Import"** à côté du nom du projet

### 4.4 Configurer le Build

**Vercel va détecter automatiquement que c'est un projet Vite.**

**Configuration à vérifier/modifier :**

1. **Framework Preset :** `Vite` (détecté automatiquement)

2. **Root Directory :**
   - Si votre structure est `projet/frontend/`, cliquez sur **"Edit"**
   - Sélectionnez **`frontend`** comme root directory
   - Si votre frontend est à la racine, laissez `./`

3. **Build and Output Settings :**
   - **Build Command :** `npm run build` (ou `vite build`)
   - **Output Directory :** `dist`
   - **Install Command :** `npm install`

4. **Environment Variables :**
   - Pour l'instant, laissez vide (pas besoin)
   - Vos valeurs sont déjà dans le code

### 4.5 Déployer

**Cliquez sur "Deploy"**

Vercel va :
1. ✅ Cloner votre repository
2. ✅ Installer les dépendances (`npm install`)
3. ✅ Builder le projet (`npm run build`)
4. ✅ Déployer les fichiers statiques
5. ✅ Vous donner une URL

**Temps estimé : 1-3 minutes**

**Pendant le déploiement, vous voyez les logs en temps réel :**

```
Running "install" command: `npm install`
✓ Dependencies installed

Running "build" command: `vite build`
✓ Build completed

Uploading build outputs...
✓ Upload complete

Deployment complete!
```

### 4.6 Récupérer l'URL

**Une fois le déploiement terminé :**

Vercel vous affiche l'URL de votre application :

```
https://voting-dapp-xyz123.vercel.app
```

**🎉 Votre DApp est en ligne !**

### 4.7 Configurer un Domaine Personnalisé (Optionnel)

**Si vous avez un nom de domaine :**

1. Allez dans **Settings** → **Domains**
2. Cliquez sur **"Add"**
3. Entrez votre domaine : `voting.monsite.com`
4. Suivez les instructions pour configurer les DNS
5. Vercel génère automatiquement un certificat SSL

---

## Partie 5 : Tests et Vérification

### 5.1 Tests Fonctionnels de Base

**Ouvrez votre URL Vercel dans un navigateur.**

**Checklist :**

- [ ] La page s'affiche correctement
- [ ] Le bouton "Connect Wallet" est visible
- [ ] Aucune erreur dans la console (F12 → Console)

### 5.2 Tests de Connexion MetaMask

**Étapes :**

1. **Ouvrez MetaMask**
2. **Basculez sur le réseau Sepolia** (en haut de MetaMask)
3. **Sur votre DApp, cliquez sur "Connect Wallet"**
4. **Acceptez la connexion dans MetaMask**
5. **Vérifiez que votre adresse s'affiche**

**En cas d'erreur :**
- Vérifiez que vous êtes bien sur Sepolia
- Rafraîchissez la page (F5)
- Videz le cache (Ctrl+Shift+R)

### 5.3 Tests Owner (Enregistrement de Votants)

**Si vous êtes connecté avec le compte owner (celui qui a déployé) :**

1. **Allez sur l'onglet "Votants"**
2. **Ajoutez une adresse de test**
3. **Confirmez la transaction dans MetaMask**
4. **Attendez la confirmation** (10-30 secondes)
5. **Vérifiez que l'adresse apparaît dans la liste**

### 5.4 Tests Workflow Complet

**En tant qu'Owner :**

1. **Enregistrez au moins 2 votants**
2. **Allez sur "Workflow"**
3. **Démarrez l'enregistrement des propositions**
4. **Confirmez dans MetaMask**

**En tant que Votant (changez de compte MetaMask) :**

1. **Reconnectez-vous avec un compte votant**
2. **Allez sur "Propositions"**
3. **Soumettez une proposition**
4. **Vérifiez qu'elle apparaît**

**Continuez le workflow :**

1. **Retour Owner : terminez l'enregistrement des propositions**
2. **Démarrez la session de vote**
3. **Retour Votant : votez pour une proposition**
4. **Retour Owner : terminez le vote et dépouillez**
5. **Consultez les résultats**

**✅ Si tout fonctionne, votre DApp est 100% opérationnelle !**

### 5.5 Tests Multi-Navigateurs

**Testez sur différents navigateurs :**

- [ ] Chrome/Brave
- [ ] Firefox
- [ ] Safari (si Mac)
- [ ] Edge

### 5.6 Tests Mobile

**Sur mobile avec MetaMask App :**

1. **Installez MetaMask sur mobile**
2. **Ouvrez le navigateur intégré de MetaMask**
3. **Allez sur votre URL Vercel**
4. **Testez la connexion et les interactions**

---

## 🐛 Dépannage

### Problème 1 : "Cannot connect to wallet"

**Causes possibles :**
- MetaMask n'est pas installé
- MetaMask est verrouillé
- Mauvais réseau sélectionné

**Solutions :**
1. Installez MetaMask : [https://metamask.io](https://metamask.io)
2. Déverrouillez MetaMask
3. Basculez sur Sepolia dans MetaMask
4. Rafraîchissez la page

### Problème 2 : "The contract function 'owner' returned no data"

**Causes possibles :**
- Mauvaise adresse de contrat
- Mauvais réseau
- ABI obsolète

**Solutions :**
1. Vérifiez `VOTING_ADDRESS` dans `votingContract.tsx`
2. Vérifiez que MetaMask est sur Sepolia (Chain ID 11155111)
3. Recopiez l'ABI : `cp backend/artifacts/.../VotingCorrected.json frontend/src/lib/`
4. Redéployez sur Vercel

### Problème 3 : "You're not a voter"

**Cause :**
L'adresse connectée n'est pas enregistrée comme votant.

**Solution :**
1. Connectez-vous avec le compte owner
2. Enregistrez l'adresse problématique
3. Reconnectez-vous avec cette adresse

### Problème 4 : "Exceed maximum block range: 50000"

**Cause :**
Le RPC ne supporte pas les requêtes depuis le bloc 0.

**Solution :**
1. Vérifiez que vous utilisez bien Alchemy, pas Infura
2. Mettez à jour `DEPLOYMENT_BLOCK` dans `useVotingContract.ts`
3. Utilisez le vrai bloc de déploiement trouvé sur Etherscan

### Problème 5 : Build Vercel échoue

**Causes possibles :**
- Dépendances manquantes
- Erreurs TypeScript
- Mauvaise configuration build

**Solutions :**

1. **Vérifiez les logs de build** sur Vercel
2. **Testez le build localement :**

```bash
cd frontend
npm run build
```

3. **Si erreurs TypeScript :**
   - Corrigez les erreurs affichées
   - Commitez et poussez

4. **Si dépendances manquantes :**

```bash
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

5. **Redéployez** (automatique après push ou manuel sur Vercel)

### Problème 6 : Vercel déploie mais l'app ne fonctionne pas

**Causes possibles :**
- Erreurs JavaScript dans la console
- Variables d'environnement manquantes
- Configuration du build incorrecte

**Solutions :**

1. **Ouvrez la console (F12) sur le site Vercel**
2. **Regardez les erreurs**
3. **Vérifiez que `VOTING_ADDRESS` est correct** dans le code
4. **Vérifiez que `CHAIN_ID` est 11155111**
5. **Vérifiez que l'ABI est à jour**

### Problème 7 : Transactions échouent

**Causes possibles :**
- Pas assez de gas
- Mauvais paramètres
- État du contrat incorrect

**Solutions :**

1. **Vérifiez votre balance SepoliaETH** dans MetaMask
2. **Lisez le message d'erreur** dans MetaMask
3. **Vérifiez l'état du workflow** (bonne phase ?)
4. **Consultez la transaction sur Etherscan** pour plus de détails

### Problème 8 : Les events ne se chargent pas

**Cause :**
Le `DEPLOYMENT_BLOCK` est incorrect ou trop ancien.

**Solution :**

1. Trouvez le vrai bloc sur Etherscan
2. Mettez à jour dans `useVotingContract.ts`
3. Commitez et poussez

### Problème 9 : "Out of gas"

**Cause :**
Pas assez de SepoliaETH pour payer le gas.

**Solution :**

1. Obtenez plus de SepoliaETH depuis un faucet
2. Vérifiez votre balance : `https://sepolia.etherscan.io/address/VOTRE_ADRESSE`
3. Réessayez la transaction

---

## 🔄 Maintenance et Mises à Jour

### Mettre à Jour le Contrat

**Si vous devez modifier et redéployer le contrat :**

1. **Modifiez le contrat Solidity**
2. **Recompilez :**

```bash
npx hardhat compile
```

3. **Redéployez avec un nouveau deployment-id :**

```bash
npx hardhat ignition deploy ignition/modules/VotingModule.ts --network sepolia --deployment-id sepolia-prod-v2
```

4. **Notez la nouvelle adresse**
5. **Mettez à jour le frontend :**
   - Copiez le nouvel ABI
   - Mettez à jour `VOTING_ADDRESS`
   - Mettez à jour `DEPLOYMENT_BLOCK`

6. **Commitez et poussez :**

```bash
git add .
git commit -m "Update contract to v2"
git push
```

Vercel redéploie automatiquement.

### Mettre à Jour le Frontend Seulement

**Si vous modifiez juste le frontend :**

1. **Faites vos modifications**
2. **Testez localement :**

```bash
npm run dev
```

3. **Commitez et poussez :**

```bash
git add .
git commit -m "Update UI"
git push
```

Vercel redéploie en 1-3 minutes.

### Monitorer l'Application

**Dashboard Vercel :**

1. Allez sur [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet
3. Vous voyez :
   - **Déploiements récents**
   - **Analytics** (visites, performance)
   - **Logs** (erreurs)

**Dashboard Alchemy :**

1. Allez sur [https://dashboard.alchemy.com](https://dashboard.alchemy.com)
2. Sélectionnez votre app
3. Vous voyez :
   - **Nombre de requêtes**
   - **Latence**
   - **Erreurs**
   - **Limite de l'API**

### Rollback (Retour en Arrière)

**Si un déploiement cause des problèmes :**

1. **Sur Vercel Dashboard**, allez dans **Deployments**
2. **Trouvez un déploiement précédent** qui fonctionnait
3. **Cliquez sur "..."** → **"Promote to Production"**
4. Votre site revient instantanément à cette version

---

## 📊 Checklist Finale

### Backend

- [ ] Contrat compilé sans erreur
- [ ] `.env` configuré avec Alchemy
- [ ] `.env` dans `.gitignore`
- [ ] Contrat déployé sur Sepolia
- [ ] Adresse du contrat notée
- [ ] Bloc de déploiement noté
- [ ] Contrat visible sur Etherscan
- [ ] (Optionnel) Code source vérifié sur Etherscan

### Frontend

- [ ] ABI copié depuis `backend/artifacts`
- [ ] `VOTING_ADDRESS` mis à jour
- [ ] `DEPLOYMENT_BLOCK` mis à jour
- [ ] Build local réussi (`npm run build`)
- [ ] Tests locaux réussis
- [ ] Code poussé sur GitHub
- [ ] `.env` dans `.gitignore`

### Vercel

- [ ] Compte Vercel créé
- [ ] Projet importé depuis GitHub
- [ ] Root directory configuré (`frontend` si nécessaire)
- [ ] Build settings corrects
- [ ] Déploiement réussi
- [ ] URL Vercel fonctionnelle
- [ ] Tests en production réussis

### Tests

- [ ] Connexion MetaMask fonctionne
- [ ] Enregistrement votants fonctionne
- [ ] Soumission propositions fonctionne
- [ ] Vote fonctionne
- [ ] Workflow complet fonctionne
- [ ] Résultats s'affichent correctement
- [ ] Testé sur plusieurs navigateurs
- [ ] Testé sur mobile

---

## 🎯 Commandes Résumées

### Backend - Déploiement

```bash
cd backend
npm install
npm install dotenv
npx hardhat compile
npx hardhat ignition deploy ignition/modules/VotingModule.ts --network sepolia --deployment-id sepolia-prod-v1
```

### Frontend - Préparation

```bash
cd frontend
cp ../backend/artifacts/contracts/VotingCorrected.sol/VotingCorrected.json src/lib/
# Modifier votingContract.tsx et useVotingContract.ts
npm run build
git add .
git commit -m "Ready for production"
git push origin main
```

### Vercel - Déploiement

1. Aller sur [vercel.com](https://vercel.com)
2. Importer le projet GitHub
3. Configurer Root Directory : `frontend`
4. Cliquer sur "Deploy"

---

## 📚 Ressources

### Documentation Officielle

- **Hardhat :** [https://hardhat.org/docs](https://hardhat.org/docs)
- **Vite :** [https://vitejs.dev](https://vitejs.dev)
- **Wagmi :** [https://wagmi.sh](https://wagmi.sh)
- **Viem :** [https://viem.sh](https://viem.sh)
- **Vercel :** [https://vercel.com/docs](https://vercel.com/docs)
- **Alchemy :** [https://docs.alchemy.com](https://docs.alchemy.com)

### Outils

- **Sepolia Etherscan :** [https://sepolia.etherscan.io](https://sepolia.etherscan.io)
- **Alchemy Dashboard :** [https://dashboard.alchemy.com](https://dashboard.alchemy.com)
- **Vercel Dashboard :** [https://vercel.com/dashboard](https://vercel.com/dashboard)
- **MetaMask :** [https://metamask.io](https://metamask.io)

### Faucets

- **Alchemy Faucet :** [https://www.alchemy.com/faucets/ethereum-sepolia](https://www.alchemy.com/faucets/ethereum-sepolia)
- **Infura Faucet :** [https://www.infura.io/faucet/sepolia](https://www.infura.io/faucet/sepolia)
- **QuickNode Faucet :** [https://faucet.quicknode.com/ethereum/sepolia](https://faucet.quicknode.com/ethereum/sepolia)

---

## ⚠️ Avertissements de Sécurité

### Ne Jamais Committer

- ❌ Fichiers `.env`
- ❌ Clés privées
- ❌ API Keys
- ❌ Mnémoniques (seed phrases)

### Bonnes Pratiques

- ✅ Utilisez toujours un compte de test dédié
- ✅ Ne stockez jamais de vrais fonds sur Sepolia
- ✅ Vérifiez toujours le réseau avant de signer
- ✅ Utilisez `.gitignore` pour les fichiers sensibles
- ✅ Ne partagez jamais vos clés privées
- ✅ Faites des backups de vos clés

### Limites du Testnet

- ⚠️ Sepolia peut être instable
- ⚠️ Les transactions peuvent être lentes (30s+)
- ⚠️ Les faucets ont des limites
- ⚠️ Sepolia ETH n'a aucune valeur réelle

---

## 🎉 Conclusion

Félicitations ! Vous avez :
- ✅ Déployé un smart contract sur Sepolia
- ✅ Configuré Alchemy comme RPC provider
- ✅ Déployé une DApp sur Vercel
- ✅ Mis en production une application blockchain complète

Votre DApp est maintenant accessible 24/7 depuis n'importe où dans le monde ! 🌍

---

**Bon développement ! 🚀**
