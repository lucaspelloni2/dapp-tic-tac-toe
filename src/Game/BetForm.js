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
  flex-direction: column;
`;

const Balance = styled.div`
  border-radius: 4px;
  padding: 4px;
  background-image: radial-gradient(
    farthest-side at 212% 174px,
    #0177a2 0,
    #1b0185 1200px
  );
`;

const Row = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h3`
  margin-top: 8px;
  margin-bottom: 8px;
  margin-right: 10px;
`;

const ModalContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const Form = styled.div``;

class BetForm extends Component {
  constructor() {
    super();
  }

  handleBet() {}
  renderModalContent() {
    return (
      <ModalContainer>
        <h2>Add Your Bet</h2>
        <form onSubmit={this.handleBet}>
        </form>
      </ModalContainer>
    );
  }

  render() {
    return (
      <Container>
        <Row>
          <Title>Add Your Bet</Title>
          <GameModal
            contentLabel={'Add Your Bet'}
            button={<GameIcon icon={'add'} />}
          >
            {this.renderModalContent()}
          </GameModal>
        </Row>
        <Row>
          <Balance>
            Your Balance: {this.props.account.ethBalance.substr(0, 5)} ETH
          </Balance>
        </Row>
      </Container>
    );
  }
}

export default BetForm;
