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
  height: ${props => (props.height ? props.height : '35')}px;
  fill: #03b8d4;
  margin-bottom: 2px;
  margin-left: ${props => (props.marginLeft ? props.marginLeft : null)};
  margin-right: ${props => (props.marginRight ? props.marginRight : null)};
`;

const ConfirmedIcon = styled.svg`
  fill: #00ff31;
  width: 30px;
  height: 30px;
`;

const PlusIcon = styled.svg`
  width: 30px;
  height: 30px;
  fill: white;
  margin-top: 3px;
`;

const CloseIcon = styled.svg`
  width: 30px;
  height: 30px;
  fill: white;
`;

const PreviewIcon = styled.svg`
  width: 15px;
  height: 15px;
  fill: white;
  margin-left: 8px;
`;

const SortUp = styled.svg`
  width: 20px;
  height: 20px;
  fill: white;
  margin-top: 8px; 
`;

const SortDown = styled.svg`
  width: 20px;
  height: 20px;
  fill: white;
  margin-bottom: 5px; 
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
        <BetIcon
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 320 512"
          {...props}
        >
          <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z" />
        </BetIcon>
      );

    case 'confirmation':
      return (
        <ConfirmedIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z" />
        </ConfirmedIcon>
      );

    case 'add':
      return (
        <PlusIcon
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          {...props}
        >
          <path d="M448 294.2v-76.4c0-13.3-10.7-24-24-24H286.2V56c0-13.3-10.7-24-24-24h-76.4c-13.3 0-24 10.7-24 24v137.8H24c-13.3 0-24 10.7-24 24v76.4c0 13.3 10.7 24 24 24h137.8V456c0 13.3 10.7 24 24 24h76.4c13.3 0 24-10.7 24-24V318.2H424c13.3 0 24-10.7 24-24z" />
        </PlusIcon>
      );

    case 'close':
      return (
        <CloseIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path d="M464 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-83.6 290.5c4.8 4.8 4.8 12.6 0 17.4l-40.5 40.5c-4.8 4.8-12.6 4.8-17.4 0L256 313.3l-66.5 67.1c-4.8 4.8-12.6 4.8-17.4 0l-40.5-40.5c-4.8-4.8-4.8-12.6 0-17.4l67.1-66.5-67.1-66.5c-4.8-4.8-4.8-12.6 0-17.4l40.5-40.5c4.8-4.8 12.6-4.8 17.4 0l66.5 67.1 66.5-67.1c4.8-4.8 12.6-4.8 17.4 0l40.5 40.5c4.8 4.8 4.8 12.6 0 17.4L313.3 256l67.1 66.5z" />
        </CloseIcon>
      );

    case 'search':
      return (
        <PreviewIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" />
        </PreviewIcon>
      );

    case 'sortup':
      return (
        <SortUp xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
          <path d="M279 224H41c-21.4 0-32.1-25.9-17-41L143 64c9.4-9.4 24.6-9.4 33.9 0l119 119c15.2 15.1 4.5 41-16.9 41z" />
        </SortUp>
      );

    case 'sortdown':
      return (
        <SortDown xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
          <path d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41z" />
        </SortDown>
      );
    default:
      return <div>default</div>;
  }
};

export default GameIcon;
