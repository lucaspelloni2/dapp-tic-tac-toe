import React, {Component} from 'react';
import Web3 from 'web3';
let web3 = window.web3;

class EtherAddress extends Component {
  constructor() {
    super();
    this.state = {ethAddress: ''};
  }

  componentDidMount() {
    this.initWeb3();
  }

  getUserAddress() {
    web3.eth
      .getAccounts()
      .then(addr => {
        console.log(addr);
        this.setState({ethAddress: addr.toString()});
      })
      .catch(err => {
        console.log("error " + err);
      });
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
    this.getUserAddress();
  }

  render() {
    return <div>Your Ethereum Address: {this.state.ethAddress}</div>;
  }
}

export default EtherAddress;
