import { useState } from 'react';
import { toast } from 'sonner';
import { useVotingContract } from '../hooks/useVotingContract';
import type { Proposal } from '.';

const ProposalsTab = () => {
  const [proposalDescription, setProposalDescription] = useState('');
  const { proposals, addProposal, voters, clientAddress } = useVotingContract();

  const addressInWhiteList = voters.includes(clientAddress);

  const handlerCreateProposals = () => {
    if (!proposalDescription) {
      toast('Le champ ne peut pas être vide');
      return;
    }

    addProposal(proposalDescription);
    setProposalDescription('');
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Propositions</h3>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Soumettre une proposition</label>
        <textarea
          rows={3}
          placeholder="Description de votre proposition..."
          value={proposalDescription}
          onChange={(e) => setProposalDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
        ></textarea>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed" onClick={handlerCreateProposals} disabled={!addressInWhiteList}>
          Soumettre
        </button>
        {!addressInWhiteList && <p className="text-sm text-red-600 mt-2">Vous devez être enregistré comme votant pour soumettre une proposition.</p>}
      </div>

      <h4 className="text-sm font-semibold text-gray-700 mb-2">Liste des propositions</h4>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Votes</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {proposals.map((proposal: Proposal, index: number) => (
              <tr key={index}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{index + 1}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{proposal.description}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{Number(proposal.voteCount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProposalsTab;
