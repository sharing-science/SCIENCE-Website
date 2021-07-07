const Covid19usecase = artifacts.require("./Covid19usecase.sol");

module.exports = function (deployer) {
  deployer.deploy(Covid19usecase);
};
