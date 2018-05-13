import React, {Component} from 'react';
import styled from 'styled-components';
import Context from './Context';
import MyTransactions from './MyTransactions';
import MetaMaskLogo from './MetamaskLogo';
import Status from './Status';
import Transaction from './Transaction';
import ArrowWithPath from './ArrowWithPath';

const CreateGameContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: ${props => props.width}px;
  padding: 1.5rem 2.5rem;
  text-align: center;
`;

const LoginRow = styled.div`
  display: flex;
  height: 5rem;
  padding-top: 1rem;
  align-items: center;
  width: 100%;
`;

const SubTitle = styled.p`
  font-size: 22px;
  margin: 0 auto;
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

const ButtonLinkContainer = styled.div`
  margin-top: 20px;
  margin-right: -88px;
`;

const FieldsContainer = styled.div`
  width: 100%;
  margin-right: 88px;
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
      gameName: '',
      clicked: false
    };
  }

  handleChange(e) {
    this.setState({gameName: e.target.value, clicked: false});
    localStorage.setItem('gameName', e.target.value);
  }

  createGame() {
    this.props.contract.methods
      .createGame(
        this.props.web3.utils.fromAscii(this.state.gameName),
        this.props.web3.utils.fromAscii(localStorage.getItem('username'))
      )
      .send({from: this.props.account.ethAddress, gas: 4678127})
      .on('transactionHash', tx => {
        this.addNewTx(tx, this.state.gameName);
      })
      .on('receipt', res => {
        console.log('receipt', res);
      })
      .on('confirmation', function(gameId) {
        console.log('new game created! ' + gameId);
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
        <MetaMaskLogo />
        <ParentContainer>
          <CreateGameContainer>
            <Container width={640}>
              <h1>Create a new Game</h1>
              <SubTitle>Please fill the form below</SubTitle>
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

                <ButtonLinkContainer>
                  {this.state.clicked && this.createGame()}
                  <button
                    onClick={() => {
                      this.setState({
                        clicked: true
                      });
                    }}
                  >
                    Create Game
                  </button>
                </ButtonLinkContainer>
              </FieldsContainer>
            </Container>
          </CreateGameContainer>
          <MyTransactions web3={this.props.web3} />
        </ParentContainer>
        <ArrowWithPath location={'/games'}>Join a game!</ArrowWithPath>
      </div>
    );
  }
}

export default CreateGame;
