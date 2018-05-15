var Migrations = artifacts.require('smartcontract/tictactoe.sol');

module.exports = function(deployer) {
  deployer.deploy(Migrations).then(() => console.log(Migrations.address));
};
