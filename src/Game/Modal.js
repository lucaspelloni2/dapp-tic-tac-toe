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
  render() {
    const button = React.cloneElement(this.props.button, {
      onClick: this.props.openModal.bind(this)
    });
    return (
      <div>
        {button}
        <Modal
          ariaHideApp={false}
          isOpen={this.props.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={this.props.customStyles}
          contentLabel={this.props.label}

        >
          <CloseIconContainer onClick={() => this.props.closeModal()}>
            <GameIcon icon={'close'} />
          </CloseIconContainer>
          {this.props.children}
        </Modal>
      </div>
    );
  }
}

export default GameModal;
