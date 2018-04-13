import React from 'react';
import {Route} from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: url(back.jpg) no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  color: white;
`;

const Button = () => (
  <Route
    render={({history}) => (
      <button
        type="button"
        onClick={() => {
          history.push('/new-location');
        }}
      >
        Click Me!
      </button>
    )}
  />
);

const WelcomePage = () => {
  return (
    <Container>
      <img src="metamask.svg" width={180} />
      <Route
        render={({history}) => (
          <button
            type="button"
            style={{marginTop: '2em'}}
            onClick={() => {
              history.push('/login');
            }}
          >
            Get Started
          </button>
        )}
      />
    </Container>
  );
};

export default WelcomePage;
