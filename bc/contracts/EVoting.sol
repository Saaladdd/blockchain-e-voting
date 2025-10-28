// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Verifier.sol";

contract EVoting {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    Candidate[] public candidates;

    // Maps Poseidon hash of Aadhaar -> true if voter has voted
    mapping(uint256 => bool) public hasVoted;

    // Optional: registered voters mapping
    mapping(uint256 => bool) public registeredVoters;

    Groth16Verifier public verifier;

    // Events
    event VoteCast(uint256 indexed voterHash, uint256 indexed candidateIndex);
    event CandidateAdded(string name);
    event VoterRegistered(uint256 indexed voterHash);

    constructor(address _verifier) {
        verifier = Groth16Verifier(_verifier);
    }

    // Add a candidate (no owner restriction)
    function addCandidate(string memory _name) public {
        console.log("Adding candidate:", _name);
        candidates.push(Candidate(_name, 0));
        emit CandidateAdded(_name);
    }

    // Register a voter by their Poseidon-hashed Aadhaar (no owner restriction)
    function registerVoter(uint256 voterHash) public {
        require(!registeredVoters[voterHash], "Already registered");
        registeredVoters[voterHash] = true;
        emit VoterRegistered(voterHash);
    }


    // Vote for a candidate using ZK proof
    function vote(
        uint256 candidateIndex,
        uint256 voterHash,           // Poseidon hash of Aadhaar (public input)
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input      // circuit public output (1 = eligible)
    ) public {
        require(candidateIndex < candidates.length, "Invalid candidate");
        require(!hasVoted[voterHash], "Already voted");
        require(registeredVoters[voterHash], "Not registered");
        console.log("Input 0 is:",input[0]);
        console.log("Input 1 is:",input[1]);
        // Verify zkSNARK proof
        bool verified = verifier.verifyProof(a, b, c, input);
        console.log("Proof Status:", verified);
       // require(verified, "Invalid proof");

        // Circuit output must indicate eligibility
        require(input[0] == 1, "Not eligible to vote");

        // Mark voter as voted
        hasVoted[voterHash] = true;

        // Increment candidate vote count
        candidates[candidateIndex].voteCount += 1;

        emit VoteCast(voterHash, candidateIndex);
    }

    // Fetch all candidate names
    function getCandidateNames() public view returns (string[] memory) {
        string[] memory names = new string[](candidates.length);
        for (uint i = 0; i < candidates.length; i++) {
            names[i] = candidates[i].name;
        }
        return names;
    }

    function isRegistered(uint256 voterHash) public view returns (bool) {
        return registeredVoters[voterHash];
    }

    // Fetch vote count for a candidate
    function getVoteCount(uint256 candidateIndex) public view returns (uint256) {
        require(candidateIndex < candidates.length, "Invalid index");
        return candidates[candidateIndex].voteCount;
    }
}
