import React, {Component} from 'react';
import JoinButton from './JoinButton';
import EndScreen from './EndScreen';
import OpponentLoader from './OpponentLoader';
import GAME_STATUS from './GameStatus';
import StartButton from './StartButton';

class StatusBar extends Component {
  constructor() {
    super();
  }

  renderComponent() {
    if (
      this.props.game.status === GAME_STATUS.WAITING_FOR_O ||
      this.props.game.status === GAME_STATUS.WAITING_FOR_X
    ) {
      return (
        <JoinButton
          game={this.props.game}
          account={this.props.account}
          isModalOpen={this.props.isModalOpen}
        />
      );
    } else if (this.props.isTerminated) {
      return (
        <EndScreen
          isModalOpen={this.props.isModalOpen}
          account={this.props.account}
          game={this.props.game}
          amIPlayerX={this.props.amIPlayerX}
          isTerminated={this.props.isTerminated}
        />
      );
    } else if (
      (this.props.game.status === GAME_STATUS.O_HAS_TURN ||
        this.props.game.status === GAME_STATUS.X_HAS_TURN) &&
      !this.props.isMyTurn
    ) {
      return (
        <OpponentLoader
          isModalOpen={this.props.isModalOpen}
          game={this.props.game}
        />
      );
    } else if (this.props.game.status === GAME_STATUS.READY) {
      return (
        <StartButton
          account={this.props.account}
          game={this.props.game}
          isModalOpen={this.props.isModalOpen}
        />
      );
    } else {
      return <div style={{height: 55}} />;
    }
  }

  render() {
    return <div>{this.renderComponent()}</div>;
  }
}

export default StatusBar;
