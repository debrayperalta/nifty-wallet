import React, {Component} from 'react';
import {connect} from 'react-redux';
import {faPlusCircle, faTimesCircle} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import rifActions from '../../actions';
import {pageNames} from '../../pages';

class Menu extends Component {

  static propTypes = {
    showThis: PropTypes.func,
    navigateTo: PropTypes.func,
    opened: PropTypes.bool,
    options: PropTypes.array,
    domainInfo: PropTypes.object,
  }

  getDefaultMenuOptions () {
    return [
      {
        label: 'Subdomains',
        action: () => this.props.navigateTo(pageNames.rns.subdomains, 'Subdomains', {domainInfo: this.props.domainInfo}),
      },
      {
        label: 'Renew Domain',
        action: () => this.props.navigateTo(pageNames.rns.renew, 'Renew Domain'),
      },
      {
        label: 'Pay',
        action: () => this.props.navigateTo(pageNames.rns.pay, 'Pay'),
      },
      {
        label: 'Sell it on MKP',
        action: () => this.props.navigateTo(pageNames.rns.sellOnMKP, 'Sell it on Marketplace'),
      },
      {
        label: 'Exchange Domain',
        action: () => this.props.navigateTo(pageNames.rns.exchange, 'Exchange Domain'),
      },
      {
        label: 'Transfer',
        action: () => this.props.navigateTo(pageNames.rns.transfer, 'Transfer Domain'),
      },
      {
        label: 'Lumino Channels',
        action: () => this.props.navigateTo(pageNames.rns.luminoChannels, 'Lumino Channels'),
      },
    ];
  }

  buildOptions () {
    const options = this.props.options ? this.props.options : this.getDefaultMenuOptions();
    if (options) {
      const optionFragments = [];
      options.forEach((option, index) => {
        optionFragments.push((<li key={'menu-option-' + index} onClick={option.action}>{option.label}</li>));
      });
      return (
        <ul>
          {optionFragments}
        </ul>
      );
    } else {
      return (
        <ul>
          <li>No available options</li>
        </ul>
      );
    }
  }

  render () {
    const opened = this.props.opened;
    if (opened) {
      const options = this.buildOptions();
      return (
        <div className="rns-menu">
          <FontAwesomeIcon icon={faTimesCircle} className="rns-menu-icon" onClick={() => {
            this.props.showThis({
              ...this.props,
              opened: !this.props.opened,
            });
          }}/>
          <div className="rns-menu-opened">
            {options}
          </div>
        </div>
      );
    } else {
      return (
        <div className="rns-menu">
          <FontAwesomeIcon icon={faPlusCircle} className="rns-menu-icon" onClick={() => {
            this.props.showThis({
              options: this.props.options,
              opened: !this.props.opened,
            });
          }}/>
        </div>
      );
    }
  }
}
function mapStateToProps (state) {
  const opened = state.appState.currentMenu ? state.appState.currentMenu.data.opened : false;
  const optionsFromState = state.appState.currentMenu ? state.appState.currentMenu.data.options : false;
  let result = {
    opened,
  };
  if (optionsFromState) {
    result = {
      ...result,
      options: optionsFromState,
    }
  }
  return result;
}

function mapDispatchToProps (dispatch) {
  return {
    showThis: (data) => dispatch(rifActions.showMenu(data)),
    navigateTo: (screenName, title, params) => {
      dispatch(rifActions.navigateTo(screenName, {
        ...params,
        showDomainsSearch: true,
        navBar: {
          title,
          backAction: () => dispatch(rifActions.navigateBack()),
        },
      }));
      dispatch(rifActions.hideMenu());
    },
  }
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(Menu)
