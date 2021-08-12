const Covid19usecase = artifacts.require("./Covid19usecase.sol");
const ResearcherRoles = artifacts.require("./ResearcherRoles.sol");
const MyToken = artifacts.require("./MyToken.sol");
const MyTokenSales = artifacts.require("./MyTokenSale.sol");
const KycContract = artifacts.require("./KycContract.sol");
const DataUseTeam = artifacts.require("./DataUseTeam.sol");

require("dotenv").config({ path: "../.env" });

module.exports = async (deployer) => {
  // Agreement Contract
  deployer.deploy(Covid19usecase);

  deployer.deploy(DataUseTeam);

  // Roles Contract
  deployer.deploy(ResearcherRoles);

  // Tokens
  let addr = await web3.eth.getAccounts();
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
