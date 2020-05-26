import React, {Component} from 'react';
import {connect} from 'react-redux';
import rifActions from '../../actions';
import PropTypes from 'prop-types';
import {ChannelStatusChip} from './index';
import {getStatusForChannel} from '../../utils/utils'

class ChannelChiplet extends Component {
  static propTypes = {
    address: PropTypes.string,
    balance: PropTypes.number,
    tokenSymbol: PropTypes.string,
    status: PropTypes.string,
    getDomainByAddress: PropTypes.func,
  }
  constructor (props) {
    super(props);
    this.state = {
      domain: '',
    };
  }
  componentDidMount () {
    this.getDomainByAddress();
  }
  async getDomainByAddress (address) {
    const domain = await this.props.getDomainByAddress(this.props.address);
    this.setState({domain: domain});
  }
  render () {
    const { address, balance, tokenSymbol, status } = this.props;
    const { domain } = this.state;
      return (<div className={'channels-info-chiplet'}>
        <div className={'channels-info-chiplet-text'}>
          <div className={'channels-info-chiplet-text-domain'}>{domain || address}</div>
          <div className={'channels-info-chiplet-text-balance'}>Your balance: <span>{balance} {tokenSymbol}</span></div>
        </div>
        <div className={'channels-info-chiplet-status'}>
          <div>{ChannelStatusChip(getStatusForChannel(status))}</div>
        </div>
      </div>)
  }
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
    getDomainByAddress: (address) => dispatch(rifActions.getDomainByAddress(address)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(ChannelChiplet)
