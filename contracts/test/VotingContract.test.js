const { expect } = require("chai");

describe("VotingContract", function() {
    let VotingContract;
    let voting;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    let proposalId = 1;

    beforeEach(async function() {
        VotingContract = await ethers.getContractFactory("VotingContract");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        voting = await VotingContract.deploy();
        const proposalTypeId = 1;
        const name = "short";
        const duration = 90;
        const endTime = 7 * 24 * 60 * 60; // 7 days in seconds
        const minimumVotes = 10;

        await voting.addOrUpdateProposalType(proposalTypeId, name, duration, endTime, minimumVotes);

        await voting.createProposal(proposalTypeId, 60, "Test Title", "Test Description", owner.address);
    });

    describe("Deployment", function() {
        it("Should set the right owner", async function() {
            expect(await voting.admin()).to.equal(owner.address);
        });
    });

    describe("Creating Proposals", function() {
        it("Creating proposal should fail if proposal type ID is invalid", async function() {
            await expect(
                voting.createProposal(999, 60, "Test Title", "Test Description", addr1.address)
            ).to.be.revertedWith("Invalid proposal type ID");
        });
    });

    describe("Voting Restrictions", function() {
        it("Should fail if the proposer tries to vote on their own proposal", async function() {
            await expect(voting.vote(proposalId)).to.be.revertedWith("Proposer cannot vote on their own proposal");
        });

        it("Should fail if a user tries to vote on a proposal twice", async function() {
            await voting.connect(addr1).vote(proposalId);

            await expect(voting.connect(addr1).vote(proposalId)).to.be.revertedWith("You have already voted on this proposal");
        });
    });

    // TODO: 
    // test if the proposal can be approved after the minimum votes 
    // test if prposal can't be approved the case of not enough votes
    // test if a proposal can be voted after the end time and
    // test the creation of a invalid proposal duration
    // test the registration of creators
    // test the registration of proposal types
});

