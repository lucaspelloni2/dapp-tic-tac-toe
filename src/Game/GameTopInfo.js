import React, {Component} from 'react';
import styled from 'styled-components';
import GAME_STATUS from './GameStatus';
import TicTacToeSymbols from './TicTacToeSymbols';

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
  height: 145px;
  background: #005686;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const PlayerName = styled.p`
  margin-bottom: 0;
  margin-top: 5px;
`;

const VsContainer = styled.div`
  margin-top: 0px;
  margin-bottom: 25px;
`;
const XContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const OContainer = XContainer.extend``;

const Player = styled.div`
  width: 130px;
  box-shadow: rgba(168, 221, 224, 0.5) 0px 0px 15px 3px;

  //border: 1px solid #03b8d4;
  border-bottom: ${props =>
    props.isTurn ? '3px solid #f6841b' : 0}; // wer ish dra
  line-height: 16px;
  text-transform: uppercase;
  white-space: nowrap;
  border-radius: 2px;
  padding: 4px;
`;

const Title = styled.p`
  margin: 0;
  font-size: 38px;
`;

const PlayerX = Player.extend``;
const PlayerO = Player.extend``;

const CurrentTurn = styled.div`
  color: #f6841b;
  text-align: center;
  margin-top: -45px;
`;

class GameTopInfo extends Component {
  constructor() {
    super();
  }

  getCurrentPlayer() {
    return <p>{this.props.game.status.toString().replace(/_/g, ' ')} </p>;
  }

  render(props) {
    return (
      <GameInfo>
        <GameNameContainer>
          <Title>Game {this.props.game.gameId}</Title>
        </GameNameContainer>
        <PlayerContainer>
          <XContainer>
            <PlayerX isTurn={this.props.game.status === GAME_STATUS.X_HAS_TURN}>
              <TicTacToeSymbols symbol={'X'} width={30} height={30} />
            </PlayerX>
            <PlayerName>
              {this.props.playerX.playerName} ({this.props.game.playerXAddr.substr(
                0,
                5
              )})
            </PlayerName>
          </XContainer>
          <VsContainer>
            <h2>VS</h2>
          </VsContainer>
          <OContainer>
            <PlayerO isTurn={this.props.game.status === GAME_STATUS.O_HAS_TURN}>
              <TicTacToeSymbols symbol={'O'} width={30} height={30} />
            </PlayerO>
            <PlayerName>
              {this.props.playerO.playerName} ({this.props.game.playerOAddr.substr(
                0,
                5
              )})
            </PlayerName>
          </OContainer>
        </PlayerContainer>
        <CurrentTurn>{this.getCurrentPlayer()}</CurrentTurn>
      </GameInfo>
    );
  }
}

export default GameTopInfo;
