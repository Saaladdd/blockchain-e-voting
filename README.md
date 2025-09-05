# Blockchain-based E-Voting System 🗳️

A **hybrid blockchain-based electronic voting system** built with **Solidity, Hardhat, and Next.js**.  
This project ensures **transparency, immutability, and verifiability** of elections while optimizing storage costs by keeping only **critical proofs and counts on-chain**, and handling voter/candidate details **off-chain**.

---

## 📌 Features

- ✅ **On-Chain**
  - Secure creation of elections with unique IDs.
  - Immutable vote counts per election.
  - Prevents double voting (1 vote per voter per election).
  - Stores cryptographic proofs (hashes) of votes for verifiability.

- ✅ **Off-Chain**
  - Candidate details (names, parties, manifestos).
  - Voter personal information (for privacy).
  - Encrypted vote data & metadata.

- ✅ **Security**
  - Each election is isolated.
  - Voters cannot vote more than once per election.
  - Hash-based proofs ensure no tampering.

---