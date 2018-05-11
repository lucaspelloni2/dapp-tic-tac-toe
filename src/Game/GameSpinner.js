import React, {Component} from 'react';
import {BounceLoader} from 'react-spinners';
import styled from 'styled-components';

const CentralSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15em;
`;

class GameSpinner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }
  render() {
    return (
      <CentralSpinner>
        <BounceLoader
          size={200}
          color={'#e4751b'}
          loading={this.state.loading}
        />
      </CentralSpinner>
    );
  }
}

export default GameSpinner;
