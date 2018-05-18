import React, {Component} from 'react';
import styled from 'styled-components';
import DEV from '../Environment';
import GameIcon from './GameIcon';
import Select from 'react-select';
import {Link} from 'react-router-dom';
import UserAccount from './UserAccount';
import {withRouter, observer} from 'react-router';
import PropTypes from 'prop-types';

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

const Left = styled.div`
  display: flex;
  align-items: center;
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
`;
const Right = styled.div`
  margin-left: auto;
`;

const DevEnv = styled.div`
  border: 1px solid ${props => (props.border ? props.border : props.color)};
  border-radius: 4px;
  padding: 4px;
  background: ${props => props.color};
  margin-left: 1em;
  color: white;
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 3em;
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Tab = styled.div`
  &:hover {
    color: #01a2ca;
    border-bottom-color: #01a2ca;
    font-size: 17.5px;
  }
  transition: 0.15s ease-in-out;
  font-size: 17px;
  color: #026899;
  cursor: pointer;
  padding: 0 20px;
  font-weight: bold;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const UserContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
`;

const GamesSearchContainer = styled.div`
  display: flex;
  padding: 0 10px;
  flex-direction: column;
`;

const SearchGame = styled.p`
  margin: 0;
  font-size: 10px;
  color: #026899;
`;

class Header extends Component {
  static contextTypes = {
    router: PropTypes.object
  };

  constructor(context) {
    super(context);
    this.state = {
      selectedAddress: null,
      selectedGame: null,
      currentPath: null
    };
  }

  componentDidMount() {
    if (this.props.account && DEV) {
      this.setState({selectedAddress: this.props.account.ethAddress});
    }
    this.setState({currentPath: this.props.location.pathname});
  }


  renderLeftContent() {
    return (
      <LeftContainer>
        <GameIcon
          color={'#016b9b'}
          width={45}
          height={45}
          marginBottom={0}
          icon={'bet'}
        />

        {DEV ? (
          <DevEnv color={'#d42517'} border={'#d42517'}>
            DEV ENVIRONMENT
          </DevEnv>
        ) : null}
      </LeftContainer>
    );
  }

  handleChange = selectedAddress => {
    this.setState({selectedAddress: selectedAddress});
    this.props.updateUserAccount(selectedAddress);
  };

  handleSearchGame = selectedGame => {
    this.setState({selectedGame: selectedGame});
    //this.props.history.push('/games/' + selectedGame.id);
    this.context.router.history.push('/games/' + selectedGame.id);
      window.location.reload(true);
  };

  renderRightContent() {
    if (this.props.addresses && DEV) {
      return (
        <RightContainer>
          <div>{this.renderTabs()}</div>
          {this.props.games ? <div>{this.renderGamesSearch()}</div> : null}
          <div>{this.renderUserAccount()}</div>
          <Select
            simpleValue
            style={{width: 220}}
            value={this.state.selectedAddress}
            onChange={this.handleChange}
            options={this.props.addresses.map(addr => ({
              label: addr,
              value: addr
            }))}
          />
        </RightContainer>
      );
    } else {
      return (
        <RightContainer>
          {this.props.account ? <div>{this.renderTabs()}</div> : null}
          {this.props.games ? <div>{this.renderGamesSearch()}</div> : null}
          {this.props.account ? <div>{this.renderUserAccount()}</div> : null}
        </RightContainer>
      );
    }
  }

  renderTabs() {
    return (
      <TabsContainer>
        <Tab>
          <Link style={{textDecoration: 'none'}} to="/games/create">
            Create a Game
          </Link>
        </Tab>
        <Tab>
          <Link style={{textDecoration: 'none'}} to="/lobby">
            Lobby
          </Link>
        </Tab>
        <Tab>
          <Link style={{textDecoration: 'none'}} to="/games">
            Join a Game
          </Link>
        </Tab>
      </TabsContainer>
    );
  }

  renderGamesSearch() {
    return (
      <GamesSearchContainer>
        <Select
          simpleValue
          style={{width: 140}}
          value={
            this.state.selectedGame
              ? {
                  label: this.state.selectedGame.name.replace(/\u0000/g, ''),
                  value: this.state.selectedGame
                }
              : this.props.games.lenght > 0
                ? {
                    label: this.props.games[0].name.replace(/\u0000/g, ''),
                    value: this.props.games[0]
                  }
                : null
          }
          onChange={this.handleSearchGame}
          options={this.props.games.map(game => ({
            label: game.name,
            value: game
          }))}
        />
        <SearchGame>Visit another game</SearchGame>
      </GamesSearchContainer>
    );
  }
  renderUserAccount() {
    return (
      <UserContainer>
        <UserAccount
          provider={this.props.provider}
          account={this.props.account}
        />
      </UserContainer>
    );
  }

  render() {
    return (
      <div>
        <BorderTop />
        <HeaderContainer>
          <Left>{this.renderLeftContent()}</Left>
          <Right>{this.renderRightContent()}</Right>
        </HeaderContainer>
        <BorderBottom />
      </div>
    );
  }
}

export default withRouter(Header);
