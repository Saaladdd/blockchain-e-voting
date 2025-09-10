// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Verifier.sol";


contract EVoting {
    Groth16Verifier public verifier;

    constructor() {
        verifier = new Groth16Verifier();
    }

    // -------------------------
    // STRUCTS
    // -------------------------
    struct Election {
        string name;
        bool active;
        uint256 totalVotes;
        mapping(uint256 => uint256) partyVotes; // partyId => vote count
        mapping(address => bool) hasVoted; // prevent double voting
    }

    mapping(uint256 => Election) private elections; // electionId => Election
    uint256 public electionCount = 0;

    // -------------------------
    // EVENTS
    // -------------------------
    event ElectionCreated(uint256 indexed electionId, string name);
    event VoteCast(uint256 indexed electionId, uint256 indexed partyId);

    // -------------------------
    // ELECTION MANAGEMENT
    // -------------------------
    function createElection(string memory _name) external returns (uint256) {
        electionCount++;
        Election storage e = elections[electionCount];
        e.name = _name;
        e.active = true;

        emit ElectionCreated(electionCount, _name);
        return electionCount;
    }

    function closeElection(uint256 _electionId) external {
        elections[_electionId].active = false;
    }

    // -------------------------
    // VOTING
    // -------------------------
    function vote(
        uint256 _electionId,
        uint256 _partyId,
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[3] memory input
    ) external {
        Election storage e = elections[_electionId];

        require(e.active, "Election is not active");
        require(!e.hasVoted[msg.sender], "Already voted");

        // Verify the ZKP proof
        bool valid = verifier.verifyProof(a, b, c, input);
        require(valid, "Invalid ZKP proof");

        // Mark voter as voted
        e.hasVoted[msg.sender] = true;

        // Increment vote count for the selected party
        e.partyVotes[_partyId]++;

        // Increment total votes
        e.totalVotes++;

        emit VoteCast(_electionId, _partyId);
    }

    // -------------------------
    // READ FUNCTIONS
    // -------------------------
    function getPartyVotes(uint256 _electionId, uint256 _partyId) external view returns (uint256) {
        return elections[_electionId].partyVotes[_partyId];
    }

    function hasVoted(uint256 _electionId, address _voter) external view returns (bool) {
        return elections[_electionId].hasVoted[_voter];
    }

    function getTotalVotes(uint256 _electionId) external view returns (uint256) {
        return elections[_electionId].totalVotes;
    }
}
