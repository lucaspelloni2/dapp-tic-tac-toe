import React, {Component} from 'react';
import styled from 'styled-components';

const BoardContainer = styled.div`
  width: 400px;
  height: 400px;
  margin-top: 4em;
  box-shadow: rgba(168, 221, 224, 0.5) 0px 0px 15px 3px;
  //border: 1px solid #03b8d4;
`;

const Table = styled.table`
  border-spacing: 6px;
  text-align: center;
  width: 100%;
  height: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`;

const Row = styled.tr`
  border-top: 1px solid black;
  &:first-child {
    border-top: 0;
  }
`;

const Square = styled.td`
  border-right: 1px solid black;
  &:last-child {
    border-right: 0;
  }
`;

class Board extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <BoardContainer>
          <Table>
            <Row>
              <Square data-col="0" data-row="0">
                1asfasfasf
              </Square>
              <Square data-col="0" data-row="1">
                2
              </Square>
              <Square data-col="0" data-row="2">
                3
              </Square>
            </Row>
            <Row>
              <Square data-col="1" data-row="0">
                4
              </Square>
              <Square data-col="1" data-row="1">
                5
              </Square>
              <Square data-col="1" data-row="2">
                6
              </Square>
            </Row>
            <Row>
              <Square data-col="2" data-row="0">
                7
              </Square>
              <Square data-col="2" data-row="1">
                8
              </Square>
              <Square data-col="2" data-row="2">
                9
              </Square>
            </Row>
          </Table>
        </BoardContainer>
      </div>
    );
  }
}

export default Board;
