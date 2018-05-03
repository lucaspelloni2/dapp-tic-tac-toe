import React, {Component} from 'react';
import styled from 'styled-components';

const Container = styled.div``;

class GameScreen extends Component {
  constructor() {
    super();
    this.state = {
      game: null
    };
  }

  async componentDidMount() {
    await this.getGame(this.props.match.params.gameId);
    console.log(this.state.game);
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
        this.setState({game: game});
      })
      .catch(err => {
        console.log('error getting game ' + gameId + ': ' + err);
      });
  }

  render() {
    return <Container>{JSON.stringify(this.state.game)}</Container>;
  }
}
export default GameScreen;
