const Ownership = artifacts.require("Ownership");

const chai = require("./chaisetup.js");
const BN = web3.utils.BN;
const expect = chai.expect;

contract("Ownership", async function (accounts) {
  const [AdminMember, Member, anotherAccount] = accounts;

  beforeEach(async () => {
    this.Ownership = await Ownership.new(AdminMember);
  });

  it("Access Control Works", async () => {
    let instance = this.Ownership;

    await expect(instance.checkAccess(AdminMember)).to.eventually.be.equal(
      true
    );

    await expect(instance.checkAccess(Member)).to.eventually.be.equal(false);

    await expect(
      instance.allowAccess.sendTransaction(Member, {
        from: AdminMember,
      })
    ).to.eventually.be.fulfilled;

    return expect(instance.checkAccess(Member)).to.eventually.be.equal(true);
  });
});
