import { buildPoseidon } from "circomlibjs"; // For Poseidon hashing
import { ethers } from "ethers"; // For BigInt/hex conversion if needed

// --- Poseidon Hashing ---
let poseidon: any; // Cache the Poseidon instance

// Initialize Poseidon (call this once when your app loads)
export async function initPoseidon() {
  if (!poseidon) {
    poseidon = await buildPoseidon();
  }
  return poseidon;
}

// Function to hash the Voter ID string using Poseidon
// Assumes a simple conversion: string -> utf8 bytes -> BigInt
// IMPORTANT: The authority MUST use the exact same method.
export function calculatePoseidonHash(voterId: string): string {
  if (!poseidon) {
    throw new Error("Poseidon not initialized. Call initPoseidon first.");
  }
  // 1. Add domain separation prefix (optional but recommended)
  const dataToHash = voterId.trim(); // Ensure consistent formatting

  // 2. Convert string to bytes (UTF-8)

  // 3. Convert bytes to a BigInt
  //    (Note: ethers.hexlify adds '0x', BigInt expects it for hex)
  //    If ID is too long, this simple conversion might overflow typical fields.
  //    More robust methods pack bytes into multiple field elements.


  // 4. Hash the number using Poseidon (single input)
  //    The result is already a BigInt in the field.
  const hashResult = poseidon([dataToHash]);

  // 5. Return the hash as a decimal string (common format for snarkjs)
  return poseidon.F.toString(hashResult);
}

// --- ZKP Proof Formatting for Solidity ---
// (Helper function to format snarkjs proof for Solidity verifier)
export function formatSolidityProof(proof: any): {
  a: [string, string];
  b: [[string, string], [string, string]];
  c: [string, string];
} {
  return {
    a: [proof.pi_a[0], proof.pi_a[1]],
    b: [
      [proof.pi_b[0][1], proof.pi_b[0][0]], // Reverse inner array for Solidity
      [proof.pi_b[1][1], proof.pi_b[1][0]], // Reverse inner array for Solidity
    ],
    c: [proof.pi_c[0], proof.pi_c[1]],
  };
}