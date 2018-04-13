import React from 'react';
import {Route} from 'react-router-dom';
import styled from 'styled-components';

const ButtonLink = (props) => (
    <Route
        render={({history}) => (
            <button
                onClick={() => {
                    history.push('/' + props.location.toString());
                }}
            >
                {props.children}
            </button>
        )}
    />
);

export default ButtonLink;

