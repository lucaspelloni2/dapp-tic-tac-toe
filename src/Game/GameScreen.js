import React, {Component} from 'react';
import styled from 'styled-components';
import MetaMaskLogo from './MetamaskLogo';
import MyTransactions from './MyTransactions';
import GameSpinner from './GameSpinner';
import Board from './Board';
import Transaction from './Transaction';
import Status from './Status';
import StatusRender from './StatusRender';
import GameTopInfo from './GameTopInfo';
import Bets from './Bets';
import BetForm from './BetForm';
import Prompt from './Prompt';
import Popup from 'react-popup';
import BetsComponent from './BetsComponent';

const TopContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 2em;
`;

const ParentContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`;

const MetaContainer = styled.div`
  margin-bottom: 60px;
  margin-top: -35px;
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

class GameScreen extends Component {
  constructor() {
    super();
    this.state = {
      game: null,
      board: null,
      playerX: null,
      playerO: null,
      loading: true
    };
  }

  async componentDidMount() {
    let gameId = this.props.match.params.gameId;
    await this.getGame(gameId);
    const [playerX, playerO, board] = await Promise.all([
      this.getPlayer(this.state.game.playerXAddr),
      this.getPlayer(this.state.game.playerOAddr),
      this.getBoard(gameId)
    ]);
    this.setState({
      playerX: playerX,
      playerO: playerO,
      board: board,
      loading: false
    });

    this.interval = setInterval(async () => {
      await this.getGame(gameId);
      let board = await this.getBoard(gameId);
      this.setState({board: board});
    }, 2000);

    // META MASK CANT HANDLE EVENTS AT THE MOMENT, FOLLOW ISSUE:  https://github.com/MetaMask/metamask-extension/issues/3642
    // this.props.contract.events.MoveMade({
    //     filter: {gameId: '6'} //{myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'}, // Using an array means OR: e.g. 20 or 23
    //     // ,fromBlock: 0
    //   },
    //   function (error, event) {
    //     console.log(event);
    //     console.log(error);
    //   })
    //   .on('data', function (event) {
    //     console.log(event); // same results as the optional callback above
    //   })
    //   .on('changed', function (event) {
    //     // remove event from local database
    //   })
    //   .on('error', console.error);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getGame(gameId) {
    return this.props.contract.methods
      .games(gameId)
      .call({from: this.props.account.ethAddress})
      .then(res => {
        let game = {
          gameId: res.gameId,
          name: this.props.web3.utils.hexToAscii(res.name),
          status: StatusRender.renderStatus(res.state),
          ownerAddr: res.ownerAddr,
          moveCounter: res.moveCounter,
          playerXAddr: res.playerXAddr,
          playerOAddr: res.playerOAddr
        };
        this.setState({game: game});
      })
      .catch(err => {
        console.log('error getting game ' + gameId + ': ' + err);
      });
  }

  getPlayer(address) {
    return this.props.contract.methods
      .players(address)
      .call({from: this.props.account.ethAddress})
      .then(res => {
        return {
          playerName: this.props.web3.utils
            .hexToAscii(res)
            .replace(/\u0000/g, '')
        };
      })
      .catch(err => {
        console.log(
          'error getting player with address ' + address + ': ' + err
        );
      });
  }

  getBoard(gameId) {
    return this.props.contract.methods
      .getBoard(gameId)
      .call({from: this.props.account.ethAddress})
      .then(res => {
        return res;
      })
      .catch(err => {
        console.log('error getting board from game ' + gameId + ': ' + err);
      });
  }

  async playMove(selectedTile) {
    // this.setState({
    //     board: {
    //         ...this.state.board,
    //         [selectedTile]: '1'
    //     }
    // });
    this.props.contract.methods
      .playMove(
        this.state.game.gameId,
        selectedTile % 3,
        Math.trunc(selectedTile / 3)
      ) //this.props.web3.utils.toBN(
      .send({from: this.props.account.ethAddress})
      .on('transactionHash', tx => {
        this.addNewTx(tx, this.state.game.gameId, Status.MOVE_MADE);
        // this.setLoadingToTrue(this.state.game);
      })
      .on('receipt', async res => {
        //console.log(res);
        if (res.status === '0x1') {
          console.log('play successful');
        } else {
          console.log('play not successful');
        }
      })
      .on('confirmation', function(confirmationNr) {
        // is returned for the first 24 block confirmations
        //console.log('new game joined ' + confirmationNr);
      });
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
      <div style={{marginBottom: '4em'}}>
        {this.state.loading ? (
          <GameSpinner />
        ) : (
          <div>
            {/*<TopContainer>*/}
            {/*<MetaContainer>*/}
            {/*<MetaMaskLogo />*/}
            {/*</MetaContainer>*/}
            {/*</TopContainer>*/}
            <ParentContainer>
              <ColumnContainer>
                <GameTopInfo
                  game={this.state.game}
                  playerX={this.state.playerX}
                  playerO={this.state.playerO}
                />
                <Board
                  game={this.state.game}
                  board={this.state.board}
                  onChecked={tileChecked => {
                    this.playMove(tileChecked);
                  }}
                />
              </ColumnContainer>
              <ColumnContainer>
                <BetsComponent
                  web3={this.props.web3}
                  contract={this.props.contract}
                  account={this.props.account}
                  games={this.props.games}
                  gamesLoading={this.props.gamesLoading}
                />
                <MyTransactions web3={this.props.web3} />
              </ColumnContainer>
            </ParentContainer>
          </div>
        )}
      </div>
    );
  }
}

export default GameScreen;
