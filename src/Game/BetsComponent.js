import React, {Component} from 'react';
import Bets from './Bets';
import BetForm from './BetForm';

class BetsComponent extends Component {
  render() {
    return (
      <div>
        <Bets {...this.props} />
        <BetForm {...this.props} />
      </div>
    );
  }
}
export default BetsComponent;
