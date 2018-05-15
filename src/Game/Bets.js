import React, {Component} from 'react';
import styled from 'styled-components';
import GameIcon from './GameIcon';
import StatusRender from './StatusRender';
import BET_STATUS from './BetStatus';
import Status from './Status';
import Transaction from './Transaction';
import Gas from "./Gas";

const BetsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  padding: 15px;
  text-align: center;
  width: 680px;
  box-shadow: rgba(168, 221, 224, 0.5) 0px 0px 15px 3px;
  max-height: ${props => (props.maxHeight ? props.maxHeight : 221)}px;
  overflow: scroll;
  background-image: radial-gradient(
    farthest-side at 212% 174px,
    #0177a2 0,
    #01497c 1200px
  );
`;

const Table = styled.table`
  width: 100%;
  text-align: center;
`;

const Title = styled.p`
  font-size: 16px;
  font-weight: bold;
`;

const Element = styled.div`
  border: 1px solid ${props => (props.border ? props.border : 0)};
  border-radius: 4px;
  padding: 4px;
  background-image: radial-gradient(
    farthest-side at 212% 174px,
    #0177a2 0,
    ${props => props.color} 1200px
  );
`;

const ValueContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`;

const Value = styled.span`
  font-weight: bold;
  font-size: 16px;
  margin-left: 5px;
`;

const Paragraph = styled.p`
  margin-bottom: 0;
  margin-top: 0;
  font-size: 13px;
  font-weight: bold;

  letter-spacing: 3px;
`;

const Button = styled.div`
  &:hover {
    border: 1px solid ${props => props.hoverColor};
  }
  padding: 2px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 0 3px 3px rgba(168, 221, 224, 0.5);
  border-radius: 4px;
  flex-direction: row;
  cursor: pointer;
  transition: all 0.2s ease-out;
  width: 65px;
  height: 34px;
  margin: 3px 5px;
`;

const ValueColumn = styled.th`
  display: flex;
  align-items: center;
  cursor: pointer;
  justify-content: space-evenly;
`;

const Withdraw = styled.td`
  display: flex;
  flex-direction: column;
  cursor: pointer;
`;

class Bets extends Component {
  constructor() {
    super();
    this.state = {
      bets: [],
      loading: false,
      sortedAsc: true,
      sortedDesc: false
    };
  }

  async componentDidMount() {
    await this.getBets();
    this.interval = setInterval(async () => {
      await this.getBets();
    }, 3000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  async getBets() {
    let bets = [];
    return this.props.contract.methods
      .getBets()
      .call({from: this.props.account.ethAddress})
      .then(res => {
        for (let i = 0; i < res.betIds.length; i++) {
          let bet = this.getBet(res, i);
          if (bet !== null) {
            if (this.props.game) {
              // if a game is passed as prop in the bet component
              if (bet.gameId === this.props.game.gameId) {
                bets.push(bet);
              }
            } else {
              bets.push(bet);
            }
          }
        }
        this.setState({bets: bets});
        if (this.state.sortedAsc) {
          this.sortBetValuesAsc();
        }

        if (this.state.sortedDesc) {
          this.sortBetValuesDesc();
        }
      })
      .catch(err => {
        console.log('error getting bets ' + err);
      });
  }

  getBet(res, i) {
    return {
      id: res.betIds[i],
      gameId: res.gameIds[i],
      status: StatusRender.renderBetStatus(res.betStates[i]),
      bettorOnO: this.hexToAscii(res.bettorOnO[i]),
      bettorOnX: this.hexToAscii(res.bettorOnX[i]),
      value: res.values[i] //this.props.web3.fromWei(res.values[i].toString(), 'ether')
    };
  }

  hexToAscii(byte32) {
    return this.props.web3.utils.hexToAscii(byte32).replace(/\u0000/g, '');
  }

  joinBet(bet) {
    this.props.contract.methods
      .joinBet(bet.id)
      .send({
        from: this.props.account.ethAddress,
        value: bet.value,
        gas: Gas.JOIN_BET
      })
      .on('transactionHash', tx => {
        this.addNewTx(tx, bet.id, Status.JOINED_BET);
        //this.setLoadingToTrue(game);
      })
      .on('receipt', res => {
        //console.log(res);
        if (res.status === '0x1') {
          console.log('bet joined successfully');
        } else {
          console.log('bet could not be joined');
        }
      })
      .on('confirmation', function(confirmationNr) {
        // is returned for the first 24 block confirmations
      });
  }

  withdrawBet(betId) {
    this.props.contract.methods
      .withdrawBet(betId)
      .send({
        from: this.props.account.ethAddress,
        gas: Gas.WITHDRAW_BET
      })
      .on('transactionHash', tx => {
        this.addNewTx(tx, betId, Status.WITHDRAWN_BET);
        //this.setLoadingToTrue(game);
      })
      .on('receipt', res => {
        //console.log(res);
        if (res.status === '0x1') {
          console.log('bet withdrawn successfully');
        } else {
          console.log('bet withdraw not successful');
        }
      })
      .on('confirmation', function(confirmationNr) {
        // is returned for the first 24 block confirmations
      });
  }

  getElement(bet) {
    switch (bet.status) {
      case BET_STATUS.MISSING_O_BETTOR:
        return <Element color={'#3d41bb'}>{bet.status}</Element>;
      case BET_STATUS.MISSING_X_BETTOR:
        return <Element color={'#3d41bb'}>{bet.status}</Element>;
      case BET_STATUS.FIXED:
        return <Element color={'#00ff32'}>{bet.status}</Element>;
      case BET_STATUS.PAYEDOUT:
        return <Element color={'#024169'}>{bet.status}</Element>;
      case BET_STATUS.WITHDRAWN:
        return <Element color={'#008ad6'}>{bet.status}</Element>;
    }
  }

  getButton(bet) {
    if (
      bet.status === BET_STATUS.MISSING_X_BETTOR ||
      bet.status === BET_STATUS.MISSING_O_BETTOR
    ) {
      return (
        <Button
          hoverColor={'#03b8d4'}
          onClick={() => {
            this.joinBet(bet);
          }}
        >
          <GameIcon icon={'bet'} height={'14'} />
          <Paragraph>BET</Paragraph>
        </Button>
      );
    } else {
      return null;
    }
  }

  getWithdrawButton(bet) {
    // TODO ON SC: bettorOnXAddr : return an address and not a name
    // bet.bettorOnXAddr === this.props.account.ethAddress
    // bet.bettorOnOAddr === this.props.account.ethAddress
    if (
      bet.status === BET_STATUS.MISSING_O_BETTOR ||
      bet.status === BET_STATUS.MISSING_X_BETTOR
    ) {
      //
      return (
        <Button hoverColor={'#00ff32'} onClick={() => this.withdrawBet(bet.id)}>
          <Withdraw>
            <GameIcon icon={'withdraw'} />
            <p style={{fontSize: 8, margin: 0}}>Withdraw</p>
          </Withdraw>
        </Button>
      );
    }
  }

  addNewTx(tx, gameId, status) {
    let transaction = new Transaction({
      tx: tx,
      confirmed: false,
      gameName: gameId,
      blockNumber: null,
      status
    });
    let transactions = JSON.parse(localStorage.getItem('txs'));
    transactions.unshift(transaction);
    localStorage.setItem('txs', JSON.stringify(transactions));
  }

  sortBetValues() {
    if (this.state.sortedDesc) {
      this.sortBetValuesAsc();
    }

    if (this.state.sortedAsc) {
      this.sortBetValuesDesc();
    }
  }

  sortBetValuesAsc() {
    this.setState({isSortingLoading: true});
    const customSort = function(a, b) {
      return Number(a.value) - Number(b.value);
    };

    const data = this.state.bets;
    data.sort(customSort);
    this.setState({
      bets: data,
      sortedAsc: true,
      sortedDesc: false,
      isSortingLoading: false
    });
  }

  sortBetValuesDesc() {
    this.setState({isSortingLoading: true});
    const customSort = function(a, b) {
      return Number(b.value) - Number(a.value);
    };

    const data = this.state.bets;
    data.sort(customSort);
    this.setState({
      bets: data,
      sortedAsc: false,
      sortedDesc: true,
      isSortingLoading: false
    });
  }

  render(props) {
    return (
      <div>
        {this.state.loading ? (
          <div>loading..</div>
        ) : (
          <BetsContainer>
            <h1>All Bets</h1>
            <Container maxHeight={this.props.maxHeight}>
              <Table>
                <tbody>
                  <tr>
                    <th>
                      <Title>Game Id</Title>
                    </th>
                    <th>
                      <Title>Status</Title>
                    </th>
                    <ValueColumn onClick={e => this.sortBetValues()}>
                      <Title>Value</Title>
                      {this.state.sortedAsc ? (
                        <GameIcon icon={'sortup'} />
                      ) : (
                        <GameIcon icon={'sortdown'} />
                      )}
                    </ValueColumn>
                    <th>
                      <Title>Who on X</Title>
                    </th>
                    <th>
                      <Title>Who on O</Title>
                    </th>
                    <th />
                    <th />
                  </tr>
                </tbody>
                <tbody>
                  {this.state.bets.map(bet => (
                    <tr key={bet.id}>
                      <td>{bet.gameId}</td>
                      <td>{this.getElement(bet)}</td>
                      <td>
                        <Element color={'#024169'} border={'#02b8d4'}>
                          <ValueContainer>
                            <Value>
                              {Math.round(
                                this.props.web3.utils.fromWei(
                                  bet.value,
                                  'ether'
                                ) * 1000
                              ) / 1000}
                            </Value>
                            <GameIcon
                              icon={'bet'}
                              marginLeft={'auto'}
                              marginRight={'5px'}
                              height={'20'}
                            />
                          </ValueContainer>
                        </Element>
                      </td>
                      <td>{bet.bettorOnX}</td>
                      <td>{bet.bettorOnO}</td>
                      <td>{this.getButton(bet)}</td>
                      <td>{this.getWithdrawButton(bet)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Container>
          </BetsContainer>
        )}
      </div>
    );
  }
}

export default Bets;
