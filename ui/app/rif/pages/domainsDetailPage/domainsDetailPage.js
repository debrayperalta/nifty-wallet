import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import DomainsDetailActiveScreen from './domainDetailActive/domainDetailActive'
import { SearchDomains } from '../../components'
import rifActions from '../../actions'

class DomainsDetailScreen extends Component {
	static propTypes = {
		status: PropTypes.string.isRequired,
		goBack: PropTypes.func.isRequired,
	}
	render () {
		const { status } = this.props
		return (
		<div className={'body'}>
			<FontAwesomeIcon icon={faChevronLeft} className={'rif-back-button'} onClick={() => this.props.goBack()}/>
			<SearchDomains />
			{status === 'active' && 
				<DomainsDetailActiveScreen />
			}
			{status !== 'active' && 
				<div>
					Domain detail page still in progress for this status!
				</div>
			}
		</div>
		)
	}
}

function mapStateToProps (state) {
  	return {
		dispatch: state.dispatch,
		status: state.appState.currentView.data.value.status,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		goBack: () => dispatch(rifActions.showDomainsPage()),
	}
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(DomainsDetailScreen)