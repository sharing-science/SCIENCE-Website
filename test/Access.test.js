const Ownership = artifacts.require("Ownership");

const chai = require("./chaisetup.js");
const BN = web3.utils.BN;
const expect = chai.expect;

contract("Ownership", async function (accounts) {
  const [AdminMember, Member, anotherAccount] = accounts;

  beforeEach(async () => {
    this.Ownership = await Ownership.new();
  });

  it("Access Control Works", async () => {
    let instance = this.Ownership;

    await expect(instance.newFile.sendTransaction({ from: AdminMember })).to
      .eventually.be.fulfilled;

    await expect(instance.getFileCounter()).to.eventually.be.fulfilled;

    await expect(instance.checkAccess(0, AdminMember)).to.eventually.be.equal(
      true
    );

    await expect(instance.checkAccess(0, Member)).to.eventually.be.equal(false);

    await expect(
      instance.allowAccess.sendTransaction(0, Member, {
        from: AdminMember,
      })
    ).to.eventually.be.fulfilled;

    await expect(instance.checkAccess(0, Member)).to.eventually.be.equal(true);

    await expect(
      instance.checkAccess(0, anotherAccount)
    ).to.eventually.be.equal(false);

    await expect(
      instance.requestAccess.sendTransaction(0, { from: anotherAccount })
    ).to.eventually.be.fulfilled;

    await expect(
      instance.fulfillRequest.sendTransaction(0, 0, true, {
        from: AdminMember,
      })
    ).to.eventually.be.fulfilled;

    return expect(
      instance.checkAccess(0, anotherAccount)
    ).to.eventually.be.equal(true);
  });
});
