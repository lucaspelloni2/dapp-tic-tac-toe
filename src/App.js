import React, { Component } from 'react';
import styled from 'styled-components';
import Login from "./Game/login";
import './App.css';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

class App extends Component {
  render() {
    return (
        <Container>
            <Login/>
        </Container>
    );
  }
}

export default App;
