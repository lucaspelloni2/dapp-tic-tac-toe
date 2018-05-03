import React, {Component} from 'react';
import styled from 'styled-components';
import MetaMaskLogo from './MetamaskLogo';
import MyTransactions from './MyTransactions';
import GameSpinner from './GameSpinner';

const MetaMaskContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Title = styled.div``;

const ParentContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`;

const CentralSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15em;
`;
const Container = styled.div``;

class GameScreen extends Component {
  constructor() {
    super();
    this.state = {
      game: null,
      loading: true
    };
  }

  async componentDidMount() {
    await this.getGame(this.props.match.params.gameId);
  }

  getGame(gameId) {
    return this.props.contract.methods
      .games(gameId)
      .call({from: this.props.account.ethAddress})
      .then(res => {
        let game = {
          gameId: res.gameId,
          name: this.props.web3.utils.hexToAscii(res.name),
          state: res.state,
          ownerAddr: res.ownerAddr,
          moveCounter: res.moveCounter,
          playerXAddr: res.playerXAddr,
          playerOAddr: res.playerOAddr
        };
        this.setState({game: game, loading: false});
      })
      .catch(err => {
        console.log('error getting game ' + gameId + ': ' + err);
      });
  }

  render() {
    return (
      <div>
        {this.state.loading ? (
          <CentralSpinner>
            <GameSpinner />
          </CentralSpinner>
        ) : (
          <div>
            <MetaMaskContainer>
              <MetaMaskLogo />
              <Title>Game {JSON.stringify(this.state.game)}</Title>
            </MetaMaskContainer>
            <ParentContainer>
              <Container />
              <MyTransactions web3={this.props.web3} />
            </ParentContainer>
          </div>
        )}
      </div>
    );
  }
}
export default GameScreen;
