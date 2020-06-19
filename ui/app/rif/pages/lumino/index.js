import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import rifActions from '../../actions';
import LuminoNetworkItem from '../../components/LuminoNetworkItem';
import {pageNames} from '../names';
import {GenericTable} from '../../components';

const styles = {
  myLuminoNetwork: {
    title: 'lumino-table-title',
    table: 'n-table',
    tbodyTd: 'n-table-td',
    pagination: {
      body: 'n-table-pagination',
      buttonBack: 'n-table-pagination-back',
      indexes: '',
      activePageButton: 'n-table-pagination-active',
      inactivePageButton: 'n-table-pagination-inactive',
      buttonNext: 'n-table-pagination-next',
    },
  },
}

class LuminoHome extends Component {

  static propTypes = {
    getLuminoNetworks: PropTypes.func,
    currentAddress: PropTypes.string,
    navigateTo: PropTypes.func,
  }

  constructor (props) {
    super(props);
    this.state = {
      networks: {
        withChannels: [],
        withoutChannels: [],
      },
    }
  }

  async componentDidMount () {
    const {getLuminoNetworks, currentAddress} = this.props;
    const networks = await getLuminoNetworks(currentAddress);
    if (networks && networks.withChannels.length || networks.withoutChannels.length) this.setState({networks});
  }

  navigateToNetworkDetail = (network) => {
    const {navigateTo} = this.props;
    const {symbol, tokenAddress, name, tokenNetwork} = network;
    return navigateTo(symbol, tokenAddress, name, tokenNetwork)
  }

  getNetworkItems = networkArr => {
    return networkArr.map(network => {
      return {
        content: <LuminoNetworkItem key={network.symbol} userChannels={network.userChannels}
                                    symbol={network.symbol} nodes={network.nodes}
                                    channels={network.channels}
                                    onRightChevronClick={() => this.navigateToNetworkDetail(network)}/>,
      }
    });
  }

  render () {
    const {networks} = this.state;
    const myNetworks = this.getNetworkItems(networks.withChannels)
    const otherNetworks = this.getNetworkItems(networks.withoutChannels)
    const columns = [{
      Header: 'Content',
      accessor: 'content',
    }];
    return (
      <div className="lumino-list-container">
        <GenericTable
          title={'My Lumino Networks'}
          classes={styles.myLuminoNetwork}
          columns={columns}
          data={myNetworks}
          paginationSize={3}/>
        <GenericTable
          title={'Lumino networks available'}
          classes={styles.myLuminoNetwork}
          columns={columns}
          data={otherNetworks}
          paginationSize={3}/>
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
    currentAddress: state.metamask.selectedAddress.toLowerCase(),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getLuminoNetworks: (userAddress) => dispatch(rifActions.getLuminoNetworks(userAddress)),
    navigateTo: (networkSymbol, tokenAddress, networkName, tokenNetwork) => {
      dispatch(rifActions.navigateTo(pageNames.lumino.networkDetails, {
        networkSymbol,
        tokenAddress,
        networkName,
        tokenNetwork,
        tabOptions: {
          tabIndex: 1,
          showBack: true,
          showSearchbar: false,
        },
      }));
    },
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(LuminoHome)
