import React, { Component } from 'react';
import styled from 'styled-components';
import Login from "./Game/login";
import './App.css';
import Test from "./Game/test";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

class App extends Component {
  render() {
    return (
        <Container>
            {/*<Login/>*/}
            {/*<Lobby/>*/}
            <Test/>
        </Container>
    );
  }
}

export default App;
