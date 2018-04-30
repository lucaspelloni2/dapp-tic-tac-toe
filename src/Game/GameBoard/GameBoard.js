import React, {Component} from 'react';
import styled from 'styled-components';
import BoardTile from "./BoardTile";
import Announcement from "./Annoucement";

const Container = styled.div`
  text-align: center;
  margin: auto;
  
`;
const Table = styled.div`
  width: 470px;
    text-align: center;
  margin-left: auto;
  margin-right: auto;
  
`;


class GameBoard extends Component {
    constructor() {
        super();
        this.state = {
            gameBoard: [
                '', '', '',
                '', '', '',
                '', '', ''
            ],
            turn: 'x',
            winner: null,
            moves: 0,
            player: 'x'
        }

    }

    render() {
        return (
            <Container>
                <Announcement winner={this.state.winner} turn={this.state.turn} player={this.state.player}/>
                <Table>
                {this.state.gameBoard.map(function (value, i) {
                    return (
                        <BoardTile key={i}
                                   loc={i}
                                   value={value}
                                   updateBoard={this.updateBoard.bind(this)}
                                   turn={this.state.turn}/>
                    );
                }.bind(this))}
                </Table>
            </Container>
        )
    }

    updateBoard(loc, player) {
        console.log(loc);
        //check for invalid move
        if (this.state.turn !== this.state.player || this.state.winner) {
            return;
        }
        if (this.state.gameBoard[loc] === 'x' || this.state.gameBoard[loc] === 'o') {
            return;
        }

        let currentGameBoard = this.state.gameBoard;
        currentGameBoard.splice(loc, 1, this.state.turn);
        this.setState({gameBoard: currentGameBoard});

        if (this.state.moves >= 9) {
            this.setState({winner: 'draw'});
        }


        //TODO: send new state to blockchain --> get state to check for winner, remove this
        this.setState({turn: (this.state.turn === 'x') ? 'o' : 'x'});
        this.setState({player: (this.state.player === 'x') ? 'o' : 'x'});
        this.setState({moves: this.state.moves + 1})

    }
}

export default GameBoard;
