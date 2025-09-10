import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("EVoting Contract", function () {
  it("Should deploy EVoting contract", async function () {
    const EVoting = await ethers.getContractFactory("EVoting");
    const eVoting = await EVoting.deploy();
    //await eVoting.deployed();
    expect(eVoting.target).to.properAddress
  });

  it("Should create a new election", async function () {
    const EVoting = await ethers.getContractFactory("EVoting");
    const eVoting = await EVoting.deploy();
    //await eVoting.deployed();

    const tx = await eVoting.createElection("Test Election");
    await tx.wait();

    const totalVotes = await eVoting.getTotalVotes(1);
    expect(totalVotes).to.equal(0);
  });
});
