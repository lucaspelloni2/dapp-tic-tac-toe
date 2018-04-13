import React, {Component, createContext} from 'react';

const myAccount = {
  ethAddress: '',
  ethBalance: 0
};

export default React.createContext(myAccount);
