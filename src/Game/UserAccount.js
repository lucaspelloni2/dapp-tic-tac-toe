import React, {Component} from 'react';
import styled from 'styled-components';
import GameIcon from './GameIcon';
import DEV from '../Environment';

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
  margin-top: 9em;
  width: 515px;
  transition: 0.2s ease-in-out;
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 0 11px 0 rgba(0, 0, 0, 0.21);
  z-index: 10;
  padding: 10px 16px;
  line-height: 20px;
  font-size: 14px;
  word-break: break-all;
  border-radius: 8px;

  right: ${DEV ? null : '-50%'};
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
  width: 125px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  margin-left: 8px;
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
          <Tag seccolor={'#f6841b'} color={'#ff6205'}>
            ETH Address <GameIcon icon={'address'}/>
          </Tag>
          <Data>{this.props.account.ethAddress}</Data>
        </Info>
        <Info>
          <Tag seccolor={'#0177a2'} color={'#02b8d4'}>
            ETH Balance <GameIcon color={'white'} width={15} height={15} icon={'bet'} />
          </Tag>
          <Data>{this.props.account.ethBalance}</Data>
        </Info>
        <Info>
          <Tag seccolor={'#03b8d4'} color={'#03b8d4'}>
            Username <GameIcon icon={'username'}/>
          </Tag>
          <Data>{localStorage.getItem('username')}</Data>
        </Info>
        <Info>
          <Tag seccolor={'#a005ff'} color={'#a005ff'}>
            Web3 Provider  <GameIcon icon={'web3provider'}/>
          </Tag>
          <Data>{this.props.provider}</Data>
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
