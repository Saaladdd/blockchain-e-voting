// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Verifier.sol";

contract EVoting {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    address public owner; // The address of the contract deployer (the admin)
    mapping(address => bool) public hasVoted;
    Candidate[] public candidates;
    Groth16Verifier public verifier;

    event VoteCast(address indexed voter, uint256 indexed candidateIndex);
    event CandidateAdded(string name);

    // Modifier to restrict a function to be called only by the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    constructor(address _verifier) {
        verifier = Groth16Verifier(_verifier);
        owner = msg.sender; // Set the deployer's address as the owner
    }
    
    /**
     * @notice Adds a new candidate to the election.
     * @dev Can only be called by the contract owner.
     * @param _name The name of the candidate to add.
     */
    function addCandidate(string memory _name) public onlyOwner {
        candidates.push(Candidate(_name, 0));
        emit CandidateAdded(_name);
    }

    function vote(
        uint256 candidateIndex,
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[1] memory input
    ) public {
        require(candidateIndex < candidates.length, "Invalid candidate");
        require(!hasVoted[msg.sender], "Already voted");

        // zkSNARK proof verification
        bool verified = verifier.verifyProof(a, b, c, input);
        require(verified, "Invalid proof");

        // Optional eligibility check (depends on your circuit)
        require(input[0] == 1, "Not eligible to vote");

        candidates[candidateIndex].voteCount += 1;
        hasVoted[msg.sender] = true;

        emit VoteCast(msg.sender, candidateIndex);
    }

    // Fetch all candidates and votes
    function getCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }

    // Fetch a specific candidate's vote count
    function getVoteCount(uint256 candidateIndex) public view returns (uint256) {
        require(candidateIndex < candidates.length, "Invalid index");
        return candidates[candidateIndex].voteCount;
    }
}