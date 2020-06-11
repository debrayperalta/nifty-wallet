import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import rifActions from '../../actions';
import LuminoNetworkItem from '../../components/LuminoNetworkItem';

class LuminoHome extends Component {

  static propTypes = {
    getLuminoNetworks: PropTypes.func,
  }

  constructor (props) {
    super(props);
    this.state = {
      networks: [],
    }
  }

  async componentDidMount () {
    const {getLuminoNetworks} = this.props;
    const result = await getLuminoNetworks();
    if (result && result.length) this.setState({networks: result});
  }

  render () {
    const {networks} = this.state;
    return (
      <div className="body">
        <div>Lumino networks available</div>
        {networks.map(n => <LuminoNetworkItem key={n.symbol} symbol={n.symbol} nodes={n.nodes} channels={n.channels}
                                              onClick={() => console.warn(n)}/>,
        )}
      </div>
    );
  }
}

function mapStateToProps (state) {
  // params is the params value or object passed to rifActions.navigateTo('pageName', params)
  const params = state.appState.currentView.params;
  return {}
}

function mapDispatchToProps (dispatch) {
  return {
    getLuminoNetworks: () => dispatch(rifActions.getLuminoNetworks()),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(LuminoHome)
