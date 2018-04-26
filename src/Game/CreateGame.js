import React, {Component} from 'react';
import styled from 'styled-components';
import Context from './Context';
import ContractProps from './ContractProps';
import MetaMaskLogo from './MetamaskLogo';

const CreateGameContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const TransactionCointainer = styled.div`
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
  margin-bottom: 5em;
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

const Provider = styled.img`
  width: 100px;
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

const Table = styled.table`
  width: 100%;
  text-align: center;
`;

const Title = styled.p`
  font-size: 18px;
  font-weight: bold;
`;

const GameName = styled.p`
  font-weight: bold;
  letter-spacing: 1px;
`;

const TxHash = styled.a`

`;

const Status = styled.div`

`;

class CreateGame extends Component {
  constructor() {
    super();
    let transactions;
    if (localStorage.getItem('txs')) {
      transactions = JSON.parse(localStorage.getItem('txs'));
    } else {
      transactions = [];
    }

    this.state = {
      gameName: '',
      clicked: false,
      transactions: transactions
    };
  }

  componentDidMount() {}

  handleChange(e) {
    this.setState({gameName: e.target.value, clicked: false});
    localStorage.setItem('gameName', e.target.value);
  }

  createGame() {
    this.props.contract.methods
      .createGame(this.state.gameName, localStorage.getItem('username'))
      .send({from: this.props.account.ethAddress})
      .on('transactionHash', tx => {
        CreateGame.addNewTx(tx, this.state.gameName);
      })
      .on('receipt', res => {
        console.log('receipt', res);
      })
      .on('confirmation', function(gameId) {
        console.log('new game created! ' + gameId);
      });
  }

  static addNewTx(tx, gameName) {
    let txs = localStorage.getItem('txs')
      ? JSON.parse(localStorage.getItem('txs'))
      : [];
    let obj = {tx: tx, confirmed: false, gameName: gameName};
    txs.push(obj);
     localStorage.setItem('txs', JSON.stringify(txs));
  }

  render(props) {
    return (
      <ParentContainer>
        <CreateGameContainer>
          <Container width={640}>
            <MetaMaskLogo />
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
        <TransactionCointainer>
          <h1>Your Transactions</h1>
          <Container
            width={400}
            style={{
              boxShadow: 'rgba(168, 221, 224, 0.5) 0px 0px 15px 3px',
              padding: '1em'
            }}
          >
            <Table>
              <tbody>
                <tr>
                  <th>
                    <Title>Name</Title>
                  </th>
                  <th>
                    <Title>Tx Hash</Title>
                  </th>
                  <th>
                    <Title>Status</Title>
                  </th>
                </tr>
              </tbody>
              <tbody>
                {this.state.transactions.map(transaction => (
                  <tr key={transaction.tx}>
                      <td><GameName>{transaction.gameName}</GameName></td>
                      <td><TxHash href={'https://ropsten.etherscan.io/tx/'+transaction.tx} target="_blank">{transaction.tx.toString().substr(0,10)}...</TxHash></td>
                    <td><Status>pending</Status></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Container>
        </TransactionCointainer>
      </ParentContainer>
    );
  }
}

export default CreateGame;
