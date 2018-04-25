import React from 'react';
import {Route} from 'react-router-dom';
import styled from 'styled-components';
import ButtonLink from './Link';
import MetaMaskLogo from './MetamaskLogo';

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
      {/*<img src="metamask.svg" width={180} style={{marginBottom: '3em'}} />*/}
      <MetaMaskLogo />
      <ButtonLink location={'login'}>Get started</ButtonLink>
        <p style={{marginBottom: 0, marginTop: '5em', fontSize: 18, fontWeight: 'bold'}}>Developed by: </p>
        <p style={{marginTop: 5, marginBottom: 0}}>Lucas Pelloni </p>
        <p style={{marginTop: 5, marginBottom: 0}}>Severin Wullschleger</p>
        <p style={{marginTop: 5, marginBottom: 0}}>Andreas Schafehlbuhl</p>
    </Container>
  );
};

export default WelcomePage;