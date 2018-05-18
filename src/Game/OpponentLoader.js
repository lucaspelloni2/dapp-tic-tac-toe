import React, {Component} from 'react';
import styled from 'styled-components';
import OpponentSpinner from './OpponentSpinner';
import GAME_STATUS from './GameStatus';

const Container = styled.div`
  width: 100%;
  height: 177px;
  position: absolute;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  top: 70%;
  cursor: not-allowed;
  pointer-events: none;
`;

const WaitingForContainer = styled.div`
  margin-top: 6em;
  border-radius: 5px;
  border: 1px solid #0eef49;
  box-shadow: rgba(168, 221, 224, 0.5) 0px 0px 15px 3px;
  padding: 32px;
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WaitingFor = styled.p`
  font-size: 17px;
`;

class OpponentLoader extends Component {
  renderTurn() {
    if (this.props.game.status === GAME_STATUS.X_HAS_TURN) {
      return 'Waiting for X...';
    } else if (this.props.game.status === GAME_STATUS.O_HAS_TURN) {
      return 'Waiting for O...';
    }
  }

  render() {
    return (
      <div>
        {this.props.isModalOpen ? null : (
          <Container>
            <OpponentSpinner />
            <WaitingForContainer>
              <WaitingFor>{this.renderTurn()}</WaitingFor>
            </WaitingForContainer>
          </Container>
        )}
      </div>
    );
  }
}

export default OpponentLoader;
