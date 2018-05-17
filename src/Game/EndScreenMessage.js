import React, {Component} from 'react';
import styled, {keyframes} from 'styled-components';
import Keyframes from './PulsingAnimation';

this.getGradient = props => {
  return 'linear-gradient(90deg, #08d196, rgb(4, 114, 175))';
};
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
  background: ${props => this.getGradient(props)};
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

class EndScreenMessage extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Container {...this.props}>
        <Message>
          <Text>{this.props.children}</Text>
        </Message>
      </Container>
    );
  }
}

export default EndScreenMessage;
