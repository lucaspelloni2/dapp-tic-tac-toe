import React, {Component} from 'react';
import styled from 'styled-components';
import GameIcon from './GameIcon';
import GameModal from './Modal';
import GameToolTip from './ToolTip';
import Select from 'react-select';
import {RadioGroup, RadioButton} from 'react-radio-buttons';
import TicTacToeSymbols from './TicTacToeSymbols';
import 'react-select/dist/react-select.css';
import '../tooltip.css';
import Status from './Status';
import Transaction from './Transaction';
import Gas from './Gas';

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

const LastRow = FormRow.extend`
  justify-content: space-around;
  width: 100%;
  margin-top: 20px;
  margin-bottom: 10px;
`;

const Label = styled.label`
  margin-right: 20px;
  width: 120px;
`;

const InputBalance = styled.input`
  width: 220px;
  height: 34px;
`;

const RadioInputsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 220px;
`;

const Button = styled.button`
  font-size: 14px;
  align-self: center;
  margin-top: 1em;
  margin-left: 9em;
`;

const ChildModalElement = styled.div`
  margin-left: ${props => (props.marginLeft ? props.marginLeft : null)};
  border: 1px solid #02b8d4;
  border-radius: 4px;
  padding: 4px;
  width: 175px;
  background-image: radial-gradient(
    farthest-side at 212% 174px,
    #0177a2 0,
    #01497c 1200px
  );
  display: flex;
  align-items: center;
  justify-content: ${props => (props.justifyContentCenter ? 'center' : null)};
  cursor: ${props => (props.justifyContentCenter ? 'pointer' : null)};
`;

const Confirm = styled.div`
  &:hover {
    background: #0030a7;
  }
  border: 1px solid #01497c;
  border-radius: 4px;
  padding: 4px;
  width: 120px;
  background: #01497c;
  cursor: pointer;
  transition: all 0.1s ease-out;
  text-align: center;
`;

const NotConfirm = Confirm.extend`
  &:hover {
    background: #d63d4b;
  }
  background: #c5545c;
  border: 1px solid #c5545c;
`;

const GamePreview = styled.div``;

const bigModal = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  content: {
    position: 'absolute',
    width: '50%',
    height: '55%',
    border: '1px solid #ccc',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    borderRadius: '4px',
    outline: 'none',
    top: '10%',
    left: '25%',
    right: 0,
    bottom: '10%',
    padding: '2em',
    background: '#024169'
  }
};
const smallModal = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  content: {
    position: 'absolute',
    top: '10%',
    left: '38%',
    right: 0,
    bottom: '10%',
    border: '1px solid rgb(204, 204, 204)',
    background: '#02b8d4 ',
    overflow: 'auto',
    borderRadius: '4px',
    outline: 'none',
    padding: '2em',
    width: '25%',
    height: '55%'
  }
};

class BetForm extends Component {
  constructor() {
    super();
    this.state = {
      selectedGame: null,
      betAmount: 0,
      isBetOnX: true,
      submitted: false,
      isToolTipVisible: true
    };
  }

  componentDidMount() {
    if (this.props.game) {
      this.setState({selectedGame: this.props.game});
      console.log('selected ', this.props.game);
    }
  }

  handleChange = selectedGame => {
    this.setState({selectedGame: selectedGame});
  };

  handleBetOn(value) {
    if (value === 'X') {
      this.setState({isBetOnX: true});
    } else {
      this.setState({isBetOnX: false});
    }
  }

  handleAmount(e) {
    const amount = e.target.value;
    this.setState({betAmount: amount});
  }

  createBet(game, isBetOnX, betValueInEth) {
    let gameId;
    if (this.props.game) {
      gameId = game.gameId;
    } else {
      gameId = game.id;
    }
    this.props.contract.methods
      .createBet(gameId, isBetOnX)
      .send({
        from: this.props.account.ethAddress,
        value: this.props.web3.utils.toWei(betValueInEth.toString(), 'ether'),
        gas: Gas.CREATE_BET
      })
      .on('transactionHash', tx => {
        this.addNewTx(tx, gameId, Status.PLACED_BET);
        this.setState({
          modalIsOpen: false,
          secondModalIsOpen: false
        });
      })
      .on('receipt', res => {
        //console.log(res);
        let isSuccess =
          res.status.toString().includes('0x01') || res.status === '0x1'; // for private testnet || for metamask
        if (isSuccess) {
          console.log('bet created successfully');
          this.props.updateUserAccount();
        } else {
          console.log('bet could not be created');
        }
      })
      .on('confirmation', function(confirmationNr) {
        // is returned for the first 24 block confirmations
      });
  }

  addNewTx(tx, gameId, status) {
    let transaction = new Transaction({
      tx: tx,
      confirmed: false,
      gameName: gameId,
      blockNumber: null,
      status
    });
    let transactions = JSON.parse(localStorage.getItem('txs'));
    transactions.unshift(transaction);
    localStorage.setItem('txs', JSON.stringify(transactions));
  }

  getDomain() {
    let domain = '';
    if (window.location.host.toString().includes('localhost')) {
      domain = 'http://localhost:3000/games/see/';
    } else {
      domain = 'games/see/';
    }
    return domain;
  }

  renderChildModal() {
    return (
      <div>
        {this.state.selectedGame ? (
          <ModalContainer>
            <h2 style={{marginTop: '1.5em'}}>Please Confirm your Bet</h2>
            <FormContainer>
              <FormRow>
                <Label>The game you selected: </Label>
                <ChildModalElement>
                  {this.state.selectedGame.name.replace(/\u0000/g, '')} (ID:{' '}
                  {this.state.selectedGame.gameId})
                </ChildModalElement>
              </FormRow>
              <FormRow>
                <Label>The amount you want to bet: </Label>
                <ChildModalElement>
                  {this.state.betAmount}{' '}
                  <GameIcon icon={'bet'} height={20} width={20} />
                </ChildModalElement>
              </FormRow>
              <FormRow>
                <Label>Your Bettor: </Label>
                <ChildModalElement>{this.renderBettor()}</ChildModalElement>
              </FormRow>
              <LastRow>
                <NotConfirm>Back</NotConfirm>
                <Confirm
                  onClick={() => {
                    this.createBet(
                      this.state.selectedGame,
                      this.state.isBetOnX,
                      this.state.betAmount
                    );
                  }}
                >
                  Confirm
                </Confirm>
              </LastRow>
            </FormContainer>
          </ModalContainer>
        ) : null}
      </div>
    );
  }

  renderBettor() {
    if (this.state.isBetOnX) {
      return <TicTacToeSymbols symbol={'X'} width={20} heigth={20} />;
    } else {
      return <TicTacToeSymbols symbol={'O'} width={20} heigth={20} />;
    }
  }

  renderModalContent() {
    return (
      <ModalContainer>
        <h2>Add Your Bet</h2>
        <FormContainer>
          <FormRow>
            <Label>Select the game you want</Label>
            <Select
              simpleValue
              style={{width: 220}}
              value={
                this.state.selectedGame
                  ? {
                      label: this.state.selectedGame.name.replace(/\u0000/g, ''),
                      value: this.state.selectedGame
                    }
                  : this.props.game
                    ? {
                        label: this.props.game.name.replace(/\u0000/g, ''),
                        value: this.props.game
                      }
                    : null
              }
              onChange={this.handleChange}
              options={this.props.games.map(game => ({
                label: game.name,
                value: game
              }))}
            />
            {this.state.selectedGame ? (
              <a
                href={this.getDomain() + this.state.selectedGame.id}
                target={'_blank'}
              >
                <GamePreview>
                  <ChildModalElement justifyContentCenter marginLeft={'20px'}>
                    Show the game <GameIcon icon={'search'} />
                  </ChildModalElement>
                </GamePreview>
              </a>
            ) : null}
          </FormRow>
          <FormRow>
            <Label>How many ETH you want to bet</Label>
            <InputBalance
              value={this.state.betAmount}
              type="number"
              onChange={this.handleAmount.bind(this)}
              min={0}
              max={this.props.account.ethBalance}
              step="any"
            />
            <div style={{marginLeft: 5}}>
              <GameToolTip
                overlay={
                  'ETH Balance: ' +
                  this.props.account.ethBalance.toString().substr(0, 8)
                }
                visible={this.state.isToolTipVisible}
                placement={'right'}
              >
                <GameIcon icon={'bet'} height={'35'} />
              </GameToolTip>
            </div>
          </FormRow>
          <FormRow>
            <Label>Choose your Bettor</Label>
            <RadioInputsContainer>
              <RadioGroup onChange={this.handleBetOn.bind(this)} horizontal>
                <RadioButton value={'X'}>
                  On <b>X</b>
                </RadioButton>
                <RadioButton value={'O'}>
                  On <b>O</b>
                </RadioButton>
              </RadioGroup>
            </RadioInputsContainer>
          </FormRow>
          <FormRow>
            <GameModal
              customStyles={smallModal}
              contentLabel={'Confirm'}
              openModal={() => {
                this.setState({
                  modalIsOpen: true,
                  isToolTipVisible: false
                });
              }}
              closeModal={() => {
                this.setState({
                  modalIsOpen: false,
                  secondModalIsOpen: false
                });
              }}
              modalIsOpen={this.state.modalIsOpen}
              button={<Button>Add bet</Button>}
            >
              {this.renderChildModal()}
            </GameModal>
          </FormRow>
        </FormContainer>
      </ModalContainer>
    );
  }

  render(props) {
    return (
      <GameModal
        openModal={() => {
          this.setState({
            secondModalIsOpen: true
          });
          if (this.props.game) {
            this.props.modalIsOpen(true);
          }
        }}
        closeModal={() => {
          this.setState({
            modalIsOpen: false,
            secondModalIsOpen: false
          });
          if (this.props.game) {
            this.props.modalIsOpen(false);
          }
        }}
        modalIsOpen={this.state.secondModalIsOpen}
        customStyles={bigModal}
        contentLabel={'Add Your Bet'}
        button={
          <Container>
            <Row>
              <Title>Add Your Bet</Title>
              <GameIcon icon={'add'} />
            </Row>
            <Row>
              {this.props.account ? (
                <Balance>
                  Your Balance:{' '}
                  {this.props.account.ethBalance.toString().substr(0, 5)} ETH
                </Balance>
              ) : (
                <Balance>Your Balance: (..) ETH</Balance>
              )}
            </Row>
          </Container>
        }
      >
        {this.renderModalContent()}
      </GameModal>
    );
  }
}

export default BetForm;
