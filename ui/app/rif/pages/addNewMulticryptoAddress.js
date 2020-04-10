import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import rifActions from '../../rif/actions'

class AddNewMulticryptoAddressScreen extends Component {
	state = {
		selectValues: []
	}

	navigateTo (url) {
		global.platform.openWindow({ url })
	}

  render () {
	return (
	  <div className={'body'}>
		<FontAwesomeIcon icon={faChevronLeft} className={'rif-back-button'} onClick={() => this.props.goHome()}/>
	  </div>
	)
  }
}

AddNewMulticryptoAddressScreen.propTypes = {
	goBack: PropTypes.func.isRequired,

}

function mapStateToProps (state) {
  return {
	  dispatch: state.dispatch,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		goBack: () => dispatch(rifActions.showDomainsPage()),
	}
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(AddNewMulticryptoAddressScreen)