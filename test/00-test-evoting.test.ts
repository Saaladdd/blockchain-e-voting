import { expect } from "chai";
import hre from "hardhat";
import fs from "fs";
import path from "path";

const { ethers } = hre;

describe("EVoting zkSNARK Test", function () {
  let eVoting: any;

  before(async function () {
    const EVoting = await ethers.getContractFactory("EVoting");
    eVoting = await EVoting.deploy();
    await eVoting.deployed();
    console.log("EVoting deployed at:", eVoting.address);
  });

  it("Should create an election", async function () {
    const tx = await eVoting.createElection("Test Election");
    await tx.wait();

    const totalVotes = await eVoting.getTotalVotes(1);
    expect(totalVotes).to.equal(0);
  });
});
  