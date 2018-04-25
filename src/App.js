import React, {Component, createContext} from 'react';
import {Switch, Route} from 'react-router';
import {BrowserRouter} from 'react-router-dom';
import styled from 'styled-components';
import Login from './Game/login';
import './App.css';
import Context from './Game/Context';
import Web3 from 'web3';
import WelcomePage from './Game/WelcomePage';
import Lobby from "./Game/lobby";
import ContractProps from './Game/ContractProps';

let web3 = window.web3;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

class App extends Component {
  constructor() {
    super();
    this.state = {ethAddress: '', ethBalance: 0};
  }

  componentDidMount() {
    this.initWeb3();
    this.getGames();
  }

  getUserAccount() {
    web3.eth
      .getAccounts()
      .then(addr => {
        this.setState({ethAddress: addr.toString()});
        web3.eth
          .getBalance(addr.toString())
          .then(bal => {
            let inEth = web3.utils.fromWei(bal, "ether");
            this.setState({ethBalance: inEth});
          })
          .catch(err => {
            console.log('error getting balance' + err);
          });
      })
      .catch(err => {
        console.log('error getting address ' + err);
      });
  }

  getGames() {
    const myContract = new web3.eth.Contract(ContractProps.CONTRACT_ABI, ContractProps.CONTRACT_ADDRESS);
    console.log(myContract.methods.getOpenGameIds().call({from: this.state.ethAddress}));
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
    return (
      <Context.Provider value={this.state}>
        <Container>
          <BrowserRouter>
            <div>
              <Switch>
                  <Route path="/lobby" exact component={Lobby}/>
                <Route path="/login" exact component={Login} />
                <Route path="/" exact component={WelcomePage} />
              </Switch>
            </div>
          </BrowserRouter>
        </Container>
      </Context.Provider>
    );
  }
}

export default App;
