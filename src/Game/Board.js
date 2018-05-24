import React, {Component} from 'react';
import styled from 'styled-components';
import TicTacToeSymbols from './TicTacToeSymbols';
import GAME_STATUS from "./GameStatus";

const BoardContainer = styled.div`
  width: 400px;
  height: 400px;
  box-shadow: rgba(43, 9, 9, 0.4) 0px 0px 15px 3px;
  background-image: radial-gradient(
    farthest-side at 212% 285px,
    #0eef49 0,
    #03b8d4 1200px
  );
  pointer-events: ${props => (props.isMyTurn ? null : 'none')};
  opacity: ${props => ( ((props.isMyTurn && !props.isTerminated) || !props.spinnerCanBeShown)? 1 : 0.15)};
  //border: 1px solid #03b8d4;
`;

const Table = styled.table`
  border-spacing: 6px;
  text-align: center;
  width: 100%;
  height: 100%;
  border-collapse: collapse;
  table-layout: fixed;

  color: black;
`;

const Row = styled.tr`
  border-top: 5px solid #0186ae;
  height: 133px;
  &:first-child {
    border-top: 0;
  }
`;

const InactiveSquare = styled.td`
  padding: 8px;
  border-right: 5px solid #0186ae;
  &:last-child {
    border-right: 0;
  }
  cursor: ${'not-allowed'};
`;

const Square = styled.td`
  &:hover {
    background-image: radial-gradient(
      farthest-side at 212% 285px,
      #0acfd0 0,
      #03b8d4 1200px
    );
  }
  cursor: ${props => (props.isMyTurn ? 'pointer' : 'not-allowed')};
  padding: 8px;
  border-right: 5px solid #0186ae;
  &:last-child {
    border-right: 0;
  }
`;

class Board extends Component {
  static renderSymbol(symbol) {
    switch (symbol) {
      case '0':
        return '';
      case '1':
        return <TicTacToeSymbols width={70} heigth={70} symbol={'X'} />;
      case '2':
        return <TicTacToeSymbols width={70} heigth={70} symbol={'O'} />;
      default:
        return <div>default</div>;
    }
  }

  render() {
    return (
      <div>
        <BoardContainer {...this.props}>
          <Table>
            <tbody>
              {new Array(3).fill(true).map((a, i) => {
                return (
                  <Row key={i}>
                    {new Array(3).fill(true).map((b, j) => {
                      return (this.props.game.playerXAddr ===
                        this.props.account.ethAddress &&
                        this.props.game.status === GAME_STATUS.X_HAS_TURN &&
                        this.props.board[i * 3 + j] === '0') ||
                        (this.props.game.playerOAddr ===
                          this.props.account.ethAddress &&
                          this.props.game.status === GAME_STATUS.O_HAS_TURN &&
                          this.props.board[i * 3 + j] === '0') ? (
                        <Square
                          key={i * 3 + j}
                          data-col={i}
                          data-row={j}
                          onClick={() => this.props.onChecked(i * 3 + j)}
                          isMyTurn={this.props.isMyTurn}
                        >
                          {Board.renderSymbol(this.props.board[i * 3 + j])}
                        </Square>
                      ) : (
                        <InactiveSquare
                          key={i * 3 + j}
                          data-col={i}
                          data-row={j}
                        >
                          {Board.renderSymbol(this.props.board[i * 3 + j])}
                        </InactiveSquare>
                      );
                    })}
                  </Row>
                );
              })}
            </tbody>
          </Table>
        </BoardContainer>
      </div>
    );
  }
}

export default Board;
