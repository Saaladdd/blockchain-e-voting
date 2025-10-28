import hre from "hardhat";
import EVotingModule from "../ignition/modules/EVotingModule.js";

const connection = await hre.network.connect();

async function main() {
  console.log("🚀 Starting deployment of the EVoting contract...");

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
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});