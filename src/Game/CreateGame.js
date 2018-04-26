import React, {Component} from 'react';
import styled from 'styled-components';
import Context from './Context';
import ContractProps from './ContractProps';
import MetaMaskLogo from './MetamaskLogo';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: url(back.jpg) no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  color: white;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 640px;
  padding: 1.5rem 2.5rem;
  text-align: center;
  margin-bottom: 5em;
`;

const LoginRow = styled.div`
  display: flex;
  height: 5rem;
  padding-top: 1rem;
  align-items: center;
  width: 100%;
`;

const SubTitle = styled.p`
  font-size: 22px;
  margin: 0 auto;
`;

const InputLabel = styled.label`
  font-weight: bold;
  font-size: 18px;
  width: 100%;
  display: flex;
  align-items: center;
`;

const InputField = styled.input`
  margin-left: auto;
`;

const ButtonLinkContainer = styled.div`
  margin-top: 20px;
  margin-right: -88px;
`;

const Provider = styled.img`
  width: 100px;
`;

const FieldsContainer = styled.div`
  width: 100%;
  margin-right: 88px;
`;

const UserData = styled.p`
  width: 435px;
  margin-left: auto;
  font-size: 16px;
`;
class CreateGame extends Component {
  constructor() {
    super();
      this.state = {
          gameName: '',
          clicked: false
      };
  }

  handleChange(e) {
      this.setState({gameName: e.target.value, clicked: false});
      localStorage.setItem('gameName', e.target.value);
  }

  createGame() {
      this.props.contract.methods
          .createGame(this.state.gameName,localStorage.getItem('username'))
          .send({from: this.props.account.ethAddress})
          .on('confirmation', function(gameId){
            console.log("new game created! " + gameId);
          });
  }
  render() {
    return (
      <Container>
        <LoginContainer>
          <MetaMaskLogo />
          <h1>Create a new Game</h1>
          <SubTitle>Please fill the form below</SubTitle>
          <FieldsContainer>
            <LoginRow>
              <Context.Consumer>
                {account => (
                  <InputLabel>
                    Address
                    <UserData>{account.ethAddress}</UserData>
                  </InputLabel>
                )}
              </Context.Consumer>
            </LoginRow>

            <LoginRow>
              <Context.Consumer>
                {account => (
                  <InputLabel>
                    {' '}
                    Balance (ETH)
                    <UserData>{account.ethBalance}</UserData>
                  </InputLabel>
                )}
              </Context.Consumer>
            </LoginRow>

            <LoginRow>
              <InputLabel>
                Player name
                <UserData>{localStorage.getItem('username')}</UserData>
              </InputLabel>
            </LoginRow>

            <LoginRow>
              <InputLabel>
                Game name
                <InputField
                  placeholder={'Game name'}
                  onChange={this.handleChange.bind(this)}
                />
              </InputLabel>
            </LoginRow>

            <ButtonLinkContainer>
              {this.state.clicked && this.createGame()}
              <button
                onClick={() => {
                  this.setState({
                    clicked: true
                  });
                }}
              >
                Create Game
              </button>
            </ButtonLinkContainer>
          </FieldsContainer>
        </LoginContainer>
      </Container>
    );
  }
}

export default CreateGame;
