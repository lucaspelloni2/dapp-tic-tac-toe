const MAX_GAS = 46607271;
const GAS = {


  //with optimization
  CREATE_GAME:    MAX_GAS,
  JOIN_GAME:      MAX_GAS,
  LEAVE_GAME:     MAX_GAS,
  START_GAME:     MAX_GAS,
  PLAY_MOVE:      MAX_GAS,
  CREATE_BET:     MAX_GAS,
  JOIN_BET:       45358,
  WITHDRAW_BET:   MAX_GAS


/*
  // without optimization
  CREATE_GAME:    210807,
  JOIN_GAME:      66765,
  LEAVE_GAME:     48517,
  START_GAME:     30830,
  PLAY_MOVE:      this.MAX_GAS,
  CREATE_BET:     165350,
  JOIN_BET:       45844,
  WITHDRAW_BET:   this.MAX_GAS
  */
};

export default GAS;
