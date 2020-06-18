import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import rifActions from '../../actions';
import LuminoNetworkItem from '../../components/LuminoNetworkItem';
import {pageNames} from '../names';
import {GenericTable} from '../../components';
import SearchLuminoNetworks from '../../components/searchLuminoNetworks';

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
      filteredNetworks: {
        withChannels: [],
        withoutChannels: [],
      },
    }
  }

  async componentDidMount () {
    const {getLuminoNetworks, currentAddress} = this.props;
    const networks = await getLuminoNetworks(currentAddress);
    if (networks && networks.withChannels.length || networks.withoutChannels.length) {
      this.setState({
        networks,
        filteredNetworks: networks,
      });
    }
  }

  setFilteredNetworks = result => {
    const filteredNetworks = {
      withChannels: [],
      withoutChannels: [],
    }
    result.forEach(n => {
      if (n.userChannels) return filteredNetworks.withChannels.push(n);
      return filteredNetworks.withoutChannels.push(n);
    })
    return this.setState({filteredNetworks})
  }

  navigateToNetworkDetail = (network) => {
    const {navigateTo} = this.props;
    const {symbol, tokenAddress, name, tokenNetwork} = network;
    return navigateTo(symbol, tokenAddress, name, tokenNetwork)
  }

  getNetworkItems = networkArr => {
    return networkArr.map(n => {
      return {
        content: <LuminoNetworkItem key={n.symbol} userChannels={n.userChannels}
                                    symbol={n.symbol} nodes={n.nodes}
                                    channels={n.channels}
                                    onRightChevronClick={() => this.navigateToNetworkDetail(n)}/>,
      }
    });
  }

  render () {
    const {networks, filteredNetworks} = this.state;
    const myNetworks = this.getNetworkItems(filteredNetworks.withChannels)
    const otherNetworks = this.getNetworkItems(filteredNetworks.withoutChannels)
    const combinedNetworks = [...networks.withChannels, ...networks.withoutChannels];
    const columns = [{
      Header: 'Content',
      accessor: 'content',
    }];
    return (
      <div className="body">
        <SearchLuminoNetworks data={combinedNetworks} setFilteredNetworks={this.setFilteredNetworks}/>
        <GenericTable
          title={'My Lumino Networks'}
          columns={columns}
          data={myNetworks}
          paginationSize={3}/>
        <GenericTable
          title={'Lumino networks available'}
          columns={columns}
          data={otherNetworks}
          paginationSize={3}/>
      </div>
    );
  }
}

function mapStateToProps (state) {
  // params is the params value or object passed to rifActions.navigateTo('pageName', params)
  // const params = state.appState.currentView.params;
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
