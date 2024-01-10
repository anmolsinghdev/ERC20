// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
require('dotenv').config()

async function main() {
  const MyToken = await hre.ethers.getContractFactory("MyToken");
  const myToken = await MyToken.deploy(process.env.OWNER_ADDRESS, 10000, 'AnmolToken', 'AnmolTK');
  await myToken.waitForDeployment();

  const totalSupply = await myToken.totalSupply()
  const address = await myToken.getAddress()
  
  console.log(
    `myToken deployed to ${address} with an initialSupply ${totalSupply}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
