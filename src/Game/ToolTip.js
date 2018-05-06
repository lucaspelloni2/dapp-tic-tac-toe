import React from 'react';
import Tooltip from 'rc-tooltip';

const GameTooltip = props => {
    const {placement = 'bottomRight', children, content, visible,...otherProps} = props;
    return (
        <Tooltip
            overlay={content}
            placement={placement}
            destroyTooltipOnHide
            mouseLeaveDelay={0}
            defaultVisible={visible}
            visible={visible}
            {...otherProps}
        >
            {children}
        </Tooltip>
    );
};

export default GameTooltip;