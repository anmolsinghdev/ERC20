const { config } = require("dotenv");

require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks:{
    sepolia:{
      url:`https://sepolia.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts:[`${process.env.META_PRIVATE_KEY}`]
    }
  }
};
