import React, {Component} from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import rifActions from '../../../actions'
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {SearchDomains} from '../../../components'

export const namedSizes = {
  small: 16,
  medium: 24,
  large: 52,
  xLarge: 72,
  xxLarge: 96,
};


class DomainRegisterScreen extends Component {

  static propTypes = {
    domainName: PropTypes.string,
    dispatch: PropTypes.func,
    goBack: PropTypes.func,
  }

  showRegistration () {}

  render () {
    const style = { width: 96, height: 96 };
    return (
      <div className={'body'}>
        <FontAwesomeIcon icon={faChevronLeft} className={'rif-back-button'} onClick={() => this.props.goBack()}/>
        <SearchDomains />
        <div id="headerName" className={'domain-name'}>
          <span>{this.props.domainName}</span>
        </div>
        <div className="domainRegisterAnimation">
          <svg
            className="checkmark"
            xmlns="http://www.w3.org/2000/svg"
            style={style}
            viewBox="0 0 52 52">
            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
          </svg>
          <div>
            Domain Available!!!
          </div>
        </div>
        <div className="button-container">
          <button onClick={this.showRegistration()}>Register Domain</button>
        </div>
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
    dispatch: state.dispatch,
    domainName: state.appState.currentView.data.domainName,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    goBack: () => dispatch(rifActions.showDomainsPage()),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(DomainRegisterScreen)
