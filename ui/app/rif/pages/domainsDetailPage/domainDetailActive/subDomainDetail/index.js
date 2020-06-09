import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import ItemWithActions from '../../../../components/item-with-actions';

class SubDomainDetail extends Component {

  static propTypes = {
    domainName: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }

  render = () => {
    const {domainName, name} = this.props;
    const mockController = 'Controller: 0x123456789012345'
    return <div>
      <h3>{name}.{domainName}</h3>
      <h6>Transfer</h6>
      <ItemWithActions text={mockController} enableEdit={true}/>
    </div>
  }
}

function mapStateToProps (state) {
  const params = state.appState.currentView.params;
  return {
    ...params,
  }
}

export default connect(mapStateToProps, null)(SubDomainDetail);
