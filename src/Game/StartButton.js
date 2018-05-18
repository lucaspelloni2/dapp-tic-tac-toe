import React, {Component} from 'react';
import styled from 'styled-components';
import Keyframes from './PulsingAnimation';
import GAME_STATUS from './GameStatus';
import {Link} from 'react-router-dom';
import GameIcon from './GameIcon';

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
`;
class StartButton extends Component {
  constructor() {
    super();
  }

  renderContent() {
    if (this.props.account.ethAddress === this.props.game.ownerAddr) {
      return (
        <Link
          style={{textDecoration: 'none'}}
          to={'/games?start=' + this.props.game.gameId}
        >
          <Container {...this.props}>
            <Message>
              <Text style={{marginRight: 10}}>Start the game</Text>
              <GameIcon icon={'play'} />
            </Message>
          </Container>
        </Link>
      );
    } else {
      return (
        <Link
          style={{textDecoration: 'none'}}
          to={'/games?start=' + this.props.game.gameId}
        >
          <Container {...this.props}>
            <Message>
              <Text>Waiting for the owner to start..</Text>
            </Message>
          </Container>
        </Link>
      );
    }
  }
  render() {
    return <div>{this.renderContent()}</div>;
  }
}

export default StartButton;
