import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { GenericTable } from './index';
import rifActions from '../actions';

class LuminoChannels extends Component {

  static propTypes = {
    paginationSize: PropTypes.number,
    getChannels: PropTypes.func,
    classes: PropTypes.any,
  }

  constructor (props) {
    super(props);
    this.state = {

    };
  }

  getData () {
    const data = [];
    return data;
  }

  async getChannels() {
    const channels = await this.props.getChannels();
    console.debug('====================================================================== channels', channels);
    return channels;
  }

  render () {
    const { paginationSize, classes } = this.props;
    const channels = this.getChannels();
    return (
      <GenericTable
        title={'Subdomains'}
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
        data={this.getData()}
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
    getChannels: () => dispatch(rifActions.getChannels()),
  }
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(LuminoChannels);
