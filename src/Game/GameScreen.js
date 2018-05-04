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

const CentralSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15em;
`;

const Result = styled.div``;

const MetaContainer = styled.div`
  margin-bottom: 60px;
  margin-top: -35px;
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
        console.log(this.state.game);
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
        // for (let i = 0; i < res.length; i++) {
        //     if (res[i] === '0')
        //         this.state.gameBoard[i] = '';
        //     else if (res[i] === '1')
        //         this.state.gameBoard[i] = 'x';
        //     else
        //         this.state.gameBoard[i] = 'o';
        // }
        // console.log(this.state.gameBoard);
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
          let gameId = this.state.game.gameId;
          this.setState({board: [], game: null, loading: true});
          await this.getGame(gameId);
          let newBoard = await this.getBoard(gameId);
          this.setState({board: newBoard, loading: false});
          //this.getBoard(gameId);
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
          <CentralSpinner>
            <GameSpinner />
          </CentralSpinner>
        ) : (
          <div>
            <TopContainer>
              <MetaContainer>
                <MetaMaskLogo />
              </MetaContainer>
              <GameTopInfo
                game={this.state.game}
                playerX={this.state.playerX}
                playerO={this.state.playerO}
              />
            </TopContainer>
            <ParentContainer>
              {/*<Board*/}
              {/*boardState={}*/}
              {/*onClick={tileNumber => {*/}

              {/*}}*/}
              {/*/>*/}
              <Board
                game={this.state.game}
                board={this.state.board}
                onChecked={tileChecked => {
                  this.playMove(tileChecked);
                }}
              />
              <MyTransactions web3={this.props.web3} />
            </ParentContainer>
          </div>
        )}
      </div>
    );
  }
}
export default GameScreen;
