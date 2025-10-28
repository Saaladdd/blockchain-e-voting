// scripts/hashIdUtil.ts (renamed for clarity)
import { initPoseidon, calculatePoseidonHash } from '../lib/zkp-helper'; // Adjust path and extension

/**
 * Calculates the Poseidon hash for a given Voter ID.
 * Initializes Poseidon if not already done.
 * @param voterId The ID string to hash.
 * @returns {Promise<string>} The calculated Poseidon hash as a decimal string.
 * @throws {Error} If Poseidon initialization fails or hashing fails.
 */
export default async function generateVoterPoseidonHash(voterId: string): Promise<string> {
  if (!voterId || typeof voterId !== 'string' || voterId.trim() === '') {
    throw new Error("Invalid Voter ID provided."); // Throw error instead of process.exit
  }

  try {
    await initPoseidon(); // Ensure Poseidon is ready
  } catch (err) {
    console.error("Failed to initialize Poseidon:", err);
    throw new Error("Poseidon initialization failed."); // Re-throw for caller
  }

  try {
    const poseidonHash = calculatePoseidonHash(voterId);
    console.log(`Hashed ID "${voterId}" to: ${poseidonHash}`); // Optional logging
    return poseidonHash; // Return the calculated hash
  } catch (err) {
    console.error(`Error hashing ID "${voterId}":`, err);
    throw new Error(`Hashing failed for ID "${voterId}".`); // Re-throw for caller
  }
}

// You could still have a simple script that USES this function for command-line hashing:
// async function runFromCommandLine() {
//   const idArg = process.argv[2];
//   if (!idArg) { console.error("Provide ID"); process.exit(1); }
//   try {
//     const hash = await generateVoterPoseidonHash(idArg);
//     console.log(`Hash: ${hash}`);
//   } catch (error) {
//     console.error(error);
//     process.exit(1);
//   }
// }
// if (require.main === module) { // Only run if executed directly
//    runFromCommandLine();
// }