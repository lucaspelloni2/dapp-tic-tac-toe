import GAME_STATUS from './GameStatus';
import BET_STATUS from './BetStatus';

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

  static renderBetStatus(id) {
    switch (id) {
      case '0':
        return BET_STATUS.NOT_EXISTING;
      case '1':
        return BET_STATUS.MISSING_X_BETTOR;
      case '2':
        return BET_STATUS.MISSING_O_BETTOR;
      case '3':
        return BET_STATUS.WITHDRAWN;
      case '4':
        return BET_STATUS.FIXED;
      case '5':
        return BET_STATUS.PAYEDOUT;
      default:
        return null;
    }
  }
}
export default StatusRender;
