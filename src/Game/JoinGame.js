import React, {Component} from 'react';
import styled from 'styled-components';
import MetaMaskLogo from './MetamaskLogo';
import Spinner from './Spinner';
import MyTransactions from './MyTransactions';
import Transaction from './Transaction';
import Status from './Status';
import ArrowWithPath from './ArrowWithPath';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const GamesContainer = styled.div`
  width: 700px;
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
  margin-right: -2em;
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
  margin-left: 2em;
`;

const ParentContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`;

const StatusContainer = styled.div`
  border: 1px solid ${props => props.color};
  border-radius: 4px;
  padding: 4px;
  background-image: radial-gradient(
    farthest-side at 212% 174px,
    #0177a2 0,
    ${props => props.color} 1200px
  );
`;

const JStatusContainer = styled.div`
  border: 1px solid #02b8d4;
  border-radius: 4px;
  padding: 4px;
  background-image: radial-gradient(
    farthest-side at 212% 174px,
    #0177a2 0,
    #02b8d4 1200px
  );
`;

class JoinGame extends Component {
  constructor() {
    super();

    //   NOT_EXISTING 0, EMPTY 1, WAITING_FOR_O 2, WAITING_FOR_X 3, READY, X_HAS_TURN, O_HAS_TURN, WINNER_X, WINNER_O, DRAW
    this.state = {
      games: [],
      loading: true
    };
  }
  componentDidMount() {
    this.getAvailableGames();
  }
  getAvailableGames() {
    let games = this.state.games;
    this.props.contract.methods
      .getGames()
      .call({from: this.props.account.ethAddress})
      .then(res => {
        for (let i = 0; i < res.gameIds.length; i++) {
          let status = res.gameStates[i];
          if (
            status === '1' ||
            status === '2' ||
            status === '3' ||
            status === '4'
          ) {
            let game = {
              id: res.gameIds[i],
              status: JoinGame.renderStatus(status),
              name: this.hexToAscii(res.gameNames[i]),
              owner: res.owners[i],
              ownerName: this.hexToAscii(res.ownerNames[i]),
              joiningStatus: JOINING_STATE.NOT_JOINING
            };
            games.push(game);
          }
        }
        this.setState({games: games, loading: false});
      })
      .catch(err => {
        console.log('error getting games ' + err);
      });
  }

  static renderStatus(id) {
    let status = '';
    switch (id) {
      case '0':
        status = GAME_STATUS.NOT_EXISTING;
        break;
      case '1':
        status = GAME_STATUS.EMPTY;
        break;
      case '2':
        status = GAME_STATUS.WAITING_FOR_O;
        break;
      case '3':
        status = GAME_STATUS.WAITING_FOR_X;
        break;
      case '4':
        status = GAME_STATUS.READY;
        break;
      case '5':
        status = GAME_STATUS.X_HAS_TURN;
        break;
      case '6':
        status = GAME_STATUS.O_HAS_TURN;
        break;
      case '7':
        status = GAME_STATUS.WINNER_X;
        break;
      case '8':
        status = GAME_STATUS.WINNER_O;
        break;
      case '9':
        status = GAME_STATUS.DRAW;
        break;
    }
    return status;
  }

  hexToAscii(byte32) {
    return this.props.web3.utils.hexToAscii(byte32).replace(/\u0000/g, '');
  }

  joinGame(game, playerName) {
    this.props.contract.methods
      .joinGame(game.id, this.props.web3.utils.fromAscii(playerName))
      .send({from: this.props.account.ethAddress})
      .on('transactionHash', tx => {
        this.addNewTx(tx, game.id);
        this.state.games.forEach(g => {
          if (game.id === g.id) {
            g.joiningStatus = JOINING_STATE.JOINING;
            console.log(game);
          }
        });
        this.setState({games: this.state.games});
      })
      .on('receipt', res => {
        console.log(res);
        const returnValues = res.events.Joined.returnValues;
        if (res.status === '0x1') {
          console.log(
            this.props.web3.utils.toAscii(returnValues.playerName) +
              ' joined game ' +
              returnValues.gameId +
              ' and has symbol ' +
              returnValues.symbol
          );
          this.state.games.forEach(g => {
            if (game.id === g.id) {
              g.joiningStatus = JOINING_STATE.JOINED;
            }
            this.setState({games: this.state.games});
          });
        } else {
          console.log('not possible to join');
        }
      })
      .on('confirmation', function(confirmationNr) {
        // is returned for the first 24 block confirmations
        //console.log('new game joined ' + confirmationNr);
      });
  }

  getJoiningStatus(game, joiningState) {
    switch (joiningState) {
      case JOINING_STATE.NOT_JOINING:
        return (
          <JoinGameButton
            onClick={() => {
              this.joinGame(game, localStorage.getItem('username'));
            }}
          >
            <GameIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
              <path d="M480 96H160C71.6 96 0 167.6 0 256s71.6 160 160 160c44.8 0 85.2-18.4 114.2-48h91.5c29 29.6 69.5 48 114.2 48 88.4 0 160-71.6 160-160S568.4 96 480 96zM256 276c0 6.6-5.4 12-12 12h-52v52c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-52H76c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h52v-52c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h52c6.6 0 12 5.4 12 12v40zm184 68c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm80-80c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48z" />
            </GameIcon>
            <JoinParagraph>Join</JoinParagraph>
          </JoinGameButton>
        );
      case JOINING_STATE.JOINING:
        return (
          <SpinnerContainer>
            <Spinner width={30} height={30} />
          </SpinnerContainer>
        );
      case JOINING_STATE.JOINED:
        return <JStatusContainer>READY</JStatusContainer>;
    }
  }

  getGameStatus(status) {
    switch (status) {
      case GAME_STATUS.READY:
        return <StatusContainer color={'#00ff31'}>{status}</StatusContainer>;
      case GAME_STATUS.WAITING_FOR_O:
        return <StatusContainer color={'#02b8d4'}>{status}</StatusContainer>;
      case GAME_STATUS.WAITING_FOR_X:
        return <StatusContainer color={'#02b8d4'}>{status}</StatusContainer>;
      default:
        return <StatusContainer color={'#02b8d4'}>default</StatusContainer>;
    }
  }

  addNewTx(tx, gameId) {
    let transaction = new Transaction({
      tx: tx,
      confirmed: false,
      gameName: gameId,
      blockNumber: null,
      status: Status.GAME_JOINED
    });
    let transactions = JSON.parse(localStorage.getItem('txs'));
    transactions.push(transaction);
    localStorage.setItem('txs', JSON.stringify(transactions));
  }

  render() {
    return (
      <div>
        <MetaMaskLogo />
        <ParentContainer>
          <Container>
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
                    <th>
                      <Title>Owner</Title>
                    </th>
                    <th>
                      <Title>Status</Title>
                    </th>
                    <th />
                  </tr>
                </tbody>
                <tbody>
                  {this.state.games.map(game => (
                    <tr key={game.id}>
                      <td>
                        <GameId>{game.id}</GameId>
                      </td>
                      <td>{game.name}</td>
                      <td>
                        <a
                          style={{marginRight: 10}}
                          href={
                            'https://ropsten.etherscan.io/address/' + game.owner
                          }
                          target="_blank"
                        >
                          {game.ownerName}
                        </a>
                      </td>
                      <td>{this.getGameStatus(game.status)}</td>
                      <td style={{width: 120}}>
                        {this.getJoiningStatus(game, game.joiningStatus)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </GamesContainer>
          </Container>
          <MyTransactions marginTop={5} web3={this.props.web3} />
        </ParentContainer>

        <ArrowWithPath
          top={50}
          location={'/games/' + this.props.account.ethAddress}
        >
          Create a game!
        </ArrowWithPath>
      </div>
    );
  }
}

const JOINING_STATE = {
  NOT_JOINING: 'NOT_JOINING',
  JOINING: 'JOINING',
  JOINED: 'JOINED'
};

const GAME_STATUS = {
  NOT_EXISTING: 'NOT_EXISTING',
  EMPTY: 'EMPTY',
  WAITING_FOR_O: 'WAITING_FOR_O',
  WAITING_FOR_X: 'WAITING_FOR_X',
  READY: 'READY',
  X_HAS_TURN: 'X_HAS_TURN',
  O_HAS_TURN: 'O_HAS_TURN',
  WINNER_X: 'WINNER_X',
  WINNER_O: 'WINNER_O',
  DRAW: 'DRAW'
};
export default JoinGame;
