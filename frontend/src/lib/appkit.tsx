import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { sepolia, hardhat } from 'wagmi/chains';
import { METADATA, PROJECT_ID } from '.';
import { http } from 'wagmi';

// Configuration de l'adaptateur Wagmi pour AppKit
export const wagmiAdapter = new WagmiAdapter({
  networks: [sepolia, hardhat],
  projectId: PROJECT_ID,
  transports: {
    [sepolia.id]: http(),
    [hardhat.id]: http('http://127.0.0.1:8545'),
  },
});

// Création de l'instance AppKit
createAppKit({
  adapters: [wagmiAdapter],
  networks: [sepolia, hardhat],
  projectId: PROJECT_ID,
  metadata: METADATA,
  features: {
    analytics: true,
  },
});
