import React, {Component} from 'react';
import styled from 'styled-components';
import MetaMaskLogo from './MetamaskLogo';
import MyTransactions from './MyTransactions';
import GameSpinner from './GameSpinner';
import Board from './Board';
import TicTacToeSymbols from './TicTacToeSymbols';

const TopContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 2em;
`;
const Title = styled.p`
  margin: 0;
  font-size: 38px;
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

const GameNameContainer = styled.div`
  border-radius: 4px;
  padding: 8px;
  background-image: radial-gradient(
    farthest-side at 212% 285px,
    #05e03e 0,
    #00a7cb 1200px
  );
  display: flex;
  justify-content: center;
  align-items: center;
`;

const GameInfo = styled.div`
  width: 400px;
`;

const PlayerContainer = styled.div`
  height: 125px;
  background: #005686;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const Result = styled.div``;
const Player = styled.div`
  width: 130px;
  box-shadow: rgba(168, 221, 224, 0.5) 0px 0px 15px 3px;
  border: 1px solid #03b8d4;
  line-height: 16px;
  text-transform: uppercase;
  white-space: nowrap;
  border-radius: 2px;
  padding: 4px;
`;

const PlayerX = Player.extend``;

const MetaContainer = styled.div`
  margin-bottom: 60px;
  margin-top: -35px;
`;

const XContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const PlayerName = styled.p`
  margin-bottom: 0;
  margin-top: 5px;
`;

const VsContainer = styled.div`
  margin-top: 0px;
  margin-bottom: 25px;
`;

const OContainer = XContainer.extend``;

const PlayerO = Player.extend``;

class GameScreen extends Component {
  constructor() {
    super();
    this.state = {
      game: null,
      playerX: null,
      playerO: null,
      loading: true
    };
  }

  async componentDidMount() {
    await this.getGame(this.props.match.params.gameId);
    const [playerX, playerO] = await Promise.all([
      this.getPlayer(this.state.game.playerXAddr),
      this.getPlayer(this.state.game.playerOAddr)
    ]);
    this.setState({playerX: playerX, playerO: playerO, loading: false});
  }

  getGame(gameId) {
    return this.props.contract.methods
      .games(gameId)
      .call({from: this.props.account.ethAddress})
      .then(res => {
        let game = {
          gameId: res.gameId,
          name: this.props.web3.utils.hexToAscii(res.name),
          state: res.state,
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
          playerName: this.props.web3.utils.hexToAscii(res)
        };
      })
      .catch(err => {
        console.log(
          'error getting player with address ' + address + ': ' + err
        );
      });
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
              <GameInfo>
                <GameNameContainer>
                  <Title>Game {this.state.game.gameId}</Title>
                </GameNameContainer>

                <PlayerContainer>
                  <XContainer>
                    <PlayerX>
                      <TicTacToeSymbols symbol={'X'} width={30} height={30} />
                    </PlayerX>
                    <PlayerName>{this.state.playerX.playerName}</PlayerName>
                  </XContainer>
                  <VsContainer>
                    <h2>VS</h2>
                  </VsContainer>
                  <OContainer>
                    <PlayerO>
                      <TicTacToeSymbols symbol={'O'} width={30} height={30} />
                    </PlayerO>
                    <PlayerName>{this.state.playerO.playerName}</PlayerName>
                  </OContainer>
                </PlayerContainer>
              </GameInfo>
            </TopContainer>
            <ParentContainer>
              {/*<Board*/}
              {/*boardState={}*/}
              {/*onClick={tileNumber => {*/}

              {/*}}*/}
              {/*/>*/}
              <Board />
              <MyTransactions web3={this.props.web3} />
            </ParentContainer>
          </div>
        )}
      </div>
    );
  }
}
export default GameScreen;
