import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {CustomButton, GenericTable} from './index';
import rifActions from '../actions';
import ItemWithActions from './item-with-actions';
import {faCoins} from '@fortawesome/free-solid-svg-icons';
import { SVG_PLUS } from '../constants';

class LuminoNetworkChannels extends Component {

  static propTypes = {
    pageName: PropTypes.string.isRequired,
    isOwner: PropTypes.bool,
    paginationSize: PropTypes.number,
    getChannelsGroupedByNetwork: PropTypes.func,
    getChannel: PropTypes.func,
    classes: PropTypes.any,
  }

  constructor (props) {
    super(props);
    this.state = {
      networkChannels: [],
    };
  }

  getData () {
    const {classes} = this.props;
    if (this.state.networkChannels) {
      return this.state.networkChannels.map(networkChannel => {
        const item = <ItemWithActions leftIcon={{icon: faCoins, color: '#05836D'}} contentClasses={classes.content} actionClasses={classes.contentActions}
                                      text={networkChannel.token_symbol} enableRightChevron={true}/>
        return {
          content: item,
        }
      });
    }
    return [];
  }

  componentDidMount () {
    this.loadChannels();
  }

  loadChannels () {
    this.props.getChannelsGroupedByNetwork().then(networkChannels => {
      const arrayNetworks = [];
      for (let key of Object.keys(networkChannels)) {
        const network = {
          token_network_identifier: key,
          token_symbol: networkChannels[key][0].token_symbol,
          channels: networkChannels[key],
        }
        arrayNetworks.push(network);
      }
      this.setState({
        networkChannels: arrayNetworks,
      });
    });
  }

  render () {
    const {isOwner, paginationSize, classes} = this.props;
    const data = this.getData();
    return (
      <div>
      {
        data.length > 0 &&
          <div>
            <GenericTable
              title={'Lumino Channels'}
              columns={[
                {
                  Header: 'Content',
                  accessor: 'content',
                },
              ]}
              data={data}
              paginationSize={paginationSize || 3}
              classes={classes}
            />
          </div>
      }
      {
        data.length === 0 &&
        <div>
          <span>Lumino Channels</span>
          <span>No channels found</span>
        </div>
      }
        {(isOwner || false) &&
        <CustomButton
          svgIcon={SVG_PLUS}
          text={'Add channel'}
          onClick={() => {
          }}
          className={
            {
              button: classes.customButton.button,
              icon: classes.customButton.icon,
              text: classes.customButton.text,
            }
          }
        />
        }
      </div>
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
    getChannelsGroupedByNetwork: () => dispatch(rifActions.getChannelsGroupedByNetwork()),
    getChannel: () => {},
  }
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(LuminoNetworkChannels);
