import React, {Component} from 'react';
import styled from 'styled-components';
import GameIcon from './GameIcon';

const BetsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  padding: 15px;
  text-align: center;
  width: 600px;
  box-shadow: rgba(168, 221, 224, 0.5) 0px 0px 15px 3px;
  max-height: 221px;
  overflow: scroll;
  background-image: radial-gradient(
    farthest-side at 212% 174px,
    #0177a2 0,
    #01497c 1200px
  );
`;

const Table = styled.table`
  width: 100%;
  text-align: center;
`;

const Title = styled.p`
  font-size: 18px;
  font-weight: bold;
`;

const Element = styled.div`
  border: 1px solid ${props => props.border};
  border-radius: 4px;
  padding: 4px;
  background-image: radial-gradient(
    farthest-side at 212% 174px,
    #0177a2 0,
    ${props => props.color} 1200px
  );
`;

const ValueContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 50px;
`;

const Value = styled.span`
  font-weight: bold;
  font-size: 16px;
  margin-left: 5px;
`;

class Bets extends Component {
  constructor() {
    super();
    this.state = {
      bets: [],
      loading: false
    };
  }

  async componentDidMount() {
    await this.getBets();
    this.interval = setInterval(async () => {
      await this.getBets();
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  async getBets() {
    let bets = [];
    return this.props.contract.methods
      .getBets()
      .call({from: this.props.account.ethAddress})
      .then(res => {
        for (let i = 0; i < res.betIds.length; i++) {
          let bet = this.getBet(res, i);
          if (bet !== null) {
            bets.push(bet);
          }
        }
        this.setState({bets: bets});
      })
      .catch(err => {
        console.log('error getting bets ' + err);
      });
  }

  getBet(res, i) {
    // TODO: convert the returned values in ETH (now are in WEI)
    return {
      id: res.betIds[i],
      gameId: res.gameIds[i],
      state: res.betStates[i],
      bettorOnO: this.hexToAscii(res.bettorOnO[i]),
      bettorOnX: this.hexToAscii(res.bettorOnX[i]),
      value: res.values[i] //this.props.web3.fromWei(res.values[i].toString(), 'ether')
    };
  }

  hexToAscii(byte32) {
    return this.props.web3.utils.hexToAscii(byte32).replace(/\u0000/g, '');
  }

  render() {
    return (
      <div>
        {this.state.loading ? (
          <div>loading..</div>
        ) : (
          <BetsContainer>
            <h1>All Bets</h1>
            <Container>
              <Table>
                <tbody>
                  <tr>
                    <th>
                      <Title>Bet Id</Title>
                    </th>
                    <th>
                      <Title>Game Id</Title>
                    </th>
                    <th>
                      <Title>Status</Title>
                    </th>
                    <th>
                      <Title>Value</Title>
                    </th>
                    <th>
                      <Title>Who Bets on X</Title>
                    </th>
                    <th>
                      <Title>Who Bets on O</Title>
                    </th>
                    <th />
                  </tr>
                </tbody>
                <tbody>
                  {this.state.bets.map(bet => (
                    <tr key={bet.id}>
                      <td>{bet.id}</td>
                      <td>{bet.gameId}</td>
                      <td>{bet.state}</td>
                      <td>
                        <Element color={'#024169'} border={'#02b8d4'}>
                          <ValueContainer>
                            <Value>{bet.value}</Value>
                            <GameIcon
                              icon={'bet'}
                              marginLeft={'auto'}
                              marginRight={'5px'}
                              height={'20'}
                            />
                          </ValueContainer>
                        </Element>
                      </td>
                      <td>{bet.bettorOnX}</td>
                      <td>{bet.bettorOnO}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Container>
          </BetsContainer>
        )}
      </div>
    );
  }
}

export default Bets;
