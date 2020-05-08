import React, {Component} from 'react';
import {connect} from 'react-redux';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import rifActions from '../../actions';

class CustomModal extends Component {

  static propTypes = {
    message: PropTypes.object,
    opened: PropTypes.bool,
    dispatch: PropTypes.func,
  }

  afterOpenModal () {
    // references are now sync'd and can be accessed.
  }

  closeModal () {
    this.props.dispatch(rifActions.hideModal());
  }

  async cancel () {
    if (this.props.message.cancelCallback) {
      this.props.message.cancelCallback();
      if (this.props.message.closeAfterCancelCallback) {
        this.closeModal();
      }
    } else {
      this.closeModal();
    }
  }

  async confirm () {
    if (this.props.message.validateConfirm) {
      if (!await this.props.message.validateConfirm()) {
        return;
      }
    }
    if (this.props.message.confirmCallback) {
      this.props.message.confirmCallback();
      if (this.props.message.closeAfterConfirmCallback) {
        this.closeModal();
      }
    } else {
      this.closeModal();
    }
  }

  getButtons () {
    let cancelButton = (<button className={this.props.message.cancelButtonClass ? this.props.message.cancelButtonClass : ''}
                                onClick={this.cancel.bind(this)}>{this.props.message.cancelLabel}</button>);
    let confirmButton = (<button className={this.props.message.confirmButtonClass ? this.props.message.confirmButtonClass : ''}
                                 onClick={this.confirm.bind(this)}>{this.props.message.confirmLabel}</button>);
    if (this.props.message.hideCancel) {
      cancelButton = null;
    }
    if (this.props.message.hideConfirm) {
      confirmButton = null;
    }
    return {
      cancelButton,
      confirmButton,
    }
  }

  render () {
    const buttons = this.getButtons();
    let body = null;
    if (this.props.message.body.text) {
      body = (<p>{this.props.message.body.text}</p>);
    } else if (this.props.message.body.elements) {
      body = [];
      this.props.message.body.elements.map((element, index) => {
        body.push(<div key={index}>{element}</div>);
      });
    }
    return (
      <Modal
        isOpen={true}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={this.closeModal}
        className="modal">
        <div className="modal-message">
          <h1>{this.props.message.title}</h1>
          <div className="modal-body">
            {body}
          </div>
          <div className="modal-buttons">
            {buttons.cancelButton}
            {buttons.confirmButton}
          </div>
        </div>
      </Modal>
    )
  }
}
function mapStateToProps (state) {
  return {
    dispatch: state.dispatch,
  }
}
module.exports = connect(mapStateToProps)(CustomModal)
