import React, {Component} from 'react';
import styled from 'styled-components';
import GameIcon from './GameIcon';
import StatusRender from './StatusRender';
import BET_STATUS from './BetStatus';
import Status from "./Status";
import Transaction from "./Transaction";

const BetsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  padding: 15px;
  text-align: center;
  width: 600px;
  box-shadow: rgba(168, 221, 224, 0.5) 0px 0px 15px 3px;
  max-height: 221px;
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
  font-size: 18px;
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
  width: 50px;
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
  justify-content: space-evenly;
  align-items: center;
  box-shadow: 0 0 3px 3px rgba(168, 221, 224, 0.5);
  border-radius: 4px;
  flex-direction: row;
  cursor: pointer;
  transition: all 0.2s ease-out;
  width: 65px;
`;

class Bets extends Component {
  constructor() {
    super();
    this.state = {
      bets: [],
      loading: false
    };
  }

  async componentDidMount() {
    await this.getBets();
    this.interval = setInterval(async () => {
      await this.getBets();
    }, 1000);
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
            bets.push(bet);
          }
        }
        this.setState({bets: bets});
      })
      .catch(err => {
        console.log('error getting bets ' + err);
      });
  }

  getBet(res, i) {
    // TODO: convert the returned values in ETH (now are in WEI)
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

  createBet(gameId, isBetOnX, betValueInEth) {
    this.props.contract.methods
      .createBet(gameId, isBetOnX)
      .send(
        {from: this.props.account.ethAddress,
          value: this.props.web3.utils.toWei(betValueInEth.toString(), 'ether')})
      .on('transactionHash', tx => {
        this.addNewTx(tx, gameId, Status.PLACED_BET);
        //this.setLoadingToTrue(game);
      })
      .on('receipt', res => {
        //console.log(res);
        if (res.status === '0x1') {
          console.log('bet created successfully');
        } else {
          console.log('bet could not be created');
        }
      })
      .on('confirmation', function (confirmationNr) {
        // is returned for the first 24 block confirmations
      });
  }

  joinBet(bet) {
    this.props.contract.methods
      .joinBet(bet.id)
      .send({from: this.props.account.ethAddress,
          value: bet.value})
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
      .on('confirmation', function (confirmationNr) {
        // is returned for the first 24 block confirmations
      });
  }

  getElement(bet) {
    switch (bet.status) {
      case BET_STATUS.MISSING_O_BETTOR:
        return (
          <Element color={'#3d41bb'} border={'#3d41bb'}>
            {bet.status}
          </Element>
        );
      case BET_STATUS.MISSING_X_BETTOR:
        return (
          <Element color={'#3d41bb'} border={'#3d41bb'}>
            {bet.status}
          </Element>
        );
      case BET_STATUS.FIXED:
        return <Element color={'#00ff32'}>{bet.status}</Element>;
      case BET_STATUS.PAYEDOUT:
        return (
          <Element color={'#024169'} border={'#02b8d4'}>
            {bet.status}
          </Element>
        );
      case BET_STATUS.WITHDRAWN:
        return (
          <Element color={'#024169'} border={'#02b8d4'}>
            {bet.status}
          </Element>
        );
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
          <GameIcon icon={'bet'} height={'14'}  />
          <Paragraph>BET</Paragraph>
        </Button>
      );
    } else {
      return null;
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

  render() {
    return (
      <div>
        {this.state.loading ? (
          <div>loading..</div>
        ) : (
          <BetsContainer>
            <h1>All Bets</h1>
            <Container>
              <Table>
                <tbody>
                  <tr>
                    <th>
                      <Title>Game Id</Title>
                    </th>
                    <th>
                      <Title>Status</Title>
                    </th>
                    <th>
                      <Title>Value</Title>
                    </th>
                    <th>
                      <Title>Who on X</Title>
                    </th>
                    <th>
                      <Title>Who on O</Title>
                    </th>
                    <th>
                      <Button
                        hoverColor={'#03b8d4'}
                        onClick={() => {
                          this.createBet(this.props.game.gameId, true, '0.04');
                        }}
                      >
                        <GameIcon icon={'bet'} height={'14'}  />
                        <Paragraph>ADD</Paragraph>
                      </Button>
                    </th>
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
                            <Value>{Math.round(this.props.web3.utils.fromWei(bet.value, 'ether') * 1000) / 1000}</Value>
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
