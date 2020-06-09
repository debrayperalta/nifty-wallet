import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {GenericTable} from './index';
import ItemWithActions from './item-with-actions';

class TransferTable extends Component {

  static propTypes = {
    controllerAddress: PropTypes.string.isRequired,
    classes: PropTypes.any,
  }

  render () {
    const {controllerAddress, classes} = this.props;
    const item = {content: <ItemWithActions text={controllerAddress} enableEdit={true}/>};
    const data = [item];
    return (
      <GenericTable
        title={'Transfer'}
        columns={[
          {
            Header: 'Content',
            accessor: 'content',
          },
        ]}
        data={data}
        paginationSize={0}
        classes={classes}
      />
    );
  }
}

export default TransferTable;
