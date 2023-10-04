pragma solidity ^0.8.0;

contract VotingContract {
    address public admin;

    struct ProposalType {
        string name;
        uint duration;
        uint endTime;
        uint minimumVotes;
    }

    struct Proposal {
        uint id;
        uint proposalType;
        string title;
        string description;
        uint duration;
        uint voteCount;
        uint endTime;
        address proposer;
        bool approved;
        bool isAnonymous;
    }

    uint public proposalCount = 0;
    mapping(uint => Proposal) public proposals;
    
    mapping(uint => ProposalType) public proposalTypes;
    uint public proposalTypeCount = 0;
    
    mapping(address => bool) public videoCreators;

    mapping(uint => mapping(address => bool)) public voters;

    event ProposalCreated(uint proposalId, string title, address proposer);
    event ProposalApproved(uint proposalId, address admin);
    event ProposaTypeUpdated(uint typeId);
    event VideoCreatorRegistered(address indexed creator);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    function addOrUpdateProposalType(
        uint _id,
        string memory _name, 
        uint _duration, 
        uint _endTime, 
        uint _minimumVotes
    ) public onlyAdmin {
        require(_id > 0, "ID should be positive");

        if (_id <= proposalTypeCount) {
            proposalTypes[_id].name = _name;
            proposalTypes[_id].duration = _duration;
            proposalTypes[_id].endTime = _endTime;
            proposalTypes[_id].minimumVotes = _minimumVotes;
        } else { 

            proposalTypeCount++;
            require(_id == proposalTypeCount, "The new ID should be consecutive");
            proposalTypes[_id] = ProposalType(_name, _duration, _endTime, _minimumVotes);
        }
        emit ProposaTypeUpdated(_id);
    }

    function createProposal(
        uint _proposalTypeId,
        uint _videoDuration,
        string memory _title,
        string memory _description,
        address _proposer
    ) public {
        require(bytes(_title).length > 0, "Title must not be empty");
        require(bytes(_description).length > 0, "Description must not be empty");
        
        require(_proposalTypeId > 0 && _proposalTypeId <= proposalTypeCount, "Invalid proposal type ID");
        require(_videoDuration <= proposalTypes[_proposalTypeId].duration, "Mismatched video duration for the proposal type");

        proposalCount++;
        uint endTime = block.timestamp + proposalTypes[_proposalTypeId].endTime;
        proposals[proposalCount] = Proposal(
            proposalCount,
            _proposalTypeId,
            _title,
            _description,
            _videoDuration,
            0,
            endTime,
            _proposer,
            false,
            false // FIX: Should be true, but the problem is described in the issue #10
        );

        emit ProposalCreated(proposalCount, _title, _proposer);
    }

    function vote(uint _proposalId) public {
        require(_proposalId > 0 && _proposalId <= proposalCount, "Invalid proposal ID");

        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp <= proposal.endTime, "Voting period has ended"); 
        require(!proposal.approved, "Proposal has already been approved");
        require(proposal.proposer != msg.sender, "Proposer cannot vote on their own proposal");
        require(!voters[_proposalId][msg.sender], "You have already voted on this proposal");

        proposal.voteCount++;
        voters[_proposalId][msg.sender] = true;
    }

    function approveProposal(uint _proposalId) public onlyAdmin {
        require(_proposalId > 0 && _proposalId <= proposalCount, "Invalid proposal ID");

        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp >= proposal.endTime, "The voting period is not over yet");
        require(!proposal.approved, "Proposal has already been approved");
        require(proposal.voteCount >= proposalTypes[proposal.proposalType].minimumVotes, "Proposal does not have enough votes for approval");

        proposal.approved = true;
        if (videoCreators[proposal.proposer]) {
            proposal.isAnonymous = false;
        }

        emit ProposalApproved(_proposalId, msg.sender);
    }

    function registerVideoCreator() public {
        require(!videoCreators[msg.sender], "Creator is already registered");
        videoCreators[msg.sender] = true;
        emit VideoCreatorRegistered(msg.sender);
    }

    function getAllProposalTypeIds() public view returns (uint[] memory) {
        uint[] memory ids = new uint[](proposalTypeCount);
        
        for (uint i = 1; i <= proposalTypeCount; i++) {
            ids[i-1] = i;
        }
        
        return ids;
    }

    function getProposalTypeDetails(uint _id) 
        public 
        view 
        returns (
            string memory name,
            uint duration,
            uint endTime,
            uint minimumVotes
        ) 
    {
        require(_id > 0 && _id <= proposalTypeCount, "Invalid proposal type ID");

        ProposalType storage pType = proposalTypes[_id];
        
        return (
            pType.name,
            pType.duration,
            pType.endTime,
            pType.minimumVotes
        );
    }

}
