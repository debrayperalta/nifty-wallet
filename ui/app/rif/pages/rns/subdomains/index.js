import React, {Component} from 'react'
import {connect} from 'react-redux'
import DomainHeader from '../../../components/domain-header'
import PropTypes from 'prop-types'
import rifActions from '../../../actions'
import niftyActions from '../../../../actions'
import {pageNames} from '../../../pages/index'
import {faPlusCircle} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

class Subdomains extends Component {

  static propTypes = {
    domainInfo: PropTypes.object,
    showThis: PropTypes.func,
    getSubdomains: PropTypes.func,
    subdomains: PropTypes.array,
    showPopup: PropTypes.func,
    createSubdomain: PropTypes.func,
    showToast: PropTypes.func,
    getUnapprovedTransactions: PropTypes.func,
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
    // TODO: open the modal for the view page.
    console.log(subdomain);
  }

  openNewSubdomainPopup () {
    const elements = [
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
    this.props.showPopup('New Subdomain', elements, async () => {
      await this.props.createSubdomain(this.props.domainInfo.domainName, this.state.newSubdomain.name, this.state.newSubdomain.owner, this.props.domainInfo.ownerAddress);
      this.props.showPopup('Confirmation', 'Please confirm the operation in the next screen to create the subdomain.', async () => {
        const latestTransaction = await this.props.getUnapprovedTransactions();
        this.props.showTransactionConfirmPage({
            id: latestTransaction.id,
            unapprovedTransactions: latestTransaction,
            afterApproval: {
              action: (payload) => {
                this.loadSubdomains();
              },
              payload: null,
            },
          });
      }, 'Confirm');
    }, 'Next', async () => {
      const available = await this.props.isSubdomainAvailable(this.props.domainInfo.domainName, this.state.newSubdomain.name);
      if (!available) {
        this.props.showToast(`Subdomain ${this.state.newSubdomain.name} not available!`, false);
      }
      return available;
    });
  }

  getList () {
    const listItems = [];
    if (this.props.subdomains) {
      this.props.subdomains.forEach(subdomain => {
        listItems.push((
          <li onClick={() => this.openSubdomainPopup(subdomain)}>{subdomain.name}</li>
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
    showPopup: (title, elements, confirmCallback, confirmLabel, validateConfirm) => {
      if (elements && Array.isArray(elements)) {
        dispatch(rifActions.showModal({
          title,
          body: {
            elements,
          },
          confirmLabel,
          cancelLabel: 'Cancel',
          confirmCallback,
          validateConfirm,
        }));
      } else {
        dispatch(rifActions.showModal({
          title,
          body: {
            text: elements,
          },
          confirmLabel,
          cancelLabel: 'Cancel',
          confirmCallback,
          validateConfirm,
        }));
      }
    },
    createSubdomain: (domainName, subdomain, ownerAddress, parentOwnerAddress) => dispatch(rifActions.createSubdomain(domainName, subdomain, ownerAddress, parentOwnerAddress)),
    showToast: (message, success) => dispatch(niftyActions.displayToast(message, success)),
    getUnapprovedTransactions: () => dispatch(rifActions.getUnapprovedTransactions()),
    showTransactionConfirmPage: (data) => dispatch(niftyActions.showConfTxPage(data)),
    isSubdomainAvailable: (domainName, subdomain) => dispatch(rifActions.isSubdomainAvailable(domainName, subdomain)),
  }
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(Subdomains)
