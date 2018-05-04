import React, {Component} from 'react';
import styled from 'styled-components';
import TicTacToeSymbols from './TicTacToeSymbols';

const BoardContainer = styled.div`
  width: 400px;
  height: 400px;
  margin-top: 4em;
  box-shadow: rgba(43, 9, 9, 0.4) 0px 0px 15px 3px;

  background-image: radial-gradient(
    farthest-side at 212% 285px,
    #0eef49 0,
    #03b8d4 1200px
  );
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

const Square = styled.td`
  padding: 8px;
  border-right: 5px solid #0186ae;
  &:last-child {
    border-right: 0;
  }
`;

class Board extends Component {
  constructor() {
    super();
  }

  renderSymbol(symbol) {
    switch (symbol) {
      case '0':
        return '';
      case '1':
        return <TicTacToeSymbols width={70} heigth={70} symbol={'X'} />;
      case '2':
        return <TicTacToeSymbols width={70} heigth={70} symbol={'O'} />;
    }
  }

  render() {
    console.log(this.props.board);
    return (
      <div>
        <BoardContainer>
          <Table>
            <tbody>
              {new Array(3).fill(true).map((a, i) => {
                return (
                  <Row key={i}>
                    {new Array(3).fill(true).map((b, j) => {
                      return (
                        <Square
                          key={i * 3 + j}
                          data-col={i}
                          data-row={j}
                          onClick={() => this.props.onChecked(i * 3 + j)}
                        >
                          {this.renderSymbol(this.props.board[i * 3 + j])}
                        </Square>
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
