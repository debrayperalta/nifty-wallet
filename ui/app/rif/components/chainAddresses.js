import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import rifActions from '../actions';
import { GenericTable } from './index';
import {getChainAddressByChainAddress} from '../utils/utils';
import {DEFAULT_ICON, GET_RESOLVERS} from '../constants';
import ItemWithActions from './item-with-actions';

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
    const { classes } = this.props;
    return this.state.chainAddresses.map((chainAddress) => {
      const address = getChainAddressByChainAddress(chainAddress.chain);
      const icon = address.icon ? address.icon : DEFAULT_ICON;
      return {
        content: <ItemWithActions classes={classes} enableEdit={true} enableDelete={true} text={chainAddress.address} leftIcon={icon} />,
      };
    });
  }

  render () {
    const { paginationSize, classes } = this.props;
    const data = this.convertChainAddressesToTableData();
    return (
      <GenericTable
        title={'Addresses'}
        columns={[
          {
            Header: 'Content',
            accessor: 'content',
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
