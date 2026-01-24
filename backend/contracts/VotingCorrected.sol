// SPDX-License-Identifier: MIT

pragma solidity 0.8.28;
import "@openzeppelin/contracts/access/Ownable.sol";

contract VotingCorrected is Ownable {
    uint public winningProposalID;
    // On définit une limite stricte pour éviter le spam et le DoS
    uint public constant MAX_PROPOSALS_PER_VOTER = 10;

    /**
     * OPTIMISATION DU STOCKAGE (Storage Slot Packing) :
     * Taille totale : 8 + 8 + 32 + 32 = 80 bits (soit 10 octets).
     * Puisque 10 octets < 32 octets, Solidity packe l'intégralité de cette structure dans UN SEUL SLOT (Slot 0).
     */
    struct Voter {
        bool isRegistered; // 1 octet (8 bits)
        bool hasVoted; // 1 octet (8 bits)
        uint32 votedProposalId; // 4 octets (32 bits)
        uint32 proposalCount; // 4 octets (32 bits) - Limite à 10 proposition par votant via require()
    }

    struct Proposal {
        string description;
        uint voteCount;
    }

    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    WorkflowStatus public workflowStatus;
    Proposal[] proposalsArray;
    mapping(address => Voter) voters;

    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(
        WorkflowStatus previousStatus,
        WorkflowStatus newStatus
    );
    event ProposalRegistered(uint proposalId);
    event Voted(address voter, uint proposalId);

    constructor() Ownable(msg.sender) {}

    modifier onlyVoters() {
        require(voters[msg.sender].isRegistered, "You're not a voter");
        _;
    }

    // ::::::::::::: GETTERS ::::::::::::: //
    function getVoter(
        address _addr
    ) external view onlyVoters returns (Voter memory) {
        return voters[_addr];
    }

    function getOneProposal(
        uint _id
    ) external view onlyVoters returns (Proposal memory) {
        require(_id < proposalsArray.length, "Proposal not found");
        return proposalsArray[_id];
    }

    // ::::::::::::: REGISTRATION ::::::::::::: //

    function addVoter(address _addr) external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.RegisteringVoters,
            "Registration not open"
        );
        require(!voters[_addr].isRegistered, "Already registered");

        voters[_addr].isRegistered = true;
        emit VoterRegistered(_addr);
    }

    // ::::::::::::: PROPOSAL ::::::::::::: //

    function addProposal(string calldata _desc) external onlyVoters {
        require(
            workflowStatus == WorkflowStatus.ProposalsRegistrationStarted,
            "Proposals not allowed"
        );
        require(bytes(_desc).length > 0, "Description cannot be empty");

        // Solution au 1er PB : Limitation du spam par votant
        require(
            voters[msg.sender].proposalCount < MAX_PROPOSALS_PER_VOTER,
            "Max proposals reached for this voter"
        );

        proposalsArray.push(Proposal(_desc, 0));
        voters[msg.sender].proposalCount++;

        emit ProposalRegistered(proposalsArray.length - 1);
    }

    // ::::::::::::: VOTE ::::::::::::: //

    function setVote(uint _id) external onlyVoters {
        require(
            workflowStatus == WorkflowStatus.VotingSessionStarted,
            "Voting session not started"
        );
        require(!voters[msg.sender].hasVoted, "Already voted");
        require(_id < proposalsArray.length, "Proposal not found");

        // Petite modif qui fait pleurer le compilateur maintenant que votreProposalId est uint32
        voters[msg.sender].votedProposalId = uint32(_id);
        voters[msg.sender].hasVoted = true;
        proposalsArray[_id].voteCount++;

        // Solution au 2ème PB : On met à jour le gagnant en temps réel
        // pour éviter une boucle for coûteuse dans tallyVotes
        if (
            proposalsArray[_id].voteCount >
            proposalsArray[winningProposalID].voteCount
        ) {
            winningProposalID = _id;
        }

        emit Voted(msg.sender, _id);
    }

    // ::::::::::::: STATE MANAGEMENT ::::::::::::: //

    function startProposalsRegistering() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.RegisteringVoters,
            "Wrong status"
        );
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;

        // On initialise avec une proposition par défaut pour éviter un index vide
        proposalsArray.push(Proposal("GENESIS", 0));
        winningProposalID = 1;

        emit WorkflowStatusChange(
            WorkflowStatus.RegisteringVoters,
            WorkflowStatus.ProposalsRegistrationStarted
        );
    }

    function endProposalsRegistering() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.ProposalsRegistrationStarted,
            "Phase not started"
        );
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(
            WorkflowStatus.ProposalsRegistrationStarted,
            WorkflowStatus.ProposalsRegistrationEnded
        );
    }

    function startVotingSession() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.ProposalsRegistrationEnded,
            "Phase not finished"
        );
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(
            WorkflowStatus.ProposalsRegistrationEnded,
            WorkflowStatus.VotingSessionStarted
        );
    }

    function endVotingSession() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.VotingSessionStarted,
            "Session not started"
        );
        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(
            WorkflowStatus.VotingSessionStarted,
            WorkflowStatus.VotingSessionEnded
        );
    }

    function tallyVotes() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.VotingSessionEnded,
            "Session not ended"
        );

        // La boucle FOR a été supprimée car winningProposalID est mis à jour dans setVote.
        // Cela garantit que la fonction tallyVotes ne consommera quasiment pas de Gaz
        // quel que soit le nombre de propositions.

        workflowStatus = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(
            WorkflowStatus.VotingSessionEnded,
            WorkflowStatus.VotesTallied
        );
    }
}
