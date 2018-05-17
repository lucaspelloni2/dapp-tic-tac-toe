import React, {Component} from 'react';
import styled from 'styled-components';
import Spinner from './Spinner';
import GameIcon from './GameIcon';

const Container = styled.div`
  padding: 1.5rem 2.5rem;
  text-align: center;
  width: 600px;
  box-shadow: rgba(168, 221, 224, 0.5) 0px 0px 15px 3px;
  max-height: 400px;
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

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const TransactionCointainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: ${props => (props.marginTop ? props.marginTop : '0')}px;
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

  async componentDidMount() {
    this.interval = setInterval(async () => {
      this.setState({transactions: JSON.parse(localStorage.getItem('txs'))});
      await this.fetchData();
    }, 1500);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  fetchData() {
    return this.state.transactions.forEach(transaction => {
      this.props.web3.eth
        .getTransaction(transaction.tx)
        .then(receipt => {
          if (receipt) {
            transaction.blockNumber = receipt.blockNumber;
            let isSuccess =
              receipt.status.toString().includes('0x01') || receipt.status === '0x1'; // for private testnet || for metamask
            if (isSuccess) {
              transaction.confirmed = true;
            }
            else {
              transaction.confirmed = false;
            }
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
                        transaction.confirmed ?
                          (<GameIcon icon={'confirmation'}/>)
                          : (<GameIcon icon={'fail'}/>)
                      ) : (
                        <SpinnerContainer>
                          <Spinner width={30} height={30}/>
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
