import React, {Component} from 'react';
import styled from 'styled-components';
import MetaMaskLogo from './MetamaskLogo';
import GameIcon from './GameIcon';

const HeaderContainer = styled.div`
  z-index: 1;
  width: 100%;
  height: 60px;
  background: white;
  display: flex;
  align-items: center;
  color: black; 
`;

const BorderBottom = styled.div`
  background: linear-gradient(90deg, rgb(0, 74, 153), rgb(1, 178, 208));
  height: 3px;
  width: 100%;
`;

const BorderTop = BorderBottom.extend`
  background: linear-gradient(90deg, rgb(1, 178, 208), rgb(0, 74, 153));
`;

const Left = styled.div``;
const Right = styled.div`
  margin-left: auto;
`;

class Header extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <BorderTop />
        <HeaderContainer>
          <Left>
            <GameIcon
              color={'#016b9b'}
              width={45}
              height={45}
              marginBottom={0}
              icon={'bet'}
            />
          </Left>
          <Right></Right>
        </HeaderContainer>
        <BorderBottom />
      </div>
    );
  }
}

export default Header;
