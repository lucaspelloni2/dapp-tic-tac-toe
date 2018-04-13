import React from 'react';
import {Route} from 'react-router-dom';

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

