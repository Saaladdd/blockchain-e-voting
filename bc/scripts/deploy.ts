import hre from "hardhat";
import EVotingModule from "../ignition/modules/EVotingModule.js";

const connection = await hre.network.connect();

async function main() {
  console.log("🚀 Starting deployment of the EVoting contract...");

  // Use Ignition to deploy the module.
  // This handles the entire deployment process defined in EVotingModule.
  const { evoting } = await connection.ignition.deploy(EVotingModule);

  // Retrieve the deployed contract's address
  const contractAddress = await evoting.getAddress();

  console.log(`✅ EVoting contract deployed successfully to: ${contractAddress}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});