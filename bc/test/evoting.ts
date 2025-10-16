import { expect } from "chai";
import hre, { network } from "hardhat";
import EVotingModule from "../ignition/modules/EVotingModule.js";

const connection = await hre.network.connect();
const { ethers } = await network.connect();

describe("EVoting zkSNARK tests with Ignition", function () {
  let evoting: any;
  let owner: any;
  let voter1: any;

  // Mock proof shaped exactly like Solidity wants
  const mockFullProve = async () => {
    const proofA: [bigint, bigint] = [1n, 2n];
    const proofB: [[bigint, bigint], [bigint, bigint]] = [
      [3n, 4n],
      [5n, 6n],
    ];
    const proofC: [bigint, bigint] = [7n, 8n];
    const input: [bigint] = [1n]; // ✅ only one value

    return { proofA, proofB, proofC, input };
  };

  beforeEach(async function () {
    [owner, voter1] = await ethers.getSigners();

    const { evoting: deployedEvoting } = await connection.ignition.deploy(
      EVotingModule
    );
    evoting = deployedEvoting;
  });

  it("should allow a voter to cast a zkSNARK-verified vote", async function () {
    const { proofA, proofB, proofC, input } = await mockFullProve();

    const tx = await evoting
      .connect(voter1)
      .vote(0, proofA, proofB, proofC, input);
    await tx.wait();

    const candidate = await evoting.candidates(0);
    expect(candidate.voteCount).to.equal(1n);
  });

  it("should fail if a voter tries to vote twice", async function () {
    const { proofA, proofB, proofC, input } = await mockFullProve();

    await evoting.connect(voter1).vote(0, proofA, proofB, proofC, input);

    await expect(
      evoting.connect(voter1).vote(0, proofA, proofB, proofC, input)
    ).to.be.revertedWith("You have already voted");
  });
});


