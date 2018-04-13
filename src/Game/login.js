import React, {Component} from 'react';
import styled from 'styled-components';
import Context from './Context';
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

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 640px;
  padding: 1.5rem 2.5rem;
  text-align: center;
  margin-bottom: 5em;
`;

const LoginRow = styled.div`
  display: flex;
  height: 5rem;
  padding-top: 1rem;
  align-items: center;
  width: 100%;
`;

const SubTitle = styled.p`
  font-size: 22px;
  margin: 0 auto;
`;

const InputLabel = styled.label`
  font-weight: bold;
  font-size: 18px;
  width: 100%;
  display: flex;
  align-items: center;
`;

const InputField = styled.input`
  margin-left: auto;
`;

const ButtonLinkContainer = styled.div`
  margin-top: 20px;
  margin-right: -88px;
`;

const Provider = styled.img`
  width: 100px;
`;

const FieldsContainer = styled.div`
  width: 100%;
  margin-right: 88px;
`;

class Login extends Component {
  constructor(props) {
    super(props);
    localStorage.clear();
    this.state = {
      username: ''
    };
  }

  handleChange(e) {
    this.setState({username: e.target.value});
    localStorage.setItem('username', this.state.username);
  }

  render() {
    return (
      <Container>
        <LoginContainer>
          <Provider src="metamask.svg" />
          <h1>Tic Tac Toe</h1>
          <SubTitle>Please insert your username</SubTitle>
          <FieldsContainer>
            <LoginRow>
              <Context.Consumer>
                {account => (
                  <InputLabel>
                    Address
                    <InputField
                      style={{backgroundColor: 'gainsboro'}}
                      disabled
                      value={account.ethAddress}
                    />
                  </InputLabel>
                )}
              </Context.Consumer>
            </LoginRow>

            <LoginRow>
              <Context.Consumer>
                {account => (
                  <InputLabel>
                    {' '}
                    Balance (ETH)
                    <InputField
                      style={{backgroundColor: 'gainsboro'}}
                      disabled
                      value={account.ethBalance}
                    />
                  </InputLabel>
                )}
              </Context.Consumer>
            </LoginRow>

            <LoginRow>
              <InputLabel>
                Username
                <InputField
                  placeholder={'Username'}
                  onChange={this.handleChange.bind(this)}
                />
              </InputLabel>
            </LoginRow>
            <ButtonLinkContainer>
              <ButtonLink location={'lobby'}>Login</ButtonLink>
            </ButtonLinkContainer>
          </FieldsContainer>
        </LoginContainer>
      </Container>
    );
  }
}

export default Login;
