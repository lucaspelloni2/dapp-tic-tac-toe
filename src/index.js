import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import DEV from './Environment';
import {Web3Provider} from 'react-web3';

ReactDOM.render(
  !DEV ? (
    <Web3Provider>
      <App />
    </Web3Provider>
  ) : (
    <App />
  ),
  document.getElementById('root')
);
