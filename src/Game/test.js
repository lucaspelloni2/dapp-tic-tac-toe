import React, {Component} from 'react';
import Web3 from 'web3';
let web3 = window.web3;


export const UserAddress = props => {
    return (<div>{props.state.ethAddress}</div>)
};

class Web3Manager extends Component {
  constructor() {
    super();
    this.state = {ethAddress: '', ethBalance: 0};
  }

  componentDidMount() {
    this.initWeb3();
  }

  getUserAccount() {
    web3.eth
      .getAccounts()
      .then(addr => {
        console.log(addr);
        this.setState({ethAddress: addr.toString()});
        web3.eth
          .getBalance(addr.toString())
          .then(bal => {
            console.log(bal);
            this.setState({ethBalance: bal});
          })
          .catch(err => {
            console.log('error getting balance' + err);
          });
      })
      .catch(err => {
        console.log('error getting address ' + err);
      });
  }

  getBalance() {
    web3.eth.getBalance();
  }

  initWeb3() {
    if (typeof web3 !== 'undefined') {
      this.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
      console.log('existing web3: provider ' + web3.currentProvider);
    } else {
      this.web3Provider = new Web3.providers.HttpProvider(
        'http://localhost:8545'
      );
      web3 = new Web3(this.web3Provider);
      console.log('new web3');
    }
    this.getUserAccount();
  }

  render() {
    return <div>{this.state.ethAddress}</div>;
  }
}

export default Web3Manager;
