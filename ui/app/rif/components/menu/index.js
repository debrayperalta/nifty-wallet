import React, {Component} from 'react';
import {connect} from 'react-redux';
import {faPlusCircle, faTimesCircle} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import rifActions from '../../actions';

class Menu extends Component {

  static propTypes = {
    showThis: PropTypes.func,
    navigateTo: PropTypes.func,
    opened: PropTypes.bool,
    options: PropTypes.array,
  }

  getDefaultMenuOptions () {
    return [
      {
        label: 'Subdomains',
        action: () => this.props.navigateTo('subdomains'),
      },
      {
        label: 'Renew Domain',
        action: () => alert('Renew Domain'),
      },
      {
        label: 'Pay',
        action: () => alert('Pay'),
      },
      {
        label: 'Sell it on MKP',
        action: () => alert('Sell it on MKP'),
      },
      {
        label: 'Exchange Domain',
        action: () => alert('Exchange Domain'),
      },
      {
        label: 'Transfer',
        action: () => alert('Transfer'),
      },
      {
        label: 'Lumino Channels',
        action: () => alert('Lumino Channels'),
      },
    ];
  }

  buildOptions () {
    const options = this.props.options ? this.props.options : this.getDefaultMenuOptions();
    if (options) {
      const optionFragments = [];
      options.forEach(option => {
        optionFragments.push((<li onClick={option.action}>{option.label}</li>));
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
    navigateTo: (screenName, params) => dispatch(rifActions.navigateTo(screenName, params)),
  }
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(Menu)
