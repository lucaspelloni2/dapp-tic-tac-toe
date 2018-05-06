import React, {Component} from 'react';
import styled from 'styled-components';
import GameIcon from './GameIcon';
import GameModal from './Modal';
import GameToolTip from './ToolTip';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import '../tooltip.css'; 

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

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

const FormRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
`;

const Label = styled.label`
  margin-right: 20px;
  width: 120px;
`;

const OptionContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const OptionId = styled.div`
  font-weight: bold;
  margin-right: 5px;
`;

const OptionIconContainer = styled.div`
  margin-left: auto;
`;

const OptionGameName = styled.div`
  border: 1px solid #0177a2;
  color: white;
  border-radius: 4px;
  padding: 4px;
  background-image: radial-gradient(
    farthest-side at 212% 174px,
    #0177a2 0,
    #02e3ff 1200px
  );
`;

const InputBalance = styled.input`
  width: 220px;
  height: 34px;
`;

class BetForm extends Component {
  constructor() {
    super();
    this.state = {
      selectedGame: null
    };
  }

  handleChange = selectedGame => {
    this.setState({selectedGame: selectedGame});
    console.log('selected ', selectedGame);
  };

  updateValue(selectedGame) {
    // this.setState({
    //     selectedGame: selectedGame
    // });
    console.log(selectedGame);
  }

  renderLabel(game) {
    return (
      <OptionContainer>
        <OptionId>{game.id}: </OptionId>
        <OptionGameName>{game.name}</OptionGameName>
        <OptionIconContainer>
          <GameIcon icon={'bet'} height={'15'} />
        </OptionIconContainer>
      </OptionContainer>
    );
  }

  renderModalContent() {
    return (
      <ModalContainer>
        <h2>Add Your Bet</h2>
        <form onSubmit={this.handleBet}>
          <FormContainer>
            <FormRow>
              <Label>Select the game you want</Label>
              <Select
                simpleValue
                style={{width: 220}}
                value={
                  this.state.selectedGame
                    ? {
                        label: this.state.selectedGame.name,
                        value: this.state.selectedGame
                      }
                    : null
                }
                onChange={this.handleChange}
                options={this.props.games.map(game => ({
                  label: game.name,
                  value: game
                }))}
              />
            </FormRow>
            <FormRow>
              <Label>How many ETH you want to bet</Label>
              <InputBalance type="number" />
              <div style={{marginLeft: 5}}>
                <GameToolTip
                  overlay={'ETH Balance: ' + this.props.account.ethBalance}
                >
                  <GameIcon icon={'bet'} height={'35'} />
                </GameToolTip>
              </div>
            </FormRow>
          </FormContainer>
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
