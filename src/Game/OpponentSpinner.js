import React, {Component} from 'react';
import {ClimbingBoxLoader} from 'react-spinners';

class OpponentSpinner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }
  render() {
    return (
      <ClimbingBoxLoader
        size={20}
        color={'#0eef49'}
        loading={this.state.loading}
      />
    );
  }
}

export default OpponentSpinner;
