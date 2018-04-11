import React, {Component} from 'react';
import styled from 'styled-components';
import Context from './Context';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: url(loginback.jpg) no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
`;

const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 500px;
  width: 600px;
  padding: 1.5rem 2.5rem;
  margin-bottom: 10em;
  text-align: center;
`;

const LoginRow = styled.div`
  height: 5rem;
  padding-top: 1rem;
`;

const SubTitle = styled.p`
  font-size: 22px;
`;

class Login extends Component {
  render() {
    return (
      <Container>
        <FieldsContainer>
          <h1>Welcome User</h1>
          <SubTitle>Please login in order to play our TicTacToe</SubTitle>
          <LoginRow>
            <Context.Consumer>
              {account => <div>{account.ethAddress}</div>}
            </Context.Consumer>
            
          </LoginRow>
          <LoginRow>
            <input placeholder={'Username'} />
          </LoginRow>
          {/*<LoginRow>*/}
          {/*<input placeholder={'Password'} />*/}
          {/*</LoginRow>*/}

          <button>Login</button>
        </FieldsContainer>
      </Container>
    );
  }
}

export default Login;
