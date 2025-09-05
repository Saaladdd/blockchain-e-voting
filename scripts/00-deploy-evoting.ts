import { network } from "hardhat";

const { ethers } = await network.connect();

async function main() {

    console.log("Deploying the smart contract..")
    const Evote = await ethers.getContractFactory("EVoting");
    console.log("Evote:",Evote)
    const account = await ethers.getSigners();
    const evote = await Evote.connect(account[0]).deploy();
    console.log("Deployed at", evote.target);
    //await evote.deployed();
 
}
main().then(()=>process.exit(0))
.catch((error) => {
    console.log(error)
    process.exit(1);
});