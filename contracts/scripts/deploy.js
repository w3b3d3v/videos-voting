const {ethers} = require("hardhat");

async function main() {
  const votingContract = await ethers.getContractFactory("VotingContract");
  const voting = await votingContract.deploy();

  console.log("VotingContract deployed to:", voting.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
