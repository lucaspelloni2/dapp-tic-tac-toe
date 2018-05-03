import React, {Component} from 'react';
import styled from 'styled-components';
import MetaMaskLogo from './MetamaskLogo';
import Spinner from './Spinner';
import MyTransactions from './MyTransactions';
import Transaction from './Transaction';
import ArrowWithPath from './ArrowWithPath';
import GameIcon from './GameIcon';
import {Redirect} from 'react-router';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const BetsContainer = styled.div`
  width: 700px;
  border: 1px solid transparent;
  box-shadow: 0 0 15px 3px rgba(168, 221, 224, 0.5);
  border-radius: 3px;
  padding: 1em;
  max-height: 400px;
  overflow: scroll;
  background-image: radial-gradient(
    farthest-side at 212% 174px,
    #e2751b 0,
    #016999 1200px
  );
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-right: -2em;
`;

const GameId = styled.p`
  font-size: 22px;
  font-weight: bold;
`;

const BetId = styled.p`
  font-size: 22px;
  font-weight: bold;
`;

const Table = styled.table`
  width: 100%;
  text-align: center;
`;
const Title = styled.p`
  font-size: 18px;
  font-weight: bold;
`;

const JoinParagraph = styled.p`
  margin-bottom: 0;
  margin-top: -12px;
  font-size: 16px;
  font-weight: bold;

  letter-spacing: 3px;
`;

const Button = styled.div`
  &:hover {
    border: 2px solid ${props => props.hoverColor};
  }
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  box-shadow: 0 0 3px 3px rgba(168, 221, 224, 0.5);
  border-radius: 18px;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.2s ease-out;
  margin-left: 1em;
`;

const ParentContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`;

const StatusContainer = styled.div`
  border: 1px solid ${props => (props.border ? props.border : props.color)};
  border-radius: 4px;
  padding: 4px;
  background-image: radial-gradient(
    farthest-side at 212% 174px,
    #0177a2 0,
    ${props => props.color} 1200px
  );
`;

class BetsScreen extends Component {
  constructor() {
    super();
    this.state = {
      bets: [],
      receivedGame: null,
      loading: true
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    let bets = this.state.bets;
    this.props.contract.methods
      .getBets()
      .call({from: this.props.account.ethAddress})
      .then(res => {
        for (let i = 0; i < res.betIds.length; i++) {
          let bet = this.createBet(res, i);
          if (bet !== null) {
            bets.push(bet);
          }
        }
        this.setState({bets: bets, loading: false});
      })
      .catch(err => {
        console.log('error getting bets ' + err);
      });
  }

  createBet(res, i) {
    let bet = {
      id: res.betIds[i],
      gameId: res.gameIds[i],
      state: res.states[i],
      bettorOnO: this.hexToAscii(res.bettorOnOs[i]),
      bettorOnX: this.hexToAscii(res.bettorOnXs[i]),
      value: this.props.web3.fromWei(res.values[i], 'ether')
    };
    return bet;
  }

  hexToAscii(byte32) {
    return this.props.web3.utils.hexToAscii(byte32).replace(/\u0000/g, '');
  }

  joinBet(betId, betValueInEth) {
    this.props.contract.methods
      .joinBet(betId)
      .send(
        {
          from: this.props.account.ethAddress,
          value: this.props.web3.utils.toWei(betValueInEth, 'ether')
        })
      .on('transactionHash', tx => {
        //this.addNewTx(tx, game.id, Status.GAME_JOINED);
        // this.setLoadingToTrue(game);
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

  renderBetButton(game, text) {
    // TODO: implement BET CALLS
    return (
      <Button
        hoverColor={'#03b8d4'}
        onClick={() => {
          this.playGame(game);
        }}
      >
        <GameIcon icon={'bet'}/>
        <JoinParagraph>{text}</JoinParagraph>
      </Button>
    );
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
        <div>
          {this.state.receivedGame ? (
            <Redirect
              to={`/games/${this.props.account.ethAddress}/${
                this.state.receivedGame.id
                }`}
            />
          ) : null}
        </div>
        <div>
          <MetaMaskLogo/>
          <ParentContainer>
            <Container>
              <h1>List of Bets</h1>
              <BetsContainer>
                {this.state.loading ? (
                  <SpinnerContainer>
                    <Spinner width={60} height={60}/>
                  </SpinnerContainer>
                ) : null}
                <Table>
                  <tbody>
                  <tr>
                    <th>
                      <Title>Bet Id</Title>
                    </th>
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
                      <Title>Who Bets on X</Title>
                    </th>
                    <th>
                      <Title>Who Bets on O</Title>
                    </th>
                    <th/>
                  </tr>
                  </tbody>
                  <tbody>
                  {this.state.bets.map(bet => (
                    <tr key={bet.id}>
                      <td>
                        <BetId>{bet.id}</BetId>
                      </td>
                      <td>
                        <GameId>{bet.gameId}</GameId>
                      </td>
                      <td>{bet.state}</td>
                      <td>{bet.value}</td>
                      <td>{bet.bettorOnX}</td>
                      <td>{bet.bettorOnO}</td>
                    </tr>
                  ))}
                  </tbody>
                </Table>
              </BetsContainer>
            </Container>
            <MyTransactions marginTop={5} web3={this.props.web3}/>
          </ParentContainer>

          <ArrowWithPath
            top={50}
            location={'/games/' + this.props.account.ethAddress}
          >
            Create a game!
          </ArrowWithPath>
        </div>
      </div>
    );
  }
}

export default BetsScreen;
