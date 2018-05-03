import React, {Component} from 'react';
import {BounceLoader} from 'react-spinners';

class GameSpinner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }
  render() {
    return (
        <BounceLoader size={200} color={'#e4751b'} loading={this.state.loading} />
    );
  }
}

export default GameSpinner;
