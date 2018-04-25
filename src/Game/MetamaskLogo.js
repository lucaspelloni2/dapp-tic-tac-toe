import React, {Component} from 'react';
import styled from 'styled-components'

let ModelViewer = require('metamask-logo');

const Container = styled.div`

`;

// To render with fixed dimensions:
let viewer = ModelViewer({

    // Dictates whether width & height are px or multiplied
    pxNotRatio: true,
    width: 140,
    height: 140,
    // pxNotRatio: false,
    // width: 0.9,
    // height: 0.9,

    // To make the face follow the mouse.
    followMouse: true,

    // head should slowly drift (overrides lookAt)
    slowDrift: false,

});

// add viewer to DOM
viewer.container.style.display = "none";
// container.appendChild(viewer.container);
//
// ;
// look at something on the page
viewer.lookAt({
    x: 100,
    y: 100,
});


class MetaMaskLogo extends  Component{
    componentDidMount() {
        viewer.container.style.display = "block"
        this.container.appendChild(viewer.container);
    }

    componentWillUnmount() {
        // deallocate nicely
        viewer.stopAnimation();

    }

    shouldComponentUpdate() {
        return false;
    }
    render() {
        return (<Container innerRef={ref => {
            this.container = ref;
        }}/>);

    }
};

export default MetaMaskLogo;