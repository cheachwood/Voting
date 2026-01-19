import { useState } from 'react';
import { useWatchContractEvent, useWriteContract } from 'wagmi';
import { VOTING_ADDRESS, VOTING_ABI, CHAIN_ID } from '../../lib/votingContract';
import type { Address } from 'viem';

export const VotersTab = () => {
  const [voterAddress, setVoterAddress] = useState<Address>('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266' as Address);
  const writeContractCreate = useWriteContract();

  const handlerCreateVoter = () => {
    writeContractCreate.mutate(
      {
        address: VOTING_ADDRESS,
        abi: VOTING_ABI,
        functionName: 'addVoter',
        args: [voterAddress],
        chainId: CHAIN_ID,
      },
      {
        onSuccess: (data) => {
          console.log('Transaction success:', data);
        },
        onError: (error) => {
          console.error('Transaction error:', error);
        },
      },
    );
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Gestion des Votants</h3>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2"> Ajouter un votant (Owner uniquement) </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Adresse 0x..."
            value={voterAddress}
            onChange={(e) => setVoterAddress(e.target.value as Address)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" onClick={handlerCreateVoter}>
            Ajouter
          </button>
        </div>
      </div>

      <h4 className="text-sm font-semibold text-gray-700 mb-2">Liste des votants</h4>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Adresse</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">A voté</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vote pour</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 text-sm font-mono text-gray-900">0x742d35Cc...95f0bEb</td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Enregistré</span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">Non</td>
              <td className="px-6 py-4 text-sm text-gray-500">-</td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-sm font-mono text-gray-900">0x5B38Da6a...6beddC4</td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Enregistré</span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">Non</td>
              <td className="px-6 py-4 text-sm text-gray-500">-</td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-sm font-mono text-gray-900">0xAb8483F6...315835cb2</td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Enregistré</span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">Non</td>
              <td className="px-6 py-4 text-sm text-gray-500">-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
