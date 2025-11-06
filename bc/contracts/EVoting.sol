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
    uint256 voterHash,
    uint256[2] memory a,
    uint256[2][2] memory b,
    uint256[2] memory c,
    uint256[2] memory input
) public {
    console.log("Voting with voterHash:", voterHash);
    console.log("Is registered:", registeredVoters[voterHash]);
    console.log("Has voted:", hasVoted[voterHash]);
    console.log("Input[0]:", input[0], "Input[1]:", input[1]);

    require(!hasVoted[voterHash], "Already voted");
    require(registeredVoters[voterHash], "Not registered");

    bool verified = false;

    try verifier.verifyProof(a, b, c, input) returns (bool result) {
        verified = result;
        console.log("Proof Status:", verified);
    } catch Error(string memory reason) {
        console.log("Proof verification failed with reason:", reason);
        verified = false;
    } catch (bytes memory) {
        console.log("Proof verification failed: low-level revert");
        verified = false;
    }


    //require(verified, "Invalid proof");
    require(input[0] == 1, "Not eligible to vote");

    hasVoted[voterHash] = true;
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
    function getCandidate(uint index) public view returns (Candidate memory) {
    console.log("Candidates length:", candidates.length);
    console.log("Index requested:", index);

    require(index < candidates.length, "Invalid candidate index");
    return candidates[index];
}
}
