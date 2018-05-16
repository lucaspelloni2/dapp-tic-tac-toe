import React, {Component} from 'react';
import styled from 'styled-components';
import Context from './Context';
import {Redirect} from 'react-router-dom';
import MetaMaskLogo from './MetamaskLogo';
import Header from './Header';


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

const FieldsContainer = styled.div`
  width: 100%;
  margin-right: 88px;
`;

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: ''
    };
  }

  handleChange(e) {
    this.setState({username: e.target.value, clickedLogin: false});
    localStorage.setItem('username', e.target.value);
  }

  insertNewUser(username, address) {
    let user = {
      address: address,
      username: username
    };
    let users = localStorage.getItem('users')
      ? JSON.parse(localStorage.getItem('users'))
      : [];
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
  }

  login() {
    if (localStorage.getItem('username')) {
      return <Redirect to="/lobby" />;
    }
    return (
      <div style={{background: 'red', marginBottom: 30}}>
        Please insert an username
      </div>
    );
  }

  render() {
    return (
      <div>
        <Header
          account={this.props.account}
          addresses={this.props.addresses}
          updateUserAccount={async selectedAddress => {
            this.props.updateUserAccount(selectedAddress);
          }}
        />
        <Container>
          <MetaMaskLogo />
          <LoginContainer>
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
                    onKeyPress={event => {
                      if (event.key === 'Enter') {
                        this.setState({
                          clickedLogin: true
                        });
                      }
                    }}
                  />
                </InputLabel>
              </LoginRow>
              <ButtonLinkContainer>
                {this.state.clickedLogin && this.login()}
                <button
                  onClick={() => {
                    //this.insertNewUser(e.target.value, this.props.account.ethAddress);
                    this.setState({
                      clickedLogin: true
                    });
                  }}
                >
                  Login
                </button>
              </ButtonLinkContainer>
            </FieldsContainer>
          </LoginContainer>
        </Container>
      </div>
    );
  }
}

export default Login;
