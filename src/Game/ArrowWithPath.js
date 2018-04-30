import React from 'react';
import styled from 'styled-components';
import {Route} from 'react-router-dom';

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 200px;
  align-items: center;
  cursor: pointer;
`;

const Arrow = styled.svg`
  &:hover {
    width: 65px;
    height: 65px;
  }
  width: 60px;
  height: 60px;
  fill: #e4751b;
  transition: all 0.2s ease-out;
`;

const Decoration = styled.div`
  margin-top: 10px;
  border: 1px solid #e4741b;
  border-radius: 4px;
  padding: 4px;
  background-image: radial-gradient(
    farthest-side at 212% 174px,
    #e4741b 0,
    #0175a4 1200px
  );



`;

const ArrowWithPath = props => {
  return (
    <div>
      <Route
        render={({history}) => (
          <Container
            onClick={() => {
              history.push(props.location.toString());
            }}
          >
            <Arrow xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M256 504C119 504 8 393 8 256S119 8 256 8s248 111 248 248-111 248-248 248zm116-292H256v-70.9c0-10.7-13-16.1-20.5-8.5L121.2 247.5c-4.7 4.7-4.7 12.2 0 16.9l114.3 114.9c7.6 7.6 20.5 2.2 20.5-8.5V300h116c6.6 0 12-5.4 12-12v-64c0-6.6-5.4-12-12-12z" />
            </Arrow>
            <Decoration>{props.children}</Decoration>
          </Container>
        )}
      />
    </div>
  );
};

export default ArrowWithPath;
