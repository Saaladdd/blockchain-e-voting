// scripts/deploy-and-test.ts
import hre from "hardhat";

async function main() {
  const { ethers } = await hre.network.connect();

  // 1️⃣ Compile the contracts (optional if using hardhat run)


  // 2️⃣ Get signers
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // 3️⃣ Deploy Verifier contract (dummy if needed)
  const VerifierFactory = await ethers.getContractFactory("Groth16Verifier");
  const verifier = await VerifierFactory.deploy();
  console.log("Verifier deployed to:", verifier.target);

  // 4️⃣ Deploy EVoting contract
  const EVotingFactory = await ethers.getContractFactory("EVoting");
  const evoting = await EVotingFactory.deploy(verifier.target);
  console.log("EVoting deployed to:", evoting.target);

  // 6️⃣ Fetch candidate names
  const candidates = await evoting.getCandidateNames();
  console.log("Candidates:", candidates);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
