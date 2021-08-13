const Covid19usecase = artifacts.require("Covid19usecase");
const MyToken = artifacts.require("MyToken");
const MyTokenSales = artifacts.require("MyTokenSale");
const KycContract = artifacts.require("KycContract");
const Roles = artifacts.require("Roles");
const DataUseTeam = artifacts.require("./DataUseTeam.sol");

require("dotenv").config({ path: "../.env" });

module.exports = async (deployer) => {
  let addr = await web3.eth.getAccounts();

  // Agreement Contract
  deployer.deploy(Covid19usecase);

  deployer.deploy(DataUseTeam);

  // Roles Contract
  deployer.deploy(Roles, addr[0], addr[1]);

  // Tokens
  await deployer.deploy(MyToken, process.env.INITIAL_TOKENS);
  await deployer.deploy(KycContract);
  await deployer.deploy(
    MyTokenSales,
    1,
    addr[0],
    MyToken.address,
    KycContract.address
  );
  let tokenInstance = await MyToken.deployed();
  await tokenInstance.transfer(
    MyTokenSales.address,
    process.env.INITIAL_TOKENS
  );
};
