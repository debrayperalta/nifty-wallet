import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import rifActions from '../actions';
import {faPen, faTimes} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { GenericTable } from './index';
import {getChainAddressByChainAddress} from '../utils/utils';
import {DEFAULT_ICON, GET_RESOLVERS} from '../constants';

class ChainAddresses extends Component {

  static propTypes = {
    domainName: PropTypes.string.isRequired,
    selectedResolverAddress: PropTypes.string,
    getChainAddresses: PropTypes.func,
    paginationSize: PropTypes.number,
    classes: PropTypes.any,
  }

  constructor (props) {
    super(props);
    const resolvers = Object.assign([], GET_RESOLVERS());
    this.state = {
      chainAddresses: [],
      resolvers: resolvers,
    };
  }

  componentDidMount () {
    this.loadChainAddresses();
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.domainName !== this.props.domainName) {
      this.loadChainAddresses();
    }
  }

  async loadChainAddresses () {
    if (this.state.resolvers.find(resolver => resolver.address === this.props.selectedResolverAddress)) {
      const chainAddresses = await this.props.getChainAddresses(this.props.domainName);
      this.setState({chainAddresses: chainAddresses});
    }
  }

  convertChainAddressesToTableData () {
    const data = [];
    this.state.chainAddresses.map((chainAddress, index) => {
      const address = getChainAddressByChainAddress(chainAddress.chain);
      const icon = address.icon ? address.icon : DEFAULT_ICON;
      const tableRow = {};
      tableRow.content =
        <div className={''}>
          <div className={''}>
            <FontAwesomeIcon icon={icon.icon} color={icon.color} className={''}/>
            <span>{address.symbol}</span>
          </div>
          <div className={''}>
            <span>{chainAddress.address}</span>
          </div>
        </div>
      tableRow.actions =
        <div className={''}>
          <FontAwesomeIcon
            icon={faPen}
            className={''}
            onClick={() => {}}
          />
          <FontAwesomeIcon
            icon={faTimes}
            className={''}
            onClick={() => {}}
          />
        </div>
      data.push(tableRow);
    });
    return data;
  }
  render () {
    const { paginationSize, classes } = this.state;
    const data = this.convertChainAddressesToTableData();
    return (
      <GenericTable
        title={'Addresses'}
        columns={[
          {
            Header: 'Content',
            accessor: 'content',
          },
          {
            Header: 'actions',
            accessor: 'actions',
          },
        ]}
        data={data}
        paginationSize={paginationSize || 3}
        className={classes}
      />
    );
  }
}
function mapStateToProps (state) {
  const params = state.appState.currentView.params;
  return {
    ...params,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getChainAddresses: (domainName) => dispatch(rifActions.getChainAddresses(domainName)),
  }
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(ChainAddresses);
