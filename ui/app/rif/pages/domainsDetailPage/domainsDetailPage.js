import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import DomainsDetailActiveScreen from './domainDetailActive/domainDetailActive';
import DomainExpiring from './domainExpiring/domainExpiring';
import DomainExpired from './domainExpired/domainExpired';

class DomainsDetailScreen extends Component {
	static propTypes = {
		status: PropTypes.string.isRequired,
	}
	render () {
		const { status } = this.props
		return (
		<div className={'body'}>
			{status === 'active' &&
				<DomainsDetailActiveScreen />
			}
      {status === 'expiring' &&
        <DomainExpiring />
      }
      {status === 'expired' &&
        <DomainExpired />
      }
			{['active', 'expiring', 'expired'].indexOf(status) === -1 &&
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
		status: state.appState.currentView.params.status,
	}
}

const mapDispatchToProps = dispatch => {
	return {}
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(DomainsDetailScreen)
