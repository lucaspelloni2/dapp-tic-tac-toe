import React, {Component} from 'react';
import styled from 'styled-components';


const Container = styled.div`
  width: 30%;
  height: 150px;
  font-size: 60px;
  background: transparent;
  outline:  6px solid #e4751b;
  boder-left: ${props => props.left ? 'none' : '8px'};
  display: table;
  float: left;
  line-height: 150px;
  text-align: center;
`;

const Value = styled.p`
  display: table-cell;
  vertical-align: middle;
  
  font-family: "Comic Sans MS", cursive, sans-serif;
  font-size: 90px ;
  font-weight: 700;
  color: #e4751b;
  
`;

class BoardTile extends Component {
    constructor() {
        super();
        this.state = {
            tileState: TILE_STATE.NONE
        };

    }

    render() {
        console.log(this.props.loc);
        return (
            <Container left className={"tile " + this.props.loc} onClick={() => {
                this.tileClick(this.props)
            }}>
                <Value>{this.props.value}</Value>
            </Container>
        )
    }

     tileClick(props) {
        props.updateBoard(props.loc, props.turn);
    }
}

const TILE_STATE = {
    "NONE": "NONE",
    "X": "X",
    "O": "O"
};

export default BoardTile;