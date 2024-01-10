// We import Chai to use its asserting functions here.
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat")

describe("MyToken", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.

  const initialSupply = 10000;

  async function deployMyTokenFixture() {

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount, otherAccount2] = await ethers.getSigners();


    const MyToken = await hre.ethers.getContractFactory("MyToken");
    const token = await MyToken.deploy(owner, initialSupply, 'AnmolToken', 'AnmolTK');
    await token.waitForDeployment();

    return { token, owner, otherAccount, otherAccount2 };
  }

  describe("Deployment", function () {

    it("Should set the right owner", async function () {
      // We use loadFixture to setup our environment, and then assert that
      // things went well
      const { token, owner } = await loadFixture(deployMyTokenFixture);

      // `expect` receives a value and wraps it in an assertion object. These
      // objects have a lot of utility methods to assert values.

      // This test expects the owner variable stored in the contract to be
      // equal to our Signer's owner.
      expect(await token.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const { token, owner } = await loadFixture(deployMyTokenFixture);
      const total = await token.totalSupply();
      expect(total).to.equal(await token.balanceOf(owner.address));
    });

  });


  describe("Transaction", function () {

    it("Should transfer tokens between accounts", async function () {
      const { token, owner, otherAccount } = await loadFixture(deployMyTokenFixture);

      const ownerBalance = await token.balanceOf(owner.address);

      await token.transfer(otherAccount.address, 50);
      const addr1Balance = await token.balanceOf(otherAccount.address);
      expect(addr1Balance).to.equal(50);

      const ownerNewBalance = await token.balanceOf(owner.address);
      expect(ownerNewBalance).to.equal(ownerBalance - BigInt(50));
    });

    it("Should emit Transfer events", async function () {
      const { token, owner, otherAccount, otherAccount2 } = await loadFixture(
        deployMyTokenFixture
      );

      // Transfer 50 tokens from owner to addr1
      await expect(token.transfer(otherAccount.address, 50))
        .to.emit(token, "Transfer")
        .withArgs(owner.address, otherAccount.address, 50);

      // Transfer 50 tokens from otherAccount to otherAccount2
      // We use .connect(signer) to send a transaction from another account
      await expect(token.connect(otherAccount).transfer(otherAccount2.address, 50))
        .to.emit(token, "Transfer")
        .withArgs(otherAccount.address, otherAccount2.address, 50);
    });  

  });

});