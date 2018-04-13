import React from 'react';

let ModelViewer = require('metamask-logo');

// To render with fixed dimensions:
let viewer = ModelViewer({

    // Dictates whether width & height are px or multiplied
    pxNotRatio: true,
    width: 500,
    height: 400,
    // pxNotRatio: false,
    // width: 0.9,
    // height: 0.9,

    // To make the face follow the mouse.
    followMouse: false,

    // head should slowly drift (overrides lookAt)
    slowDrift: false,

});

// add viewer to DOM
//let container = document.getElementById('logo-container');
let container = this.refs.Logo;
container.appendChild(viewer.container);

// look at something on the page
viewer.lookAt({
    x: 100,
    y: 100,
});

// enable mouse follow
viewer.setFollowMouse(true);

// deallocate nicely
viewer.stopAnimation();

const MetaMaskLogo = () => {
    return (<div ref="Logo">logo</div>);
};

export default MetaMaskLogo;