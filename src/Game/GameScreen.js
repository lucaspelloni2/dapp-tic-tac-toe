import React, {Component} from 'react';
import styled from 'styled-components';
import MyTransactions from './MyTransactions';
import GameSpinner from './GameSpinner';
import Board from './Board';
import Transaction from './Transaction';
import Status from './Status';
import StatusRender from './StatusRender';
import GameTopInfo from './GameTopInfo';
import BetsComponent from './BetsComponent';
import GAME_STATUS from './GameStatus';
import DEV from './../Environment';
import Header from './Header';
import StatusBar from './StatusBar';

const ParentContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

class GameScreen extends Component {
  constructor() {
    super();
    this.state = {
      game: null,
      board: null,
      playerX: null,
      playerO: null,
      loading: true,
      isTerminated: false
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
      loading: false,
      amIPlayerX: false,
      isModalOpen: false
    });

    console.log(this.state.game);

    if (!DEV) {
      const isMyTurn = this.isMyTurn();
      this.setState({isMyTurn: isMyTurn});
    }
    this.checkIfGameIsFinished();
    if (this.props.account.ethAddress === this.state.game.playerXAddr) {
      this.setState({amIPlayerX: true});
    } else {
      this.setState({amIPlayerX: false});
    }

    this.interval = setInterval(async () => {
      await this.getGame(gameId);
      let board = await this.getBoard(gameId);
      this.setState({board: board});
      this.checkIfGameIsFinished();
      if (this.props.account.ethAddress === this.state.game.playerXAddr) {
        this.setState({amIPlayerX: true});
      } else {
        this.setState({amIPlayerX: false});
      }
    }, 800);

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
        let isMyTurn = this.isMyTurn();

        if (DEV) {
          isMyTurn = true;
        }
        this.setState({isMyTurn: isMyTurn});
      })
      .catch(err => {
        console.log('error getting game ' + gameId + ': ' + err);
      });
  }

  checkIfGameIsFinished() {
    if (
      this.state.game.status === GAME_STATUS.DRAW ||
      this.state.game.status === GAME_STATUS.WINNER_O ||
      this.state.game.status === GAME_STATUS.WINNER_X
    ) {
      this.setState({isTerminated: true});
    }
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
    const gasAmount = await this.props.contract.methods
      .playMove(
        this.state.game.gameId,
        selectedTile % 3,
        Math.trunc(selectedTile / 3)
      )
      .estimateGas({from: this.props.account.ethAddress});

    this.props.contract.methods
      .playMove(
        this.state.game.gameId,
        selectedTile % 3,
        Math.trunc(selectedTile / 3)
      ) //this.props.web3.utils.toBN(
      .send({
        from: this.props.account.ethAddress,
        gas: gasAmount
      })
      .on('transactionHash', tx => {
        this.addNewTx(tx, this.state.game.gameId, Status.MOVE_MADE);
      })
      .on('receipt', async res => {
        let isSuccess =
          res.status.toString().includes('0x01') || res.status === '0x1'; // for private testnet || for metamask
        if (isSuccess) {
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

  isMyTurn() {
    let isMyTurn = false;
    if (
      this.state.amIPlayerX &&
      this.state.game.status === GAME_STATUS.X_HAS_TURN
    ) {
      isMyTurn = true;
    } else if (
      !this.state.amIPlayerX &&
      this.state.game.status === GAME_STATUS.O_HAS_TURN
    ) {
      isMyTurn = true;
    }
    return isMyTurn;
  }

  render() {
    return (
      <div style={{marginBottom: '4em'}}>
        {this.state.loading ? (
          <GameSpinner />
        ) : (
          <div>
            <Header
              account={this.props.account}
              addresses={this.props.addresses}
              updateUserAccount={async selectedAddress => {
                this.props.updateUserAccount(selectedAddress);
              }}
              provider={this.props.provider}
              games={this.props.games}
            />
            <ParentContainer>
              <ColumnContainer>
                <GameTopInfo
                  game={this.state.game}
                  playerX={this.state.playerX}
                  playerO={this.state.playerO}
                />
                <StatusBar
                  isModalOpen={this.state.isModalOpen}
                  account={this.props.account}
                  game={this.state.game}
                  amIPlayerX={this.state.amIPlayerX}
                  isTerminated={this.state.isTerminated}
                  isMyTurn={this.state.isMyTurn}
                />
                <Board
                  game={this.state.game}
                  board={this.state.board}
                  account={this.props.account}
                  onChecked={tileChecked => {
                    this.playMove(tileChecked);
                  }}
                  isMyTurn={this.state.isMyTurn}
                  isTerminated={this.state.isTerminated}
                />
              </ColumnContainer>
              <ColumnContainer>
                <BetsComponent
                  web3={this.props.web3}
                  contract={this.props.contract}
                  account={this.props.account}
                  games={this.props.games}
                  gamesLoading={this.props.gamesLoading}
                  game={this.state.game}
                  modalIsOpen={async isModalOpen => {
                    this.setState({isModalOpen: isModalOpen});
                  }}
                  updateUserAccount={async () => {
                    await this.props.updateUserAccount();
                  }}
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
