import React, {Component} from 'react';
import styled from 'styled-components';
import Keyframes from './PulsingAnimation';

this.getGradient = props => {
  switch (props.status) {
    case 'won':
      return 'linear-gradient(90deg,#0cfbc6,rgb(18, 51, 220))';
    case 'lost':
      return 'linear-gradient(90deg,#d10808,rgb(4, 80, 175))';
    case 'draw':
      return 'linear-gradient(90deg,#d19408,rgb(4,80,175))';
    case 'x_won':
      return 'linear-gradient(90deg,#2fd108,rgb(4,80,175))';
    case 'o_won':
      return 'linear-gradient(90deg,#2fd108,rgb(4,80,175))';
    default:
      return null;
  }
};
const Container = styled.div`
  width: 100%;
  height: 55px;
  display: ${props => props.isModalOpen ? 'none': 'flex'};
  justify-content: center;
  align-items: center;
  box-shadow: rgba(168, 221, 224, 0.5) 0px 0px 15px 3px;
  background: ${props => this.getGradient(props)};
  border-radius: 6px;
  color: white;
  animation: ${Keyframes} 5s infinite;
  margin: 0.8em 0; 
`;

const Text = styled.p`
  text-transform: uppercase;
  letter-spacing: 3px;
  font-size: 20px;
  margin: 0;
`;

const Message = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Moves = styled.p`
  margin: 0;
  font-size: 11px;
  initial-letter: 0.2;
`;

class EndScreenMessage extends Component {
  render() {
    return (
      <Container {...this.props}>
        <Message>
          <Text>{this.props.children}</Text>
          <Moves>In {this.props.game.moveCounter} moves</Moves>
        </Message>
      </Container>
    );
  }
}

export default EndScreenMessage;
