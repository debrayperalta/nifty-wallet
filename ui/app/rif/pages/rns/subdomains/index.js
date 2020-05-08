import React, {Component} from 'react'
import {connect} from 'react-redux'
import DomainHeader from '../../../components/domain-header'
import PropTypes from 'prop-types'
import rifActions from '../../../actions'
import niftyActions from '../../../../actions'
import {pageNames} from '../../../pages/index'
import {faCopy, faPlusCircle, faTimes} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import copyToClipboard from 'copy-to-clipboard'

class Subdomains extends Component {

  static propTypes = {
    domainInfo: PropTypes.object,
    showThis: PropTypes.func,
    getSubdomains: PropTypes.func,
    subdomains: PropTypes.array,
    showPopup: PropTypes.func,
    createSubdomain: PropTypes.func,
    waitForListener: PropTypes.func,
    showToast: PropTypes.func,
    showTransactionConfirmPage: PropTypes.func,
    isSubdomainAvailable: PropTypes.func,
    deleteSubdomain: PropTypes.func,
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
      confirmLabel: 'Delete',
      closeAfterConfirmCallback: false,
      confirmButtonClass: 'delete-button',
      confirmCallback: () => {
        this.openDeletePopup(subdomain);
      },
      cancelLabel: 'Close',
    });
  }

  showCreationSuccess () {
    this.props.showPopup('Created Successfully', {
      elements: [
        (
          <svg key="ok-animation"
            className="checkmark"
            xmlns="http://www.w3.org/2000/svg"
            width="96"
            height="96"
            viewBox="0 0 52 52">
            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
          </svg>
        ),
        (<span key="ok-text">Your subdomain is ready!</span>),
      ],
      hideCancel: true,
      confirmLabel: 'Close',
      confirmCallback: () => {
        this.loadSubdomains();
      },
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
        const transactionListenerId = await this.props.createSubdomain(
          this.props.domainInfo.domainName,
          this.state.newSubdomain.name.toLowerCase(),
          this.state.newSubdomain.owner,
          this.props.domainInfo.ownerAddress);
        this.props.waitForListener(transactionListenerId).then(tranactionReceipt => {
          this.showCreationSuccess();
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
                this.props.showToast('Waiting Confirmation');
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

  openDeletePopup (subdomain) {
    this.props.showPopup('Delete Subdomain', {
      text: 'Are you sure you want to delete the subdomain ' + subdomain.name + '?',
      confirmCallback: () => {
        this.props.deleteSubdomain(subdomain.domainName, subdomain.name);
        this.props.showTransactionConfirmPage(() => {
          this.props.showThis({
            ...this.props,
          });
          this.props.showToast('Waiting for confirmation');
        });
      },
      confirmButtonClass: 'delete-button',
    });
  }

  getList () {
    const listItems = [];
    if (this.props.subdomains) {
      this.props.subdomains.forEach((subdomain, index) => {
        listItems.push((
          <li className="hand-over list-item" key={'subdomain-' + index} onClick={() => this.openSubdomainPopup(subdomain)}>
            <span>{subdomain.name}</span>
            <FontAwesomeIcon onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              this.openDeletePopup(subdomain);
            }} icon={faTimes}/>
          </li>
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
  const params = state.appState.currentView.params;
  return {
    ...params,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getSubdomains: (domainName) => dispatch(rifActions.getSubdomains(domainName)),
    showThis: (params) => dispatch(rifActions.navigateTo(pageNames.rns.subdomains, params)),
    showPopup: (title, opts) => {
      dispatch(rifActions.showModal({
        title,
        ...opts,
      }));
    },
    createSubdomain: (domainName, subdomain, ownerAddress, parentOwnerAddress) => dispatch(rifActions.createSubdomain(domainName, subdomain, ownerAddress, parentOwnerAddress)),
    waitForListener: (transactionListenerId) => dispatch(rifActions.waitForTransactionListener(transactionListenerId)),
    showToast: (message, success) => dispatch(niftyActions.displayToast(message, success)),
    showTransactionConfirmPage: (afterApproval) => dispatch(rifActions.goToConfirmPageForLastTransaction(afterApproval)),
    isSubdomainAvailable: (domainName, subdomain) => dispatch(rifActions.isSubdomainAvailable(domainName, subdomain)),
    deleteSubdomain: (domainName, subdomain) => dispatch(rifActions.deleteSubdomain(domainName, subdomain)),
  }
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(Subdomains)
