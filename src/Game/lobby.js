import React, {Component} from 'react';
import styled from 'styled-components';
import ButtonLink from './Link';
import MetaMaskLogo from './MetamaskLogo';
import BetsComponent from './BetsComponent';
import GameSpinner from './GameSpinner';
import GameIcon from './GameIcon';
import Header from './Header';

const ParentContainer = styled.div``;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: -8em;
`;
const LobbyContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 15px;
  text-align: center;
  width: 500px;
  height: 250px;
  box-shadow: rgba(168, 221, 224, 0.5) 0px 0px 15px 3px;
  overflow: scroll;
  background-image: radial-gradient(
    farthest-side at 212% 174px,
    #0177a2 0,
    #01497c 1200px
  );
`;

const ButtonContainer = styled.div`
  margin: 10px 0;
`;

const Column = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Separator = styled.div`
  width: 2px;
  opacity: 0.5;
  background-color: #f9fdff;
  margin: 0 6em;
  min-height: 400px;
`;

class Lobby extends Component {
  constructor() {
    super();
    this.state = {
      ids: [],
      username: localStorage.getItem('username')
    };
  }
  componentDidMount() {}

  render(props) {
    return (
      <div>
        {this.props.gamesLoading ? (
          <GameSpinner />
        ) : (
          <div>
            <Header
              account={this.props.account}
              addresses={this.props.addresses}
              provider={this.props.provider}
              updateUserAccount={async selectedAddress => {
                this.props.updateUserAccount(selectedAddress);
              }}

            />
            <ParentContainer>
              <div style={{marginBottom: 130}}>
                <MetaMaskLogo />
              </div>
              <Container>
                {/*<h1>Lobby</h1>*/}
                {/*<p style={{fontSize: 22, marginTop: 0, marginBottom: 10}}>*/}
                {/*Please select an option*/}
                {/*</p>*/}
                <LobbyContainer>
                  <Column>
                      <h1>Lobby</h1>
                    <ButtonsContainer>
                      <ButtonContainer>
                        <ButtonLink width={250} location={'games/create'}>
                          Create Game
                          <GameIcon icon={'create'} />
                        </ButtonLink>
                      </ButtonContainer>
                      <ButtonContainer>
                        <ButtonLink width={250} location={'games'}>
                          Join Game
                          <GameIcon icon={'join2'} />
                        </ButtonLink>
                      </ButtonContainer>
                      <ButtonContainer>
                        <ButtonLink width={250} location={''}>
                          Logout
                          <GameIcon icon={'logout'} />
                        </ButtonLink>
                      </ButtonContainer>
                    </ButtonsContainer>
                  </Column>
                  <Separator />
                  <div>
                    <BetsComponent
                      games={this.props.games}
                      gamesLoading={this.props.gamesLoading}
                      web3={this.props.web3}
                      contract={this.props.contract}
                      account={this.props.account}
                      maxHeight={350}
                    />
                  </div>
                </LobbyContainer>
              </Container>
            </ParentContainer>
          </div>
        )}
      </div>
    );
  }
}

export default Lobby;
