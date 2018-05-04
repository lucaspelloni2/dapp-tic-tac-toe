import React, {Component} from 'react';
import styled from 'styled-components';

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
  max-height: 300px;
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

const StatusContainer = styled.div`
  border: 1px solid #02b8d4;
  border-radius: 4px;
  padding: 4px;
  background-image: radial-gradient(
    farthest-side at 212% 174px,
    #0177a2 0,
    #02b8d4 1200px
  );
`;

class Bets extends Component {
  constructor() {
    super();
  }

  render() {
    return (
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
              <tr>
                <td>adf</td>
                <td>adf</td>
                <td>adf</td>
                <td>asf</td>
                <td>
                  <StatusContainer>status</StatusContainer>
                </td>
                <td>icon</td>
              </tr>
            </tbody>
          </Table>
        </Container>
      </BetsContainer>
    );
  }
}

export default Bets;
