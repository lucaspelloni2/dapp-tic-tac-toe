import React, { Component} from 'react';
import styled from 'styled-components';

const Container = styled.div`
  text-align: center;
  vertical-align: middle;
  line-height: 200px;
  min-height: 200px;
  font-size: 40px;
  color: #e4751b;
`;

export default class Annoucement extends Component {
    render() {
        return (

            <Container>
                <h2> {this.announce()} </h2>
            </Container>
        )
    }

    announce() {
        if(this.props.winner) {
            return 'Game over! {this.props.winner} has won';
        } else if (this.props.turn === this.props.player) {
            return 'Your turn';
        } else {
            return 'Wait for enemies move'
        }
    }
}