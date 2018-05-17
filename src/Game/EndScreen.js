import React, {Component} from 'react';
import styled, {keyframes} from 'styled-components';
import GAME_STATUS from './GameStatus';
import Keyframes from './PulsingAnimation';

const Container = styled.div`
  width: 100%;
  height: 55px;
  position: absolute;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 33%;
  cursor: not-allowed;
  pointer-events: none;
  -ms-transform: rotate(27deg);
  box-shadow: rgba(168, 221, 224, 0.5) 0px 0px 15px 3px;
  background: linear-gradient(90deg, #08d196, rgb(4, 114, 175));
  border-radius: 6px;
  color: white;
  animation: ${Keyframes} 5s infinite;
`;

const Text = styled.p`
  text-transform: uppercase;
  letter-spacing: 3px;
  font-size: 20px;
`;

const Message = styled.div``;

class EndScreen extends Component {
  constructor() {
    super();
  }

  renderMessage() {
    let playersInGame = [];
    playersInGame.push(this.props.game.playerOAddr);
    playersInGame.push(this.props.game.playerXAddr);
    let myAddress = this.props.account.ethAddress;
    if (
      this.props.amIPlayerX &&
      this.props.game.status === GAME_STATUS.WINNER_X &&
      playersInGame.includes(myAddress)
    ) {
      return (
        <Message>
          <Text>You won</Text>
        </Message>
      );
    } else if (
      this.props.amIPlayerX &&
      this.props.game.status === GAME_STATUS.WINNER_O &&
      playersInGame.includes(myAddress)
    ) {
      return <Message>You lost!</Message>;
    } else if (
      !this.props.amIPlayerX &&
      this.props.game.status === GAME_STATUS.WINNER_O &&
      playersInGame.includes(myAddress)
    ) {
      return <Message>You won!</Message>;
    } else if (
      !this.props.amIPlayerX &&
      this.props.game.status === GAME_STATUS.WINNER_X &&
      playersInGame.includes(myAddress)
    ) {
      return <Message>You lost!</Message>;
    } else if (this.props.game.status === GAME_STATUS.DRAW) {
      return <Message>It's a draw!</Message>;
    } else if (!playersInGame.includes(myAddress)) {
      if (this.props.game.status === GAME_STATUS.WINNER_O) {
        return <Message>O has won!</Message>;
      } else if (this.props.game.status === GAME_STATUS.WINNER_X) {
        return <Message>X has won!</Message>;
      }
    }
  }

  render() {
    console.log(' I AM PLAYER X ?', this.props.amIPlayerX);
    return <Container>{this.renderMessage()}</Container>;
  }
}

export default EndScreen;
