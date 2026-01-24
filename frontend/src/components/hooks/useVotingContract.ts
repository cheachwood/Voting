import { usePublicClient, useWriteContract, useConnection } from 'wagmi';
import { VOTING_ADDRESS, VOTING_ABI, CHAIN_ID } from '@/lib/votingContract';
import { useState, useEffect, useCallback } from 'react';
import { type Address } from 'viem';
import { toast } from 'sonner';
import type { Proposal } from '../tabs';

const DEPLOYMENT_BLOCK = 10115418n; // Remplacez par le numéro de bloc réel du déploiement

/// Hook personnalisé pour interagir avec le contrat de vote
/// Fournit des fonctions pour gérer les votants, propositions, votes et le workflow
/// Gère également l'état local et les effets secondaires liés au contrat
export const useVotingContract = () => {
  const publicClient = usePublicClient();
  const { mutateAsync } = useWriteContract();
  const clientAddress = useConnection().address as Address;
  const [winningProposal, setWinningProposal] = useState<Proposal | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [wfStatus, setWfStatus] = useState(0);
  const [voters, setVoters] = useState<Address[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [activeTab, setActiveTab] = useState('voters');

  // Changement d'onglet automatique
  useEffect(() => {
    if (wfStatus === 1) setActiveTab('proposals');
    else if (wfStatus === 3) setActiveTab('vote');
    else if (wfStatus === 5) setActiveTab('results');
  }, [wfStatus]);

  // Récupérer les infos d'un votant
  const getVoterInfo = async (address: Address) => {
    if (!publicClient) return null;
    try {
      const voter = await publicClient.readContract({
        address: VOTING_ADDRESS,
        abi: VOTING_ABI,
        functionName: 'getVoter',
        args: [address],
      });
      return voter;
    } catch {
      return null;
    }
  };

  // Vérifier si owner (toujours actif)
  useEffect(() => {
    const checkOwner = async () => {
      if (!publicClient || !clientAddress) return;
      const ownerAddress = await publicClient.readContract({
        address: VOTING_ADDRESS,
        abi: VOTING_ABI,
        functionName: 'owner',
      });
      setIsOwner(ownerAddress.toLowerCase() === clientAddress.toLowerCase());
    };
    checkOwner();
  }, [publicClient, clientAddress]);

  // Ecouter les changements de statut du workflow
  useEffect(() => {
    if (!publicClient) return;

    const unwatch = publicClient.watchContractEvent({
      address: VOTING_ADDRESS,
      abi: VOTING_ABI,
      eventName: 'WorkflowStatusChange',
      onLogs: (logs) => {
        setWfStatus(Number(logs[0].args.newStatus));
      },
    });

    const fetchInitialStatus = async () => {
      const events = await publicClient.getContractEvents({
        address: VOTING_ADDRESS,
        abi: VOTING_ABI,
        eventName: 'WorkflowStatusChange',
        fromBlock: DEPLOYMENT_BLOCK,
      });
      if (events.length > 0) {
        setWfStatus(Number(events[events.length - 1]?.args.newStatus));
      }
    };

    fetchInitialStatus();
    return () => unwatch();
  }, [publicClient]);

  // Récupérer les votants
  const fetchVoters = useCallback(async () => {
    if (!publicClient) return;
    const events = await publicClient.getContractEvents({
      address: VOTING_ADDRESS,
      abi: VOTING_ABI,
      eventName: 'VoterRegistered',
      fromBlock: DEPLOYMENT_BLOCK,
    });
    const addresses = events.map((event) => event.args.voterAddress!);
    setVoters(addresses);
  }, [publicClient]);

  // Ecoute et récupération des votants
  useEffect(() => {
    if (!publicClient || activeTab !== 'voters') return;

    fetchVoters();

    const unwatch = publicClient.watchContractEvent({
      address: VOTING_ADDRESS,
      abi: VOTING_ABI,
      eventName: 'VoterRegistered',
      onLogs: () => fetchVoters(),
    });

    return () => unwatch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicClient, activeTab]);

  // Ecoute et récupération des propositions
  const fetchProposals = useCallback(async () => {
    if (!publicClient) return;
    const events = await publicClient.getContractEvents({
      address: VOTING_ADDRESS,
      abi: VOTING_ABI,
      eventName: 'ProposalRegistered',
      fromBlock: DEPLOYMENT_BLOCK,
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
  }, [publicClient]);

  // Récupérer et écouter les propositions et votes
  useEffect(() => {
    if (!publicClient) return;
    if (activeTab !== 'proposals' && activeTab !== 'vote' && activeTab !== 'results') return;

    fetchProposals();

    const unwatchProposals = publicClient.watchContractEvent({
      address: VOTING_ADDRESS,
      abi: VOTING_ABI,
      eventName: 'ProposalRegistered',
      onLogs: () => fetchProposals(),
    });

    const unwatchVotes = publicClient.watchContractEvent({
      address: VOTING_ADDRESS,
      abi: VOTING_ABI,
      eventName: 'Voted',
      onLogs: () => fetchProposals(),
    });

    return () => {
      unwatchProposals();
      unwatchVotes();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicClient, activeTab]);

  // Récupérer la proposition gagnante après le dépouillement
  useEffect(() => {
    if (!publicClient || activeTab !== 'results' || proposals.length === 0) return;

    const fetchWinner = async () => {
      const winningId = await publicClient.readContract({
        address: VOTING_ADDRESS,
        abi: VOTING_ABI,
        functionName: 'winningProposalID',
      });
      setWinningProposal(proposals[Number(winningId) - 1]);
    };

    fetchWinner();
  }, [proposals, publicClient, activeTab]);

  // Ajouter un votant
  const addVoter = async (voterAddress: Address) => {
    try {
      await mutateAsync({
        address: VOTING_ADDRESS,
        abi: VOTING_ABI,
        functionName: 'addVoter',
        args: [voterAddress],
        chainId: CHAIN_ID,
      });
      toast.success(`Votant ${voterAddress} ajouté !`);
    } catch (error) {
      toast.error(`Erreur: ${(error as Error).message}`);
    }
  };

  // Ajouter une proposition
  const addProposal = async (description: string) => {
    try {
      await mutateAsync({
        address: VOTING_ADDRESS,
        abi: VOTING_ABI,
        functionName: 'addProposal',
        args: [description],
        chainId: CHAIN_ID,
      });
      toast.success('Proposition ajoutée !');
    } catch (error) {
      toast.error(`Erreur: ${(error as Error).message}`);
    }
  };

  // Ajouter un vote
  const vote = async (proposalId: number) => {
    try {
      await mutateAsync({
        address: VOTING_ADDRESS,
        abi: VOTING_ABI,
        functionName: 'setVote',
        args: [BigInt(proposalId)],
      });
      toast.success('Vote enregistré !');
    } catch (error) {
      toast.error(`Erreur: ${(error as Error).message}`);
    }
  };

  const startProposalsRegistering = async () => {
    try {
      await mutateAsync({
        address: VOTING_ADDRESS,
        abi: VOTING_ABI,
        functionName: 'startProposalsRegistering',
      });
    } catch (error) {
      toast.error(`Erreur: ${(error as Error).message}`);
    }
  };

  const endProposalsRegistering = async () => {
    try {
      await mutateAsync({
        address: VOTING_ADDRESS,
        abi: VOTING_ABI,
        functionName: 'endProposalsRegistering',
      });
    } catch (error) {
      toast.error(`Erreur: ${(error as Error).message}`);
    }
  };

  const startVotingSession = async () => {
    try {
      await mutateAsync({
        address: VOTING_ADDRESS,
        abi: VOTING_ABI,
        functionName: 'startVotingSession',
      });
    } catch (error) {
      toast.error(`Erreur: ${(error as Error).message}`);
    }
  };

  const endVotingSession = async () => {
    try {
      await mutateAsync({
        address: VOTING_ADDRESS,
        abi: VOTING_ABI,
        functionName: 'endVotingSession',
      });
    } catch (error) {
      toast.error(`Erreur: ${(error as Error).message}`);
    }
  };

  const tallyVotes = async () => {
    try {
      await mutateAsync({
        address: VOTING_ADDRESS,
        abi: VOTING_ABI,
        functionName: 'tallyVotes',
      });
    } catch (error) {
      toast.error(`Erreur: ${(error as Error).message}`);
    }
  };

  return {
    activeTab,
    setActiveTab,
    publicClient,
    clientAddress,
    isOwner,
    wfStatus,
    voters,
    proposals,
    winningProposal,
    getVoterInfo,
    fetchVoters,
    fetchProposals,
    addVoter,
    addProposal,
    vote,
    startProposalsRegistering,
    endProposalsRegistering,
    startVotingSession,
    endVotingSession,
    tallyVotes,
  };
};
