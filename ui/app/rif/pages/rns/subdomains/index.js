import React, {Component} from 'react'
import {connect} from 'react-redux'
import DomainHeader from '../../../components/domain-header'
import PropTypes from 'prop-types'
import rifActions from '../../../actions'
import niftyActions from '../../../../actions'
import {pageNames} from '../../../pages/index'
import {faPlusCircle, faCopy} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import extend from 'xtend'
import copyToClipboard from 'copy-to-clipboard'

class Subdomains extends Component {

  static propTypes = {
    domainInfo: PropTypes.object,
    showThis: PropTypes.func,
    getSubdomains: PropTypes.func,
    subdomains: PropTypes.array,
    showPopup: PropTypes.func,
    createSubdomain: PropTypes.func,
    showToast: PropTypes.func,
    showTransactionConfirmPage: PropTypes.func,
    isSubdomainAvailable: PropTypes.func,
  }

  constructor (props) {
    super(props);
    this.state = {
      newSubdomain: {
        name: null,
        owner: null,
      },
    };
  }

  componentDidMount () {
    this.loadSubdomains();
  }

  loadSubdomains () {
    this.props.getSubdomains(this.props.domainInfo.domainName)
      .then(subdomains => {
        this.props.showThis({
          ...this.props,
          subdomains,
        });
      });
  }

  openSubdomainPopup (subdomain) {
    const details = [
      (
        <div key="subdomain-popup" className="subdomain-popup-view">
          <div>
            <label>Name:</label>
            <span>{subdomain.name}</span>
          </div>
          <div>
            <label>Address:</label>
            <span className="subdomain-address">{subdomain.ownerAddress}</span>
            <FontAwesomeIcon className="hand-over"
                             onClick={() => {
                               copyToClipboard(subdomain.ownerAddress, {onCopy: (data) => {
                                 this.props.showToast('Address copied successfully!');
                                 }, format: 'text/plain'});
                             }}
                             icon={faCopy} />
          </div>
        </div>
      ),
    ];
    this.props.showPopup('Subdomain Details', {
      elements: details,
      hideConfirm: true,
      cancelLabel: 'Close',
    });
  }

  openNewSubdomainPopup () {
    const inputs = [
      (<input key="subdomain-name" type="text" placeholder="Subdomain Name" onChange={(e) => {
        const newSubdomain = this.state.newSubdomain;
        newSubdomain.name = e.target.value;
        this.setState({newSubdomain});
      }}/>),
      (<input key="subdomain-owner" type="text" placeholder="Owner Address (Optional)" onChange={(e) => {
        const newSubdomain = this.state.newSubdomain;
        newSubdomain.owner = e.target.value;
        this.setState({newSubdomain});
      }}/>),
    ];
    this.props.showPopup('New Subdomain', {
      elements: inputs,
      confirmLabel: 'Next',
      confirmCallback: async () => {
        await this.props.createSubdomain(
          this.props.domainInfo.domainName,
          this.state.newSubdomain.name,
          this.state.newSubdomain.owner,
          this.props.domainInfo.ownerAddress,
          (transactionReceipt) => {
            this.loadSubdomains();
          });
        this.props.showPopup('Confirmation', {
          text: 'Please confirm the operation in the next screen to create the subdomain.',
          hideCancel: true,
          confirmCallback: async () => {
            this.props.showTransactionConfirmPage({
              action: (payload) => {
                this.props.showThis({
                  ...this.props,
                });
              },
              payload: null,
            });
          },
        });
      },
      validateConfirm: async () => {
        const available = await this.props.isSubdomainAvailable(this.props.domainInfo.domainName, this.state.newSubdomain.name);
        if (!available) {
          this.props.showToast(`Subdomain ${this.state.newSubdomain.name} not available!`, false);
        }
        return available;
      },
    });
  }

  getList () {
    const listItems = [];
    if (this.props.subdomains) {
      this.props.subdomains.forEach((subdomain, index) => {
        listItems.push((
          <li className="hand-over" key={'subdomain-' + index} onClick={() => this.openSubdomainPopup(subdomain)}>{subdomain.name}</li>
        ))
      })
    }
    return listItems.length > 0 ? <ul>{listItems}</ul> : <div>No Subdomains Found</div>;
  }

  render () {
    const list = this.getList();
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
          {list}
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
    subdomains: params.subdomains,
    newSubdomain: state.newSubdomain,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getSubdomains: (domainName) => dispatch(rifActions.getSubdomains(domainName)),
    showThis: (params) => dispatch(rifActions.navigateTo(pageNames.rns.subdomains, params)),
    showPopup: (title, opts) => {
      const defaultOpts = {
        text: null,
        elements: null,
        confirmLabel: 'Confirm',
        cancelLabel: 'Cancel',
        confirmCallback: () => {},
        cancelCallback: () => {},
        validateConfirm: null,
        hideConfirm: false,
        hideCancel: false,
      };
      opts = extend(defaultOpts, opts);
      dispatch(rifActions.showModal({
        title,
        body: {
          elements: opts.elements,
          text: opts.text,
        },
        confirmLabel: opts.confirmLabel,
        confirmCallback: opts.confirmCallback,
        cancelLabel: opts.cancelLabel,
        cancelCallback: opts.cancelCallback,
        validateConfirm: opts.validateConfirm,
        hideConfirm: opts.hideConfirm,
        hideCancel: opts.hideCancel,
      }));
    },
    createSubdomain: (domainName, subdomain, ownerAddress, parentOwnerAddress, successCallback) =>
      dispatch(rifActions.createSubdomain(domainName, subdomain, ownerAddress, parentOwnerAddress, successCallback)),
    showToast: (message, success) => dispatch(niftyActions.displayToast(message, success)),
    showTransactionConfirmPage: (afterApproval) => dispatch(rifActions.goToConfirmPageForLastTransaction(afterApproval)),
    isSubdomainAvailable: (domainName, subdomain) => dispatch(rifActions.isSubdomainAvailable(domainName, subdomain)),
  }
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(Subdomains)
