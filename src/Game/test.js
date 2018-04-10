import React, {Component} from 'react';
import Web3 from 'web3';
let web3 = window.web3;



class Test extends Component {

    constructor() {
        super();
    }

    componentDidMount() {
        this.initWeb3();
    }

    initWeb3() {
        if (typeof web3 !== 'undefined') {
            this.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
            console.log("existing web3: provider " + web3.currentProvider);
        } else {

            this.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
            web3 = new Web3(this.web3Provider);
            console.log("new web3");
        }

        // this.displayAccountInfo();
        // this.initiateContract();
    }

    render() {
        return (<div>Test component</div>);
    }
}

export default Test;