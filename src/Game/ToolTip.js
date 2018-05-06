import React from 'react';
import Tooltip from 'rc-tooltip';

const GameTooltip = props => {
    const {placement = 'bottomRight', children, content, ...otherProps} = props;
    return (
        <Tooltip
            overlay={content}
            placement={placement}
            destroyTooltipOnHide
            mouseLeaveDelay={0}
            {...otherProps}
        >
            {children}
        </Tooltip>
    );
};

export default GameTooltip;