import React, {Component} from 'react';
import styled from 'styled-components';
import Context from './Context';
import ContractProps from './ContractProps';
import Spinner from './Spinner';
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

const TxHash = styled.a``;

const Status = styled.div``;

const ConfirmedIcon = styled.svg`
  fill: #00ff31;
  width: 30px;
  height: 30px;
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
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

  componentDidMount() {
      this.fetchData();
  }

  fetchData() {
    this.state.transactions.forEach(transaction => {
      this.props.web3.eth
        .getTransaction(transaction.tx)
        .then(receipt => {
          if (receipt.blockNumber) {
            transaction.blockNumber = receipt.blockNumber;
            transaction.confirmed = true;
            localStorage.setItem(
              'txs',
              JSON.stringify(this.state.transactions)
            );
          }
        })
        .catch(reason => {
          console.log(reason);
        });
    });
  }

  handleChange(e) {
    this.setState({gameName: e.target.value, clicked: false});
    localStorage.setItem('gameName', e.target.value);
  }

  createGame() {
    this.props.contract.methods
      .createGame(this.state.gameName, localStorage.getItem('username'))
      .send({from: this.props.account.ethAddress})
      .on('transactionHash', tx => {
        this.addNewTx(tx, this.state.gameName);
      })
      .on('receipt', res => {
        // TODO: recall the this.state function to the the state to true
        console.log('receipt', res);
      })
      .on('confirmation', function(gameId) {
        console.log('new game created! ' + gameId);
      });
  }

  addNewTx(tx, gameName) {
    let obj = {tx: tx, confirmed: false, gameName: gameName, blockNumber: null};
    let transactions = this.state.transactions;
    transactions.push(obj);
    this.setState({transactions: transactions});
    localStorage.setItem('txs', JSON.stringify(this.state.transactions));
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
              padding: '1em',
              maxHeight: 330,
              overflow: ' scroll'
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
                    <td>
                      <GameName>{transaction.gameName}</GameName>
                    </td>
                    <td>
                      <TxHash
                        href={
                          'https://ropsten.etherscan.io/tx/' + transaction.tx
                        }
                        target="_blank"
                      >
                        {transaction.tx.toString().substr(0, 14)}...
                      </TxHash>
                    </td>
                    <td>
                      <Status>
                        {transaction.blockNumber ? (
                          <ConfirmedIcon
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                          >
                            <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z" />
                          </ConfirmedIcon>
                        ) : (
                          <SpinnerContainer>
                            <Spinner width={30} height={30} />
                          </SpinnerContainer>
                        )}
                      </Status>
                    </td>
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
