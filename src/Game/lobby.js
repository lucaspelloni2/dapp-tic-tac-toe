import React, {Component} from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  //background: url(loginback.jpg) no-repeat center center fixed;
  //-webkit-background-size: cover;
  //-moz-background-size: cover;
  //-o-background-size: cover;
  //background-size: cover;
`;
const LobbyContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 800px;
  height: 500px;
  border-radius: 5px;
  background: linear-gradient(141deg, #ffffff 0%, #1fc8db 51%, #2cb5e8 75%);
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  margin: 1em 0; 
`;

const TicImage = styled.img`
    height: 250px;
    transform: rotate(15deg);
    align-self: center;
`;

class Lobby extends Component {
  render() {
    return (
      <Container>
        <h1>Lobby</h1>
        <LobbyContainer>
          <ButtonsContainer>
            <button>Create Game</button>
            <button>Join Game</button>
            <button>Make Bet</button>
            <button>Join Bet</button>
            <button>Rules</button>
            <button>Log-Out</button>
          </ButtonsContainer>

          <TicImage src="tic.png" />
        </LobbyContainer>
      </Container>
    );
  }
}

export default Lobby;
