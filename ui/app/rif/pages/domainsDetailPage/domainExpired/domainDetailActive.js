import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import rifActions from '../../../actions'
import DomainHeader from '../../../components/domain-header'

class DomainExpired extends Component {
	static propTypes = {
    domainName: PropTypes.string.isRequired,
	}

	render () {
    const { domainName } = this.props
		return (
		<div className={'body'}>
            <DomainHeader domainName={domainName} />
            <div id="domainDetailBody" className={'domain-detail-body'}>
              Hola
            </div>
        </div>
		)
	}
}

function mapStateToProps (state) {
  return {
		dispatch: state.dispatch,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		addNewNetwork: (message) => dispatch(rifActions.showModal(message)),
	}
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(DomainExpired)
