const Roles = artifacts.require("Roles");

const chai = require("./chaisetup.js");
const BN = web3.utils.BN;
const expect = chai.expect;

contract("Roles", async function (accounts) {
  const [AdminMember, Member, anotherAccount] = accounts;

  beforeEach(async () => {
    this.Roles = await Roles.new(AdminMember);
    this.RolesList = await this.Roles.getRolesEncodings();
  });

  it("Can Create new Role", async () => {
    let instance = this.Roles;
    let roleEncoding = web3.utils.soliditySha3("Member");

    await expect(
      instance.addRole.sendTransaction(
        "Member",
        roleEncoding,
        Member,
        this.RolesList[0],
        {
          from: AdminMember,
        }
      )
    ).to.eventually.be.fulfilled;

    return expect(instance.getRolesEncodings())
      .to.eventually.be.an("array")
      .to.have.lengthOf(2);
  });

  it("OnlyMember is working", async () => {
    let instance = this.Roles;
    let roleEncoding = web3.utils.soliditySha3("Member");

    await expect(
      instance.addRole.sendTransaction(
        "Member",
        roleEncoding,
        Member,
        this.RolesList[0],
        {
          from: AdminMember,
        }
      )
    ).to.eventually.be.fulfilled;

    await expect(instance.testFunction.sendTransaction({ from: AdminMember }))
      .to.eventually.be.rejected;
    return expect(instance.testFunction.sendTransaction({ from: Member })).to
      .eventually.be.fulfilled;
  });

  it("OnlyAdmin is working", async () => {
    let instance = this.Roles;
    let roleEncoding = web3.utils.soliditySha3("Member");

    await expect(
      instance.addRole.sendTransaction(
        "Member",
        roleEncoding,
        Member,
        this.RolesList[0],
        {
          from: AdminMember,
        }
      )
    ).to.eventually.be.fulfilled;

    await expect(
      instance.testAdminFunction.sendTransaction({ from: AdminMember })
    ).to.eventually.be.fulfilled;

    return expect(instance.testAdminFunction.sendTransaction({ from: Member }))
      .to.eventually.be.rejected;
  });

  it("Requesting and joining role works", async () => {
    let instance = this.Roles;
    let roleEncoding = web3.utils.soliditySha3("Member");
    
    await expect(
      instance.addRole.sendTransaction(
        "Member",
        roleEncoding,
        Member,
        this.RolesList[0],
        {
          from: AdminMember,
        }
        )
        ).to.eventually.be.fulfilled;
        
    let RolesList = await instance.getRolesEncodings();
    
    await expect(
      instance.requestJoin.sendTransaction(RolesList[1], {
        from: anotherAccount,
      })
    ).to.eventually.be.fulfilled;

    await expect(instance.getRequests.call(RolesList[0]))
      .to.eventually.be.an("array")
      .that.include(anotherAccount);

    await expect(
      instance.acceptRequest.sendTransaction(RolesList[1], 0, {
        from: anotherAccount,
      })
    ).to.eventually.be.rejected;

    await expect(
      instance.acceptRequest.sendTransaction(RolesList[1], 0, {
        from: AdminMember,
      })
    ).to.eventually.be.fulfilled;
    return expect(instance.getRequests.call(RolesList[1]))
      .to.eventually.be.an("array")
      .to.have.lengthOf(0);
  });
});
