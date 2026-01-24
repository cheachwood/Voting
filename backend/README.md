# 🚀 Guide de Déploiement sur Sepolia

Guide complet pour déployer votre contrat Voting sur le testnet Sepolia.

---

## 📋 Prérequis

- ✅ Node.js installé
- ✅ Hardhat 3 configuré
- ✅ MetaMask installé
- ✅ Un compte Infura (gratuit)
- ⚠️ **ETH réels nécessaires** pour obtenir des SepoliaETH (faucets publics ne fonctionnent plus)

---

## 🔑 Étape 1 : Créer un Compte Infura

### 1. Inscription

1. Allez sur **[https://infura.io](https://infura.io)**
2. Créez un compte gratuit
3. Confirmez votre email

### 2. Créer un Projet

1. Dans le dashboard, cliquez sur **"Create New App"**
2. Choisissez **"Web3 API"**
3. Donnez un nom : `Voting DApp`
4. Cliquez sur **"Create"**

### 3. Récupérer les Identifiants

1. Cliquez sur votre projet
2. Vous verrez :
   - **API Key** : `abc123def456...`
   - **Endpoints** : liste des URLs RPC

3. **Copiez votre API Key** (Project ID)

Votre URL Sepolia sera :

```
https://sepolia.infura.io/v3/VOTRE_API_KEY
```

---

## 🦊 Étape 2 : Créer un Compte MetaMask pour Sepolia

### 1. Créer un Nouveau Compte

1. Ouvrez **MetaMask**
2. Cliquez sur **l'icône de compte** (rond coloré en haut à droite)
3. Cliquez sur **"Ajouter un compte"**
4. Nommez-le : **"Sepolia Test"**

### 2. Basculer sur Sepolia

1. Cliquez sur le **menu des réseaux** (en haut de MetaMask)
2. Activez **"Afficher les réseaux de test"** dans les paramètres si pas visible
3. Sélectionnez **"Sepolia test network"**

### 3. Exporter la Clé Privée

1. Sélectionnez votre compte **"Sepolia Test"**
2. Cliquez sur les **3 points verticaux** `⋮` à droite du nom
3. **"Détails du compte"**
4. **"Afficher la clé privée"**
5. Entrez votre mot de passe MetaMask
6. **Copiez la clé** (SANS le `0x` au début)

⚠️ **IMPORTANT** : Cette clé privée est sensible, ne la partagez JAMAIS !

---

## 💰 Étape 3 : Obtenir des SepoliaETH

### ⚠️ Problème : Les Faucets Publics Ne Fonctionnent Plus

Les faucets gratuits comme sepoliafaucet.com nécessitent maintenant des ETH réels sur le mainnet.

### Solutions :

#### Option A : Utiliser un Faucet avec Vérification

Certains faucets fonctionnent encore mais nécessitent :

- Avoir des ETH sur le mainnet Ethereum
- Vérification via GitHub/Twitter
- Limite quotidienne

**Faucets à essayer :**

- **[https://www.alchemy.com/faucets/ethereum-sepolia](https://www.alchemy.com/faucets/ethereum-sepolia)** (nécessite compte Alchemy)
- **[https://www.infura.io/faucet/sepolia](https://www.infura.io/faucet/sepolia)** (nécessite compte Infura)
- **[https://faucet.quicknode.com/ethereum/sepolia](https://faucet.quicknode.com/ethereum/sepolia)** (limité)

#### Option B : Demander à un Collègue

Si quelqu'un a déjà des SepoliaETH, demandez-lui d'en envoyer 0.1 ETH sur votre adresse.

#### Option C : Acheter des ETH et Bridger (Complexe)

1. Acheter des ETH sur un exchange
2. Les envoyer sur votre wallet mainnet
3. Utiliser un faucet qui nécessite des ETH mainnet

### Vérification

Une fois que vous avez des SepoliaETH, vérifiez votre balance :

```
https://sepolia.etherscan.io/address/VOTRE_ADRESSE
```

Vous devriez voir au minimum **0.05 SepoliaETH** pour déployer le contrat.

---

## ⚙️ Étape 4 : Configuration du Backend

### 1. Créer le Fichier .env

**Dans le dossier `backend/`, créez un fichier `.env` :**

```bash
# Sur WSL/Linux
touch .env

# Sur Windows (PowerShell)
New-Item -ItemType File -Force -Path .env
```

### 2. Remplir le .env

Ouvrez `.env` et ajoutez :

```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/VOTRE_API_KEY
SEPOLIA_PRIVATE_KEY=votre_clé_privée_sans_0x
```

**Exemple concret :**

```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/a5d74baa5b3e434786c5fe34df9082c8
SEPOLIA_PRIVATE_KEY=ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

⚠️ **Remplacez par VOS vraies valeurs !**

### 3. Sécuriser le .env

Ajoutez `.env` dans `.gitignore` :

```bash
echo ".env" >> .gitignore
```

### 4. Installer dotenv

```bash
npm install dotenv
```

### 5. Modifier hardhat.config.ts

**Ouvrez `hardhat.config.ts` et modifiez la partie `sepolia` :**

```typescript
import hardhatToolboxViemPlugin from '@nomicfoundation/hardhat-toolbox-viem';
import { defineConfig } from 'hardhat/config';
import dotenv from 'dotenv';

dotenv.config(); // ← Charger les variables .env

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
      url: process.env.SEPOLIA_RPC_URL!, // ← Utiliser .env
      accounts: [process.env.SEPOLIA_PRIVATE_KEY!], // ← Utiliser .env
    },
  },
});
```

---

## 🏗️ Étape 5 : Créer le Module Ignition

### 1. Créer le Dossier

```bash
mkdir -p ignition/modules
```

### 2. Créer le Fichier VotingModule.ts

**Créez `ignition/modules/VotingModule.ts` :**

```typescript
import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

export default buildModule('VotingModule', (m) => {
  const voting = m.contract('VotingCorrected');

  return { voting };
});
```

---

## 🚀 Étape 6 : Déploiement

### 1. Compiler le Contrat

```bash
npx hardhat compile
```

Vous devriez voir :

```
Compiled 1 Solidity file successfully
```

### 2. Déployer sur Sepolia

```bash
npx hardhat ignition deploy ignition/modules/VotingModule.ts --network sepolia --deployment-id sepolia-v1
```

**Sortie attendue :**

```
√ Confirm deploy to network sepolia (11155111)? ... yes
Hardhat Ignition 🚀

Deploying [ VotingModule ]

Batch #1
  Executed VotingModule#VotingCorrected

[ VotingModule ] successfully deployed 🚀

Deployed Addresses

VotingModule#VotingCorrected - 0x...
```

### 3. Copier l'Adresse du Contrat

**Copiez l'adresse affichée**, par exemple :

```
0x00bDc3021D57c4bAc9dc0d96a77ad897AB8AC03f
```

### 4. Vérifier sur Etherscan

Allez sur :

```
https://sepolia.etherscan.io/address/VOTRE_ADRESSE_CONTRAT
```

Vous devriez voir :

- ✅ Contract creation transaction
- ✅ Bytecode
- ✅ Balance : 0 ETH

---

## ⚙️ Étape 7 : Configuration du Frontend

### 1. Trouver le Bloc de Déploiement

Sur Etherscan (lien ci-dessus), regardez la première transaction.

Vous verrez : **"Block: 7552123"** (exemple)

**Copiez ce numéro.**

### 2. Copier l'ABI

**Depuis le dossier `backend/` :**

```bash
cp artifacts/contracts/VotingCorrected.sol/VotingCorrected.json ../frontend/src/lib/VotingCorrected.json
```

### 3. Modifier votingContract.tsx

**Ouvrez `frontend/src/lib/votingContract.tsx` :**

```typescript
import VotingArtifact from './VotingCorrected.json';

export const VOTING_ADDRESS = '0x00bDc3021D57c4bAc9dc0d96a77ad897AB8AC03f'; // ← Votre adresse
export const CHAIN_ID = 11155111; // Sepolia
export const VOTING_ABI = VotingArtifact.abi;
```

### 4. Modifier useVotingContract.ts

**Ouvrez `frontend/src/components/hooks/useVotingContract.ts` :**

**Ajoutez TOUT EN HAUT, avant `export const useVotingContract` :**

```typescript
const DEPLOYMENT_BLOCK = 7552123n; // ← Remplacez par VOTRE numéro de bloc
```

**Puis REMPLACEZ tous les `fromBlock: 0n` par `fromBlock: DEPLOYMENT_BLOCK`**

Il y en a environ 3-4 dans le fichier :

```typescript
// AVANT
const events = await publicClient.getContractEvents({
  address: VOTING_ADDRESS,
  abi: VOTING_ABI,
  eventName: 'VoterRegistered',
  fromBlock: 0n, // ← REMPLACEZ
});

// APRÈS
const events = await publicClient.getContractEvents({
  address: VOTING_ADDRESS,
  abi: VOTING_ABI,
  eventName: 'VoterRegistered',
  fromBlock: DEPLOYMENT_BLOCK, // ← PAR CECI
});
```

Faites-le pour tous les `getContractEvents` dans le fichier.

---

## 🧪 Étape 8 : Tester l'Application

### 1. Lancer le Frontend

```bash
cd frontend
npm run dev
```

### 2. Ouvrir l'Application

Allez sur : `http://localhost:5173`

### 3. Connecter MetaMask

1. Cliquez sur **"Connect Wallet"**
2. Sélectionnez **MetaMask**
3. **Assurez-vous d'être sur le réseau Sepolia**
4. Confirmez la connexion

### 4. Tester le Flow Complet

**En tant qu'Owner :**

1. Enregistrez des votants (autres adresses Sepolia)
2. Démarrez l'enregistrement des propositions
3. Passez à la phase suivante

**En tant que Votant :**

1. Changez de compte MetaMask
2. Soumettez des propositions
3. Votez
4. Consultez les résultats

---

## 🔍 Vérification du Contrat sur Etherscan (Optionnel)

### Pourquoi Vérifier ?

- Rendre le code source public
- Permettre l'interaction directe depuis Etherscan
- Augmenter la confiance

### Comment Vérifier

**1. Obtenir une Etherscan API Key**

1. Allez sur **[https://etherscan.io/register](https://etherscan.io/register)**
2. Créez un compte
3. Allez dans **"API Keys"**
4. Créez une nouvelle clé
5. Copiez la clé

**2. Ajouter dans .env**

```env
ETHERSCAN_API_KEY=votre_clé_etherscan
```

**3. Modifier hardhat.config.ts**

Ajoutez :

```typescript
export default defineConfig({
  // ... config existante
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY!,
  },
});
```

**4. Vérifier le Contrat**

```bash
npx hardhat verify --network sepolia ADRESSE_DU_CONTRAT
```

Remplacez `ADRESSE_DU_CONTRAT` par votre adresse.

**Succès :**

```
Successfully verified contract VotingCorrected on Etherscan.
https://sepolia.etherscan.io/address/0x.../code
```

---

## 🐛 Dépannage

### Erreur : "gas required exceeds allowance"

**Cause :** Pas assez de SepoliaETH
**Solution :** Obtenez plus de SepoliaETH depuis un faucet

### Erreur : "exceed maximum block range: 50000"

**Cause :** `fromBlock: 0n` essaie de récupérer trop de blocs
**Solution :** Utilisez `DEPLOYMENT_BLOCK` comme indiqué à l'étape 7

### Erreur : "The contract function 'owner' returned no data"

**Cause :** Mauvaise adresse de contrat ou mauvais réseau
**Solution :**

- Vérifiez que MetaMask est sur Sepolia
- Vérifiez l'adresse dans `votingContract.tsx`
- Videz le cache du navigateur (Ctrl+Shift+R)

### Le Contrat Ne Répond Pas

**Cause :** RPC Infura surchargé ou problème réseau
**Solution :**

- Attendez quelques minutes
- Rechargez la page
- Vérifiez que le contrat existe sur Etherscan

### Les Faucets Ne Donnent Pas d'ETH

**Cause :** Les faucets publics nécessitent des ETH mainnet
**Solution :**

- Utilisez un faucet avec vérification (Alchemy, Infura)
- Demandez à un collègue
- Utilisez un compte avec des ETH mainnet

---

## 📝 Checklist Finale

Avant de considérer le déploiement terminé :

- [ ] Le fichier `.env` est dans `.gitignore`
- [ ] Le contrat est déployé et visible sur Etherscan
- [ ] `VOTING_ADDRESS` est à jour dans `votingContract.tsx`
- [ ] `CHAIN_ID` est `11155111` (Sepolia)
- [ ] `DEPLOYMENT_BLOCK` est configuré dans `useVotingContract.ts`
- [ ] L'ABI est à jour dans le frontend
- [ ] MetaMask est configuré sur Sepolia
- [ ] Vous avez au moins 0.05 SepoliaETH
- [ ] L'application se connecte correctement
- [ ] Le workflow complet fonctionne

---

## 🎯 Résumé des Commandes

```bash
# Backend - Déploiement
cd backend
npm install dotenv
npx hardhat compile
npx hardhat ignition deploy ignition/modules/VotingModule.ts --network sepolia --deployment-id sepolia-v1

# Frontend - Configuration
cd ../frontend
cp ../backend/artifacts/contracts/VotingCorrected.sol/VotingCorrected.json src/lib/VotingCorrected.json
npm run dev
```

---

## 📚 Ressources

- **Infura Dashboard** : [https://infura.io/dashboard](https://infura.io/dashboard)
- **Sepolia Etherscan** : [https://sepolia.etherscan.io](https://sepolia.etherscan.io)
- **Faucet Alchemy** : [https://www.alchemy.com/faucets/ethereum-sepolia](https://www.alchemy.com/faucets/ethereum-sepolia)
- **Hardhat Docs** : [https://hardhat.org/docs](https://hardhat.org/docs)
- **Wagmi Docs** : [https://wagmi.sh](https://wagmi.sh)

---

## ⚠️ Avertissements de Sécurité

1. **Ne committez JAMAIS votre fichier `.env`**
2. **N'utilisez JAMAIS votre clé privée principale**
3. **Créez toujours un compte de test séparé**
4. **Les clés Hardhat par défaut sont publiques** (OK pour tests uniquement)
5. **Vérifiez toujours le réseau** avant de signer une transaction

---

**🎉 Félicitations ! Votre DApp est déployée sur Sepolia !**
