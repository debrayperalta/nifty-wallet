import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

class Tabs extends Component {

  static propTypes = {
    tabs: PropTypes.array.isRequired,
    initialTabIndex: PropTypes.number,
    onChange: PropTypes.func,
    showBack: PropTypes.bool,
    backAction: PropTypes.func,
  }

  constructor (props) {
    super(props);
    this.state = {
      activeTab: props.initialTabIndex ? props.tabs[props.initialTabIndex] : props.tabs[0],
    }
  }

  selectTab (tab) {
    this.setState({
      activeTab: tab,
    });
    if (this.props.onChange) {
      this.props.onChange(tab);
    }
  }

  sortTabs (tab1, tab2) {
    if (tab1.index > tab2.index) {
      return 1;
    } else if (tab1.index < tab2.index) {
      return -1;
    } else {
      return 0;
    }
  }

  getTabBarItems () {
    let tabs = this.props.tabs;
    tabs = tabs.sort(this.sortTabs);
    const tabComponents = [];
    if (this.props.showBack) {
      tabComponents.push(<li className="rif-tabs-back-button">
                           <i onClick={(event) => {
                              this.props.backAction();
                            }} className="fa fa-arrow-left fa-lg cursor-pointer"/>
                         </li>);
    }
    tabComponents.push(...tabs.map(tab => {
      const active = tab.index === this.state.activeTab.index;
      const className = 'rif-tabs-bar-item ' + (active ? 'rif-tabs-bar-item-active' : '');
      return (
        <li key={tab.index} id={tab.index}
            className={className}
            onClick={(event) => this.selectTab(tab)}>{tab.title}</li>
      );
    }));
    return tabComponents;
  }

  getActiveTabContent () {
    return (this.state.activeTab.component);
  }

  render () {
    return (
      <div className="rif-tabs">
        <ul className="rif-tabs-bar">
          {this.getTabBarItems()}
        </ul>
        <div className="rif-tabs-content">
          {this.getActiveTabContent()}
        </div>
      </div>
    );
  }
}

module.exports = connect()(Tabs)