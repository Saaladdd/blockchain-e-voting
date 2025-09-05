// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract EVoting {
  
  	struct Election{
    	uint256 id;
    	uint256 voteCount;
    	uint256[] candidateIds;
    	mapping(uint256 => uint256) candidateVotes;
    	mapping(address => bool) hasVoted;
    	mapping(address => bytes32) voteProof;
    	bool active;
  	}

  	mapping(uint256 => Election) public elections;
  	uint256 public nextElectionId;

	event ElectionCreated(uint256 indexed electionId, string name, uint256[] candidateIds);
	event Voted(uint256 indexed electionId, uint256 indexed candidateId, address voter);

	function createElection(string memory name, uint256[] memory candidateIds) external {
        require(candidateIds.length > 0, "Need at least 1 candidate");

        Election storage e = elections[nextElectionId];
        e.id = nextElectionId;
        e.active = true;

        for (uint256 i = 0; i < candidateIds.length; i++) {
            e.candidateIds.push(candidateIds[i]);
            e.candidateVotes[candidateIds[i]] = 0; // initialize votes
        }

        emit ElectionCreated(nextElectionId, name, candidateIds);
        nextElectionId++;
    }


	function vote(uint256 electionId, uint256 candidateId, bytes32 proofHash) external {
        Election storage e = elections[electionId];
        require(e.active, "Election is not active");
        require(!e.hasVoted[msg.sender], "Already voted");

        // check candidate is valid
        bool valid = false;
        for (uint256 i = 0; i < e.candidateIds.length; i++) {
            if (e.candidateIds[i] == candidateId) {
                valid = true;
                break;
            }
        }
        require(valid, "Invalid candidate");

        // record vote
        e.hasVoted[msg.sender] = true;
        e.voteProof[msg.sender] = proofHash;
        e.candidateVotes[candidateId]++;
        e.voteCount++;

        emit Voted(electionId, candidateId, msg.sender);
    }

}
