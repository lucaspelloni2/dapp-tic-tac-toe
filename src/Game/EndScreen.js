import React, {Component} from 'react';
import styled, {keyframes} from 'styled-components';
import GAME_STATUS from './GameStatus';
import Typist from 'react-typist';
import 'react-typist/dist/Typist.css';
import EndScreenMessage from './EndScreenMessage';
import GameIcon from "./GameIcon";

class EndScreen extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    this.getStatus();
  }

  getStatus() {
    let playersInGame = [];
    playersInGame.push(this.props.game.playerOAddr);
    playersInGame.push(this.props.game.playerXAddr);
    let myAddress = this.props.account.ethAddress;
    if (
      this.props.amIPlayerX &&
      this.props.game.status === GAME_STATUS.WINNER_X &&
      playersInGame.includes(myAddress)
    ) {
      return 'won';
    } else if (
      this.props.amIPlayerX &&
      this.props.game.status === GAME_STATUS.WINNER_O &&
      playersInGame.includes(myAddress)
    ) {
      return 'lost';
    } else if (
      !this.props.amIPlayerX &&
      this.props.game.status === GAME_STATUS.WINNER_O &&
      playersInGame.includes(myAddress)
    ) {
      return 'win';
    } else if (
      !this.props.amIPlayerX &&
      this.props.game.status === GAME_STATUS.WINNER_X &&
      playersInGame.includes(myAddress)
    ) {
      return 'lost';
    } else if (this.props.game.status === GAME_STATUS.DRAW) {
      return 'draw';
    } else if (!playersInGame.includes(myAddress)) {
      if (this.props.game.status === GAME_STATUS.WINNER_O) {
        return 'o_won';
      } else if (this.props.game.status === GAME_STATUS.WINNER_X) {
        return 'x_won';
      }
    }
  }

  renderEndScreenMessage() {
    switch (this.getStatus()) {
        case 'won':
        return (
          <EndScreenMessage {...this.props} status={'won'}>
            You won <GameIcon icon={'award'}/>
          </EndScreenMessage>
        );
      case 'lost':
        return (
          <EndScreenMessage {...this.props} status={'lost'}>
            You lost
          </EndScreenMessage>
        );
      case 'draw':
        return (
          <EndScreenMessage {...this.props}  status={'draw'}>
            It's a draw
          </EndScreenMessage>
        );
      case 'o_won':
        return (
          <EndScreenMessage {...this.props} status={'o_won'}>
            Player O won
          </EndScreenMessage>
        );
      case 'x_won':
        return (
          <EndScreenMessage {...this.props} status={'x_won'}>
            Player X won
          </EndScreenMessage>
        );
      default:
        return (
          <EndScreenMessage game={this.props.game} status={'default'}>
            default
          </EndScreenMessage>
        );
    }
  }

  render() {
    return <div>{this.renderEndScreenMessage()}</div>;
  }
}

export default EndScreen;
