const Company = artifacts.require("Company");
const SafeMath = artifacts.require("SafeMath");

module.exports = function(deployer) {
  
  deployer.deploy(Company);
  deployer.deploy(SafeMath);
};
