import { expect } from "chai";
import  hre  from "hardhat";
import proof from "../circuits/build/proof.json";
import { groth16 } from "snarkjs";
import publico from "../circuits/build/public.json";
import fs from "fs";

const { ethers } = await hre.network.connect();



// describe("EVoting with ZKP Aadhaar verification", function () {
//   let EVoting: any;
//   let evoting: any;
//   let verifier: any;
//   let Verifier: any;
  

//   beforeEach(async () => {
//     // Deploy mock verifier (you can replace this with your real one)
//     const VerifierFactory = await ethers.getContractFactory("Groth16Verifier");
//     verifier = await VerifierFactory.deploy();
//     await verifier.waitForDeployment();

//     const EVotingFactory = await ethers.getContractFactory("EVoting");
//     evoting = await EVotingFactory.deploy(await verifier.getAddress());
//     await evoting.waitForDeployment();
//   });

//   it("should add candidates", async () => {
//     await evoting.addCandidate("Alice");
//     await evoting.addCandidate("Bob");

//     const names = await evoting.getCandidateNames();
//     expect(names).to.deep.equal(["Alice", "Bob"]);
//   });

//   it("should register voter and allow voting via proof", async () => {
//     // Step 1: Mock Aadhaar and Poseidon hash (pretend value)
//     const aadhaarNumber = BigInt("12345");
//     const voterHash = BigInt("4267533774488295900887461483015112262021273608761099826938271132511348470966");
//     // Step 2: Register the voter
//     await evoting.registerVoter(voterHash);
//     const isRegistered = await evoting.isRegistered(voterHash);
//     expect(isRegistered).to.equal(true);

//     // Step 3: Add candidates
//     await evoting.addCandidate("Alice");
//     await evoting.addCandidate("Bob");

//     // Step 4: Mock proof and inputs (Normally generated via snarkjs)
// const a = [BigInt(proof.pi_a[0]), BigInt(proof.pi_a[1])];
// const b = [
//   [BigInt(proof.pi_b[0][1]), BigInt(proof.pi_b[0][0])],
//   [BigInt(proof.pi_b[1][1]), BigInt(proof.pi_b[1][0])],
// ];
// const c = [BigInt(proof.pi_c[0]), BigInt(proof.pi_c[1])];

// // input[0] = eligible (1 = true), input[1] = voterHash (public)
// const input = publico.map((s) => BigInt(s));

// console.log("Prepared arrays:");
// console.log("a:", a);
// console.log("b:", b);
// console.log("c:", c);
// console.log("input(publicSignals):", input);
// console.log(typeof input[0], input[0]);
// console.log(typeof input[1], input[1]);
// // Call contract
// await evoting.vote(0, input[1], a, b, c, input);


//     // Step 5: Validate results
//     const voteCount = await evoting.getVoteCount(0);
//     console.log(voteCount);

//     // Step 6: Prevent double voting
//    await expect(
//       await evoting.vote(0, input[1], a, b, c, input)
//      ).to.be.revertedWith("Already voted");
//   });
// });
// read proof and public signals (strings)
describe("Groth16 Verifier Sanity Check", function () {
  it("should correctly verify a valid proof from snarkjs", async function () {
    // Load proof and public signals
    const proof = JSON.parse(fs.readFileSync("circuits/build/proof.json", "utf8"));
    const publicSignals = JSON.parse(fs.readFileSync("circuits/build/public.json", "utf8"));

    // Deploy verifier
    const Verifier = await ethers.getContractFactory("Groth16Verifier");
    const verifier = await Verifier.deploy();
    await verifier.waitForDeployment();
    console.log("Verifier deployed at:", await verifier.getAddress());

    // Cast everything properly (ethers v6 hates loose types)
    const a: [bigint, bigint] = [
      BigInt(proof.pi_a[0]),
      BigInt(proof.pi_a[1]),
    ];

    const b: [[bigint, bigint], [bigint, bigint]] = [
      [BigInt(proof.pi_b[0][1]), BigInt(proof.pi_b[0][0])],
      [BigInt(proof.pi_b[1][1]), BigInt(proof.pi_b[1][0])],
    ];

    const c: [bigint, bigint] = [
      BigInt(proof.pi_c[0]),
      BigInt(proof.pi_c[1]),
    ];

    const input: [bigint, bigint] = [
      BigInt(publicSignals[0]),
      BigInt(publicSignals[1])
    ];

    console.log("\n=== Sanity Check Data ===");
    console.log("a:", a);
    console.log("b:", b);
    console.log("c:", c);
    console.log("input:", input);
    console.log("=========================\n");
    try {
        const populatedTx = await verifier.verifyProof.populateTransaction(a, b, c, input);
        console.log("--- Raw Call Data ---");
        console.log("To:", populatedTx.to); // Should be verifier address
        console.log("Data:", populatedTx.data); // THE IMPORTANT PART
        console.log("---------------------\n");
    } catch (e) {
        console.error("Error populating transaction:", e);
    }
    // --- END ---
    // Verify the proof
    const verified = await verifier.verifyProof(a, b, c, input);
    console.log("✅ Verifier result:", verified);

    expect(verified).to.be.true;
  });
});