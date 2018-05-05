import React, {Component} from 'react';
import styled from 'styled-components';
import GameIcon from './GameIcon';
import GameModal from './Modal';

const Container = styled.div`
  &:hover {
    background: #007bbd;
  }
  cursor: pointer; 
  border-radius: 4px;
  padding: 8px;
  background-image: radial-gradient(
    farthest-side at 212% 285px,
    #f90d0d 0,
    #008eda 1200px
  );
  display: flex;
  justify-content: center;
  align-items: center;
`;

class BetForm extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Container>
        <h3 style={{marginRight: 10}}>Add Your Bet</h3>

          <GameModal button={ <GameIcon icon={'add'} />}>
              modal content
          </GameModal>
      </Container>
    );
  }
}

export default BetForm;
