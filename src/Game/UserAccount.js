import React, {Component} from 'react';
import styled from 'styled-components';
import GameIcon from './GameIcon';
import GameTooltip from './ToolTip';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: 0.2s ease-in-out;
  position: relative;
`;

const Overlay = styled.div`
  position: absolute;
  margin-top: 7.5em;
  width: 490px;
  height: 140px;
  transition: 0.2s ease-in-out;
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 0 11px 0 rgba(0, 0, 0, 0.21);
  z-index: 10;
  padding: 10px 16px;
  line-height: 20px;
  font-size: 14px;

  word-break: break-all;
  border-radius: 8px;
`;

const UserInfo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Tag = styled.div`
  border: 1px solid ${props => (props.border ? props.border : props.color)};
  border-radius: 4px;
  padding: 4px;
  color: white;
  background-image: radial-gradient(
    farthest-side at 212% 174px,
    ${props => props.seccolor} 0,
    ${props => props.color} 1200px
  );
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 5px 0;
`;

const Data = styled.div`
  display: flex;
  align-items: center;
  color: #577083;
  font-weight: bold;
`;

class UserAccount extends Component {
  constructor() {
    super();
    this.state = {
      showMenu: false
    };
  }

  renderOverlay() {
    return (
      <UserInfo>
        <Info>
          <Tag seccolor={'#0177a2'} color={'#02b8d4'}>
            ETH Address
          </Tag>
          <div style={{width: 10}} />
          <Data>{this.props.account.ethAddress}</Data>
        </Info>
        <Info>
          <Tag seccolor={'#f6841b'} border={'#f6841b'} color={'#ff6205'}>
            ETH Balance
          </Tag>
          <div style={{width: 10}} />
          <Data>{this.props.account.ethBalance}</Data>
        </Info>
        <Info>
          <Tag seccolor={'#03b8d4'} color={'#03b8d4'}>
            Username
          </Tag>
          <div style={{width: 25}} />
          <Data>{localStorage.getItem('username')}</Data>
        </Info>
      </UserInfo>
    );
  }

  render() {
    return (
      <div>
        <Container
          onMouseEnter={() => {
            this.setState({showMenu: true});
          }}
          onMouseLeave={() => {
            this.setState({showMenu: false});
          }}
        >
          <GameIcon icon={'user'} />
          {this.state.showMenu ? (
            <Overlay>{this.renderOverlay()}</Overlay>
          ) : null}
        </Container>
        {/*<EthAddress>{this.props.account.ethAddress.substr(0, 5)}</EthAddress>*/}
      </div>
    );
  }
}

export default UserAccount;
