import GAME_STATUS from './GameStatus';

class StatusRender {
  static renderStatus(id) {
    switch (id) {
      case '0':
        return GAME_STATUS.NOT_EXISTING;
      case '1':
        return GAME_STATUS.EMPTY;
      case '2':
        return GAME_STATUS.WAITING_FOR_O;
      case '3':
        return GAME_STATUS.WAITING_FOR_X;
      case '4':
        return GAME_STATUS.READY;
      case '5':
        return GAME_STATUS.X_HAS_TURN;
      case '6':
        return GAME_STATUS.O_HAS_TURN;
      case '7':
        return GAME_STATUS.WINNER_X;
      case '8':
        return GAME_STATUS.WINNER_O;
      case '9':
        return GAME_STATUS.DRAW;
      default:
        return null;
    }
  }
}

export default StatusRender;
