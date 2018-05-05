import React, {Component} from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';


const customStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    content: {
        position: 'absolute',
        width: '50%',
        height: '60%',
        border: '1px solid #ccc',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        borderRadius: '4px',
        outline: 'none',
        top: '10%',
        left: '25%',
        right: 0,
        bottom: '10%',
        padding: '2em',
        background: '#024169'
    }
};

class GameModal extends Component {
    constructor() {
        super();
        this.state = {
            modalIsOpen: false
        };
        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }
    openModal() {
        this.setState({modalIsOpen: true});
    }

    afterOpenModal() {
        // references are now sync'd and can be accessed.
        // this.subtitle.style.color = '#f00';
    }

    closeModal() {
        this.setState({modalIsOpen: false});
    }

    render() {
        const button = React.cloneElement(this.props.button, {
            onClick: this.openModal.bind(this)
        });
        return (
                <div>
                    {/*<Element style={{width: '160px'}} onClick={this.openModal}>*/}
                        {/*{this.props.buttonName}*/}
                    {/*</Element>*/}
                    {button}
                    <Modal
                        ariaHideApp={false}
                        isOpen={this.state.modalIsOpen}
                        onAfterOpen={this.afterOpenModal}
                        onRequestClose={this.closeModal}
                        style={customStyles}
                        contentLabel={this.props.label}
                        c
                    >
                        {this.props.children}
                    </Modal>
                </div>
        );
    }
}

export default GameModal;
