import React, {Component} from 'react';
import styled from 'styled-components';
import Context from './Context';
import MyTransactions from './MyTransactions';
import MetaMaskLogo from './MetamaskLogo';
import Status from './Status';
import Transaction from './Transaction';
import Gas from './Gas';
import Header from './Header';
import {Redirect} from 'react-router-dom';

const CreateGameContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: -49px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: ${props => props.width}px;
  padding: 1.5rem 2.5rem;
  text-align: center;

  box-shadow: rgba(168, 221, 224, 0.5) 0px 0px 15px 3px;
  background-image: radial-gradient(
    farthest-side at 5% 174px,
    #022a9b 0,
    #03b8d4 1200px
  );
`;

const LoginRow = styled.div`
  display: flex;
  height: 5rem;
  padding: 0.5rem 0;
  align-items: center;
  width: 100%;
`;

const InputLabel = styled.label`
  font-weight: bold;
  font-size: 18px;
  width: 100%;
  display: flex;
  align-items: center;
`;

const InputField = styled.input`
  margin-left: auto;
`;

const FieldsContainer = styled.div`
  width: 100%;
`;

const UserData = styled.p`
  width: 435px;
  margin-left: auto;
  font-size: 16px;
`;

const ParentContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

class CreateGame extends Component {
  constructor() {
    super();
    this.state = {
      gameName: null,
      clicked: false,
      createdGameName: null
    };
  }

  handleChange(e) {
    this.setState({gameName: e.target.value});
    //localStorage.setItem('gameName', e.target.value);
  }

  createGame(gameName) {
    this.props.contract.methods
      .createGame(
        this.props.web3.utils.fromAscii(gameName),
        this.props.web3.utils.fromAscii(localStorage.getItem('username'))
      )
      .send({from: this.props.account.ethAddress, gas: Gas.CREATE_GAME})
      .on('transactionHash', tx => {
        this.addNewTx(tx, this.state.gameName);
      })
      .on('receipt', res => {
        this.props.fetchGames();
        localStorage.setItem('last', JSON.stringify(gameName));
        this.state.createdGameName = gameName;
      })
      .on('confirmation', function(gameId) {
        // console.log('new game created! ' + gameId);
      });
  }

  addNewTx(tx, gameName) {
    let transaction = new Transaction({
      tx: tx,
      confirmed: false,
      gameName: gameName,
      blockNumber: null,
      status: Status.GAME_CREATED
    });
    let transactions = JSON.parse(localStorage.getItem('txs'));
    transactions.unshift(transaction);
    localStorage.setItem('txs', JSON.stringify(transactions));
  }

  render(props) {
    return (
      <div>
        {this.state.createdGameName ? (
          <Redirect to={`/games?gameName=${this.state.createdGameName}`} />
        ) : (
          <div>
            <Header
              account={this.props.account}
              addresses={this.props.addresses}
              updateUserAccount={async selectedAddress => {
                this.props.updateUserAccount(selectedAddress);
              }}
            />
            <MetaMaskLogo />
            <ParentContainer>
              <CreateGameContainer>
                <h1>Create a new Game</h1>
                <Container width={640}>
                  <FieldsContainer>
                    <LoginRow>
                      <Context.Consumer>
                        {account => (
                          <InputLabel>
                            Address
                            <UserData>{account.ethAddress}</UserData>
                          </InputLabel>
                        )}
                      </Context.Consumer>
                    </LoginRow>

                    <LoginRow>
                      <Context.Consumer>
                        {account => (
                          <InputLabel>
                            {' '}
                            Balance (ETH)
                            <UserData>{account.ethBalance}</UserData>
                          </InputLabel>
                        )}
                      </Context.Consumer>
                    </LoginRow>

                    <LoginRow>
                      <InputLabel>
                        Player name
                        <UserData>{localStorage.getItem('username')}</UserData>
                      </InputLabel>
                    </LoginRow>

                    <LoginRow>
                      <InputLabel>
                        Game name
                        <InputField
                          placeholder={'Game name'}
                          onChange={this.handleChange.bind(this)}
                        />
                      </InputLabel>
                    </LoginRow>
                  </FieldsContainer>
                </Container>
                <LoginRow style={{justifyContent: 'center'}}>
                  <button
                    onClick={() => {
                      this.createGame(this.state.gameName);
                    }}
                  >
                    Create Game
                  </button>
                </LoginRow>
              </CreateGameContainer>
              <MyTransactions web3={this.props.web3} />
            </ParentContainer>
          </div>
        )}
      </div>
    );
  }
}

export default CreateGame;
