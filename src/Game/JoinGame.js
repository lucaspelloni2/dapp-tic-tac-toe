import React, {Component} from 'react';
import styled from 'styled-components';
import ContractProps from './ContractProps';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

class JoinGame extends Component {
  componentDidMount() {
    this.getAvailableGames();
  }
  getAvailableGames() {
    // const myContract = new this.props.web3.eth.Contract(
    //   ContractProps.CONTRACT_ABI,
    //   ContractProps.CONTRACT_ADDRESS
    // );
    // console.log(
    //   myContract.methods
    //     .getOpenGameIds()
    //     .call({from: this.props.account.ethAddress})
    // );
    console.log(this.props.web3.eth);
  }
  render() {
    return (
      <Container>
        <h1>List of available Games</h1>
      </Container>
    );
  }
}

export default JoinGame;
