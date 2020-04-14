import React, {Component} from 'react'
import {connect} from 'react-redux'
import Modal from 'react-modal'
import PropTypes from 'prop-types'
import rifActions from '../../actions'

class ConfirmationMessage extends Component {

  static propTypes = {
    message: PropTypes.object,
    opened: PropTypes.bool,
    dispatch: PropTypes.func,
  }

  afterOpenModal () {
    // references are now sync'd and can be accessed.
  }

  closeModal () {
    this.props.dispatch(rifActions.hideConfirmationMessage())
  }

  cancel () {
    this.props.message.cancelCallback()
    this.closeModal()
  }

  confirm () {
    this.props.message.confirmCallback()
    this.closeModal()
  }

  render () {
    return (
      <Modal
        isOpen={true}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={this.closeModal}
        className="confirmation-modal">
        <div className="confirmation-message">
          <h1>{this.props.message.title}</h1>
          <p>{this.props.message.body}</p>
          <div className="confirmation-buttons">
            <button onClick={this.cancel.bind(this)}>{this.props.message.cancelLabel}</button>
            <button onClick={this.confirm.bind(this)}>{this.props.message.confirmLabel}</button>
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
module.exports = connect(mapStateToProps)(ConfirmationMessage)
