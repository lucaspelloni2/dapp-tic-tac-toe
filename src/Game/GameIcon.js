import React from 'react';
import styled from 'styled-components';

const JoinIcon = styled.svg`
  width: 35px;
  height: 35px;
  fill: #e4751b;
`;

const PlayIcon = styled.svg`
  width: 22px;
  height: 35px;
  fill: #02ff31;
`;

const BetIcon = styled.svg`
  width: 15px;
  height: 35px;
  fill: #03b8d4;
  margin-bottom: 2px;
`;

const GameIcon = props => {
  switch (props.icon) {
    case 'join':
      return (
        <JoinIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
          <path d="M480 96H160C71.6 96 0 167.6 0 256s71.6 160 160 160c44.8 0 85.2-18.4 114.2-48h91.5c29 29.6 69.5 48 114.2 48 88.4 0 160-71.6 160-160S568.4 96 480 96zM256 276c0 6.6-5.4 12-12 12h-52v52c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-52H76c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h52v-52c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h52c6.6 0 12 5.4 12 12v40zm184 68c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm80-80c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48z" />
        </JoinIcon>
      );

    case 'play':
      return (
        <PlayIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path d="M371.7 238l-176-107c-15.8-8.8-35.7 2.5-35.7 21v208c0 18.4 19.8 29.8 35.7 21l176-101c16.4-9.1 16.4-32.8 0-42zM504 256C504 119 393 8 256 8S8 119 8 256s111 248 248 248 248-111 248-248zm-448 0c0-110.5 89.5-200 200-200s200 89.5 200 200-89.5 200-200 200S56 366.5 56 256z" />
        </PlayIcon>
      );

    case 'bet':
      return (
        <BetIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
          <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z" />
        </BetIcon>
      );

    default:
      return <div>default</div>;
  }
};

export default GameIcon;
