import React, {Component} from 'react';
import styled from 'styled-components';
import Spinner from './Spinner';

const Container = styled.div`
  padding: 1.5rem 2.5rem;
  text-align: center;
  width: 600px;
  box-shadow: rgba(168, 221, 224, 0.5) 0px 0px 15px 3px;
  max-height: 350px;
  overflow: scroll;
  background-image: radial-gradient(
    farthest-side at 212% 174px,
    #0177a2 0,
    #02b8d4 1200px
  );
  
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
const StatusContainer = styled.div`
  border: 1px solid #02b8d4;
  border-radius: 4px;
  padding: 4px;
  background-image: radial-gradient(
    farthest-side at 212% 174px,
    #0177a2 0,
    #02b8d4 1200px
  );
`;
const TxConfirmation = styled.div``;

const ConfirmedIcon = styled.svg`
  fill: #00ff31;
  width: 30px;
  height: 30px;
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const TransactionCointainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: ${props => (props.marginTop ? props.marginTop : 0)}px;
`;

class MyTransactions extends Component {
  constructor() {
    super();
    let transactions;
    if (!localStorage.getItem('txs')) {
      transactions = [];
      localStorage.setItem('txs', JSON.stringify(transactions));
    } else {
      transactions = JSON.parse(localStorage.getItem('txs'));
    }

    this.state = {
      transactions: transactions
    };
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({transactions: JSON.parse(localStorage.getItem('txs'))});
      this.fetchData();
    }, 200);
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

  render(props) {
    return (
      <TransactionCointainer {...props}>
        <h1>Your Transactions</h1>
        <Container>
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
                  <Title>Action Type</Title>
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
                    <GameName>{transaction.gameName.substr(0, 10)}</GameName>
                  </td>
                  <td>
                    <TxHash
                      href={'https://ropsten.etherscan.io/tx/' + transaction.tx}
                      target="_blank"
                    >
                      {transaction.tx.toString().substr(0, 14)}...
                    </TxHash>
                  </td>
                  <td>
                    <StatusContainer>{transaction.status}</StatusContainer>
                  </td>
                  <td>
                    <TxConfirmation>
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
                    </TxConfirmation>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </TransactionCointainer>
    );
  }
}

export default MyTransactions;
