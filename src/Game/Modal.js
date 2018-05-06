import React, {Component} from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import GameIcon from './GameIcon';


const CloseIconContainer = styled.div`
  float: right;
  margin-left: -20px;
  cursor: pointer;
`;



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
        {button}
        <Modal
          ariaHideApp={false}
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={this.props.customStyles}
          contentLabel={this.props.label}

        >
          <CloseIconContainer onClick={() => this.closeModal()}>
            <GameIcon icon={'close'} />
          </CloseIconContainer>
          {this.props.children}
        </Modal>
      </div>
    );
  }
}

export default GameModal;
