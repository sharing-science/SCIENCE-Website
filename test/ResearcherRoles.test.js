const ResearcherRoles = artifacts.require("ResearcherRoles");

const chai = require("./chaisetup.js");
const BN = web3.utils.BN;
const expect = chai.expect;

contract("Roles", async function (accounts) {
  const [initialHolder] = accounts;

  it("Assign role and view it", async () => {
    let instance = await ResearcherRoles.deployed();
    await expect(instance.changeAccountRole(1)).to.eventually.be.fulfilled;
    return expect(
      instance.getAccountRole(initialHolder)
    ).to.eventually.be.equal("FirstRole");
  });
});
