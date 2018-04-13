import React, {Component} from 'react';
import styled from 'styled-components';

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
const LobbyContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  height: 500px;
  border-radius: 5px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

const TicImage = styled.img`
  height: 250px;
  transform: rotate(15deg);
  align-self: center;
`;

const ButtonContainer = styled.div``;

const Button = styled.button`
  width: 250px;
`;
class Lobby extends Component {
  render() {
    return (
      <Container>
        <img src="metamask.svg" width={100} />
        <h1>Lobby</h1>
          <p style={{fontSize: 22, marginTop: 0, marginBottom: 10}}>Please select an option</p>
        <LobbyContainer>
          <ButtonsContainer>
            <ButtonContainer>
              <Button>Create Game</Button>
            </ButtonContainer>
            <ButtonContainer>
              <Button>Join Game</Button>
            </ButtonContainer>
            <ButtonContainer>
              <Button>Make Bet</Button>
            </ButtonContainer>
            <ButtonContainer>
              <Button>Join Bet</Button>
            </ButtonContainer>
            <ButtonContainer>
              <Button>Rules</Button>
            </ButtonContainer>
            <ButtonContainer>
              <Button>Log-Out</Button>
            </ButtonContainer>
          </ButtonsContainer>
        </LobbyContainer>
      </Container>
    );
  }
}

export default Lobby;
