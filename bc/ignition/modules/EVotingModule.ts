import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const EVotingModule = buildModule("EVotingModule", (m) => {
  // Deploy Verifier
  const verifier = m.contract("Groth16Verifier");

  // Deploy EVoting with verifier address
  const evoting = m.contract("EVoting", [verifier]);

  return { verifier, evoting };
});

export default EVotingModule;