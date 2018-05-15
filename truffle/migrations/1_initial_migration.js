var Migrations = artifacts.require('./tictactoe.sol');

module.exports = function(deployer) {
  deployer.deploy(Migrations).then(() => console.log(Migrations.address));
};
