import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useVotingContract } from '../hooks/useVotingContract';
import type { Proposal } from '.';

export const VoteTab = () => {
  const [selectedProposalIndex, setSelectedProposalIndex] = useState<number | null>(null);
  const [aVote, setAVote] = useState(false);
  const [votedProposalId, setVotedProposalId] = useState<number | null>(null);

  const { proposals, vote, clientAddress, getVoterInfo } = useVotingContract();

  useEffect(() => {
    const fetchVoterInfo = async () => {
      const voter = await getVoterInfo(clientAddress);
      if (voter) {
        setAVote(voter.hasVoted);
        if (voter.hasVoted) {
          setVotedProposalId(Number(voter.votedProposalId));
          setSelectedProposalIndex(Number(voter.votedProposalId));
        }
      }
    };

    fetchVoterInfo();
  }, [clientAddress, getVoterInfo]);

  const handleSaveVote = async (proposalIndex: number | null) => {
    if (proposalIndex === null) {
      toast('Veuillez sélectionner une proposition avant de voter.');
      return;
    }

    try {
      await vote(proposalIndex);
      setAVote(true);
      setVotedProposalId(proposalIndex);
    } catch (error) {
      if ((error as Error).message.includes('Already voted')) {
        setAVote(true);
        toast.error('Vous avez déjà voté.');
      }
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Voter</h3>

      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Vos informations</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Statut</p>
            <p className="font-medium text-gray-900">Enregistré ✓</p>
          </div>
          <div>
            <p className="text-gray-600">A voté</p>
            <p className="font-medium text-gray-900">{aVote ? 'Oui' : 'Non'}</p>
          </div>
          <div>
            <p className="text-gray-600">Vote pour</p>
            <p className="font-medium text-gray-900">{votedProposalId !== null ? `ID ${votedProposalId}` : '-'}</p>
          </div>
        </div>
      </div>

      <h4 className="text-sm font-semibold text-gray-700 mb-3">Sélectionnez une proposition</h4>
      <div className="space-y-3 mb-6">
        {proposals.map((proposal: Proposal, index: number) => (
          <label key={index} className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <input type="radio" name="vote" value={index + 1} checked={selectedProposalIndex === index + 1} onChange={() => setSelectedProposalIndex(index + 1)} className="mr-3" disabled={aVote} />
            <div className="flex-1">
              <p className="font-medium text-gray-900">ID {index + 1}</p>
              <p className="text-sm text-gray-500">{proposal.description}</p>
              <p className="text-sm text-gray-500">Votes: {Number(proposal.voteCount)}</p>
            </div>
          </label>
        ))}
      </div>

      <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium disabled:bg-gray-400" onClick={() => handleSaveVote(selectedProposalIndex)} disabled={aVote}>
        Confirmer mon vote
      </button>
    </div>
  );
};

export default VoteTab;
