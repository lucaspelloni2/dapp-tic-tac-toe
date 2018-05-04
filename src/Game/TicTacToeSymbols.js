import React from 'react';
import styled from 'styled-components';

const X = styled.svg`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  path {
    stroke: white;
    stroke-width: 16px;
  }
`;

const O = styled.svg`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  path {
    fill: none;
    stroke: white;
    stroke-width: 16px;
  }
`;

const TicTacToeSymbols = props => {
  switch (props.symbol) {
    case 'X':
      return (
        <X viewBox="0 0 128 128" {...props}>
          <path d="M16,16L112,112" />
          <path d="M112,16L16,112" />
        </X>
      );

    case 'O':
      return (
        <O viewBox="0 0 128 128" {...props}>
          <path d="M64,16A48,48 0 1,0 64,112A48,48 0 1,0 64,16" />
        </O>
      );

    default:
      return <div>default</div>;
  }
};

export default TicTacToeSymbols;
