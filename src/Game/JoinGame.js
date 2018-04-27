import React, {Component} from 'react';
import styled from 'styled-components';
import ContractProps from './ContractProps';
import MetaMaskLogo from './MetamaskLogo';
import Spinner from './Spinner';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 4em;
`;

const GamesContainer = styled.div`
  width: 500px;
  border: 1px solid transparent;
  box-shadow: 0 0 15px 3px rgba(168, 221, 224, 0.5);
  border-radius: 3px;
  padding: 1em;
  max-height: 400px;
  overflow: scroll;
  background-image: radial-gradient(
    farthest-side at 212% 174px,
    #e2751b 0,
    #016999 1200px
  );
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const GameIcon = styled.svg`
  width: 35px;
  height: 35px;
  fill: #e4751b;
`;

const GameId = styled.p`
  font-size: 22px;
  font-weight: bold;
`;

const Table = styled.table`
  width: 100%;
  text-align: center;
`;
const Title = styled.p`
  font-size: 18px;
  font-weight: bold;
`;

const JoinParagraph = styled.p`
  margin-bottom: 0;
  margin-top: -12px;
  font-size: 16px;
  font-weight: bold;

  letter-spacing: 3px;
`;

const JoinGameButton = styled.div`
  &:hover {
    border: 2px solid #e4751b;
  }
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  box-shadow: 0 0 3px 3px rgba(168, 221, 224, 0.5);
  border-radius: 18px;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.2s ease-out;
`;

const ParentContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

class JoinGame extends Component {
  constructor() {
    super();
    this.state = {
      ids: [],
      loading: true
    };
  }
  componentDidMount() {
    this.getAvailableGames();
  }
  getAvailableGames() {
    this.props.contract.methods
      .getOpenGameIds()
      .call({from: this.props.account.ethAddress})
      .then(ids => {
        this.setState({ids: ids, loading: false});
      });
  }

  joinGame(id, playerName) {
    this.props.contract.methods
      .joinGame(id, playerName)
      .send({from: this.props.account.ethAddress})
      .on('transactionHash', tx => {
        console.log(tx);
      })
      .on('receipt', res => {
        console.log(res);
      })
      .on('confirmation', function(gameId) {
        console.log('new game joined ' + gameId);
      });
  }

  render() {
    return (
      <ParentContainer>
        <Container>
          <MetaMaskLogo />
          <h1>List of available Games</h1>
          <GamesContainer>
            {this.state.loading ? (
              <SpinnerContainer>
                <Spinner width={60} height={60} />
              </SpinnerContainer>
            ) : null}
            <Table>
              <tbody>
                <tr>
                  <th>
                    <Title>Game Id</Title>
                  </th>
                  <th>
                    <Title>Game name</Title>
                  </th>
                  <th />
                </tr>
              </tbody>
              <tbody>
                {this.state.ids.map(id => (
                  <tr key={id}>
                    <td>
                      <GameId>{id}</GameId>
                    </td>
                    <td>renderName</td>
                    <td style={{width: 150}}>
                      <JoinGameButton
                        onClick={() => {
                          this.joinGame(id, localStorage.getItem('username'));
                        }}
                      >
                        <GameIcon
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 640 512"
                        >
                          <path d="M480 96H160C71.6 96 0 167.6 0 256s71.6 160 160 160c44.8 0 85.2-18.4 114.2-48h91.5c29 29.6 69.5 48 114.2 48 88.4 0 160-71.6 160-160S568.4 96 480 96zM256 276c0 6.6-5.4 12-12 12h-52v52c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-52H76c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h52v-52c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h52c6.6 0 12 5.4 12 12v40zm184 68c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm80-80c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48z" />
                        </GameIcon>
                        <JoinParagraph>Join</JoinParagraph>
                      </JoinGameButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </GamesContainer>
        </Container>
      </ParentContainer>
    );
  }
}

export default JoinGame;
