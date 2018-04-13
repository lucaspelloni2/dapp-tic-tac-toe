import React from 'react';
import {Route} from 'react-router-dom';
import styled from 'styled-components';
import ButtonLink from './Link';

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

const WelcomePage = () => {
  return (
    <Container>
      <img src="metamask.svg" width={180} style={{marginBottom: '3em'}} />
      <ButtonLink location={'login'}>Get started</ButtonLink>
    </Container>
  );
};

export default WelcomePage;
