import React, {Component} from 'react'
import {connect} from 'react-redux'
import DomainHeader from '../../../components/domain-header'
import PropTypes from 'prop-types'
import rifActions from '../../../actions'
import {pageNames} from '../../../pages/index'
import {faPlusCircle} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

class Subdomains extends Component {

  static modes = {
    list: 'list',
  }

  static propTypes = {
    domainInfo: PropTypes.object,
    showThis: PropTypes.func,
    getSubdomains: PropTypes.func,
    subdomains: PropTypes.array,
    mode: PropTypes.string,
  }

  componentDidMount () {
    this.props.getSubdomains(this.props.domainInfo.domainName)
      .then(subdomains => {
        this.props.showThis({
          ...this.props,
          subdomains,
        });
      });
  }

  openSubdomainPopup (subdomain) {
    // TODO: open the modal for the view page.
    console.log(subdomain);
  }

  openNewSubdomainPopup () {
    // TODO: open the new subdomain modal
    console.log('New Subdomain Opened');
  }

  getBody () {
    const currentMode = this.props.mode;
    const listItems = [];
    if (this.props.subdomains) {
      this.props.subdomains.forEach(subdomain => {
        listItems.push((
          <li onClick={() => this.openSubdomainPopup(subdomain)}>{subdomain.name}</li>
        ))
      })
    }
    const partials = {
      list: (
        listItems.length > 0 ? <ul>{listItems}</ul> : <div>No Subdomains Found</div>
      ),
    };
    return partials[currentMode];
  }

  render () {
    const body = this.getBody();
    const {domainName, isOwner, isLuminoNode, isRifStorage} = this.props.domainInfo;
    return (
      <div className="body subdomains">
        <DomainHeader domainName={domainName}
                      showOwnerIcon={isOwner}
                      showLuminoNodeIcon={isLuminoNode}
                      showRifStorageIcon={isRifStorage}/>
        <div className="new-button-container">
          <button onClick={() => this.openNewSubdomainPopup()} className="new-button">
            <FontAwesomeIcon icon={faPlusCircle}/> new
          </button>
        </div>
        <div className="list">
          {body}
        </div>
      </div>
    );
  }
}
function mapStateToProps (state) {
  // params is the params value or object passed to rifActions.navigateTo('pageName', params)
  const params = state.appState.currentView.params;
  return {
    domainInfo: params.domainInfo,
    mode: params.mode ? params.mode : Subdomains.modes.list,
    subdomains: params.subdomains,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getSubdomains: (domainName) => dispatch(rifActions.getSubdomains(domainName)),
    showThis: (params) => dispatch(rifActions.navigateTo(pageNames.rns.subdomains, params)),
  }
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(Subdomains)
