import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import rifActions from '../../actions'
import {pageNames} from '../index'

function statusStyle (status) {
  switch (status) {
    case 'active':
      return 'chiplet-status-active'
    case 'pending':
      return 'chiplet-status-pending'
    case 'expired':
      return 'chiplet-status-expired'
    case 'expiring':
      return 'chiplet-status-expiring'
  }
}

class DomainsScreen extends Component {

  async componentDidMount () {
    if (!this.props.domains) {
      const domains = await this.props.getDomains();
      this.props.showThis({
        ...this.props,
        domains,
      })
    }
  }

  chiplet = (data, id) => {
    return <div id="chiplet" className={'chiplet'} key={id}>
      <div className={'chiplet-body'}>
        <div onClick={() => {
          this.props.showDomainsDetailPage({
            domain: data,
            status: data.status,
          })
        }} id="chipletTitle" className={'chiplet-title'}>
          {data.name}
        </div>
        <div id="chipletDescription" className={'chiplet-description'}>
          <div id="chipletExpiration">
            <span>Expires on: {data.details ? data.details.expiration : 'n/a'}</span>
          </div>
          <div id="chipletRenew">
            <span>Auto-renew: <a href={data.details ? this.props.setAutoRenew() : () => {}}>{data.details ? (data.details.autoRenew ? 'on' : 'off') : 'n/a'}</a></span>
          </div>
        </div>
      </div>
      <div className={'chiplet-status-wrapper ' + statusStyle(data.status)}>
        <div id="chipletStatus" className={'chiplet-status-text'}>
          {data.status}
        </div>
      </div>
    </div>
  }

  render () {
    if (this.props.domains) {
      return (
        <div className={'body'}>
          {this.props.domains.map((item, index) => {
            return this.chiplet(item, index)
          })}
        </div>
      )
    } else {
      return (<div>Loading domains...</div>);
    }
  }
}

DomainsScreen.propTypes = {
  showDomainsDetailPage: PropTypes.func.isRequired,
  setAutoRenew: PropTypes.func.isRequired,
  domains: PropTypes.array,
  getDomains: PropTypes.func,
  showThis: PropTypes.func,
}

function mapStateToProps (state) {
  const params = state.appState.currentView.params;
  return {
    dispatch: state.dispatch,
    ...params,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    showDomainsDetailPage: (data) => dispatch(rifActions.navigateTo(pageNames.rns.domainsDetail, {
      ...data,
      navBar: {
        title: 'Domain Detail',
        showBack: true,
      },
    })),
    setAutoRenew: (data) => {},
    showThis: (params) => dispatch(rifActions.navigateTo(pageNames.rns.domains, params)),
    getDomains: () => dispatch(rifActions.getDomains()),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(DomainsScreen)
