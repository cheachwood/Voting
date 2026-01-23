import { CHAIN_ID, VOTING_ABI, VOTING_ADDRESS } from '@/lib/votingContract';
import type { Proposal } from '.';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { type Address } from 'viem';
import { useConnection, usePublicClient, useWriteContract } from 'wagmi';

const ProposalsTab = () => {
  const [proposalDescription, setProposalDescription] = useState('');
  const [voterAddress, setVoterAddress] = useState<Address>('' as Address);
  const writeContractCreate = useWriteContract();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const publicClient = usePublicClient();
  const clientAddress = useConnection().address as Address;
  const [addressInWhiteList, setAddressInWhiteList] = useState(false);

  const handlerCreateProposals = () => {
    if (!proposalDescription) {
      toast('Le champ Voter ne peut pas être vide');
      return;
    }

    // if (proposals.includes(proposalDescription)) {
    //   toast.error('Cette proposition est déjà enregistrée');
    //   return;
    // }

    writeContractCreate.mutate(
      {
        address: VOTING_ADDRESS,
        abi: VOTING_ABI,
        functionName: 'addProposal',
        args: [proposalDescription],
        chainId: CHAIN_ID,
      },
      {
        onSuccess: () => {
          toast(`La proposition a été ajoutée avec succès !`);
        },
        onError: (error) => {
          toast(`Transaction error: ${error}`);
        },
      },
    );
  };

  useEffect(() => {
    console.log('🔍 Fetching propsals...');
    const fetchProposals = async () => {
      if (!publicClient) return;

      const events = await publicClient.getContractEvents({
        address: VOTING_ADDRESS,
        abi: VOTING_ABI,
        eventName: 'ProposalRegistered',
        fromBlock: 0n,
      });
      const proposalIds = events.map((event) => event.args.proposalId!);
      const resultProposals = await Promise.all(
        proposalIds.map((proposalId) =>
          publicClient.readContract({
            address: VOTING_ADDRESS,
            abi: VOTING_ABI,
            functionName: 'getOneProposal',
            args: [proposalId],
          }),
        ),
      );
      setProposals(resultProposals);
    };
    fetchProposals();
  }, [publicClient]);

  useEffect(() => {
    const fetchVoters = async () => {
      if (!publicClient) return;

      const events = await publicClient.getContractEvents({
        address: VOTING_ADDRESS,
        abi: VOTING_ABI,
        eventName: 'VoterRegistered',
        fromBlock: 0n,
      });

      const voterAddresses = events.map((event) => event.args.voterAddress!);
      const isWhitelisted = voterAddresses.includes(clientAddress);
      setAddressInWhiteList(isWhitelisted);
    };

    fetchVoters();
  }, [publicClient, clientAddress]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Propositions</h3>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2"> Soumettre une proposition </label>
        <textarea
          rows={3}
          placeholder="Description de votre proposition..."
          value={proposalDescription}
          onChange={(e) => setProposalDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
        ></textarea>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" onClick={handlerCreateProposals}>
          Soumettre
        </button>
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
            {proposals.map(({ description, voteCount }, index) => (
              <tr key={index}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{index}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{description}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{voteCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ProposalsTab;
