import React, {Component} from 'react';
import styled from 'styled-components';
import Context from './Context';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
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
  width: 600px;
  padding: 1.5rem 2.5rem;
  text-align: center;
`;

const LoginRow = styled.div`
  display: flex;
  height: 5rem;
  padding-top: 1rem;
  align-items: center;
  justify-content: space-around;
  width: 100%;
`;

const SubTitle = styled.p`
  font-size: 22px;
`;

const MySpan = styled.span`
  font-weight: bold;
  font-size: 18px;
  margin-right: auto;
  color: white; 
`;

class Login extends Component {
  render() {
    return (
      <Container>
        <FieldsContainer>
          <h1>Welcome User</h1>
          <SubTitle>Please insert your username</SubTitle>
          <LoginRow>
            <MySpan>Address</MySpan>
            <Context.Consumer>
              {account => (
                <input
                  style={{backgroundColor: 'gainsboro', width: 410}}
                  disabled
                  value={account.ethAddress}
                />
              )}
            </Context.Consumer>
          </LoginRow>

          <LoginRow>
            <MySpan>Balance</MySpan>
            <Context.Consumer>
              {account => (
                <input
                  style={{backgroundColor: 'gainsboro', width: 410}}
                  disabled
                  value={account.ethBalance}
                />
              )}
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
