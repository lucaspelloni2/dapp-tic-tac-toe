import React, {Component} from 'react';
import styled from 'styled-components';
import Keyframes from './PulsingAnimation';
import GAME_STATUS from './GameStatus';

const Container = styled.div`
  height: 55px;
  display: ${props => (props.isModalOpen ? 'none' : 'flex')};
  justify-content: center;
  align-items: center;
  box-shadow: rgba(168, 221, 224, 0.5) 0px 0px 15px 3px;
  background: linear-gradient(90deg, #0cfbc6, rgb(18, 51, 220));
  border-radius: 6px;
  color: white;
  animation: ${Keyframes} 5s infinite;
  cursor: pointer;
  text-align: center;
  width: 400px;
  margin: 0.8em 0; 
`;

const Text = styled.p`
  text-transform: uppercase;
  letter-spacing: 3px;
  font-size: 16px;
  margin: 0;
  cursor: pointer;
`;

const Message = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
 
`;
class JoinButton extends Component {
  constructor() {
    super();
  }

  renderContent() {
    if (
      (this.props.game.status === GAME_STATUS.WAITING_FOR_X ||
        this.props.game.status === GAME_STATUS.WAITING_FOR_O) &&
      this.props.game.ownerAddr !== this.props.account.ethAddress
    ) {
      return (
        <Container {...this.props}>
          <Message>
            <Text>Do you want to join this game?</Text>
          </Message>
        </Container>
      );
    } else if (
      (this.props.game.status === GAME_STATUS.WAITING_FOR_X ||
        this.props.game.status === GAME_STATUS.WAITING_FOR_O) &&
      this.props.game.ownerAddr === this.props.account.ethAddress
    ) {
      return (
        <Container {...this.props}>
          <Message>
            <Text>Waiting for someone that joins your game!</Text>
          </Message>
        </Container>
      );
    } else {
      return null;
    }
  }
  render() {
    return <div>{this.renderContent()}</div>;
  }
}

export default JoinButton;
