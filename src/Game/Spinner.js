import React, {Component} from 'react';
import styled from 'styled-components';

const Loader = styled.div`
  border: 16px solid #f3f3f3;
  border-radius: 50%;
  border-top: 16px solid #e4751b;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
`;

const Spinner = props => {
  return <Loader width={props.width} height={props.height} />;
};

export default Spinner;
