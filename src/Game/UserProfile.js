import React, {Component} from 'react';
import styled from 'styled-components';

const UserProfileContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-left: 4em;
  margin-top: 2em;
`;

const Profile = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-right: 3em;
`;

const UserIcon = styled.svg`
  fill: #e4751b;
  width: 60px;
  height: 60px;
  border: 3px solid #e4751b;
  padding: 5px;
  border-radius: 50%;
`;

const UserName = styled.p`
  font-size: 18px;
  font-weight: bold;
  margin-top: 5px;
  margin-bottom: 0;
`;


class UserProfile extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <UserProfileContainer>
        <Profile>
          <UserIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M256 0c88.366 0 160 71.634 160 160s-71.634 160-160 160S96 248.366 96 160 167.634 0 256 0zm183.283 333.821l-71.313-17.828c-74.923 53.89-165.738 41.864-223.94 0l-71.313 17.828C29.981 344.505 0 382.903 0 426.955V464c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48v-37.045c0-44.052-29.981-82.45-72.717-93.134z" />
          </UserIcon>
          <UserName>{this.props.username}</UserName>
        </Profile>
      </UserProfileContainer>
    );
  }
}

export default UserProfile;
