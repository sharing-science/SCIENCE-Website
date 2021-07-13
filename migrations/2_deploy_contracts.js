const Covid19usecase = artifacts.require("./Covid19usecase.sol");
var MyToken = artifacts.require("./MyToken.sol");
var MyTokenSales = artifacts.require("./MyTokenSale.sol");
var KycContract = artifacts.require("./KycContract.sol");
require("dotenv").config({ path: "../.env" });

module.exports = async (deployer) => {
  // Agreement Contract
  deployer.deploy(Covid19usecase);

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
