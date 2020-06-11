import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ChainAddresses, Subdomains, LuminoNetworkChannels } from '../../../components';
import {pageNames} from '../../names';
import { GET_RESOLVERS } from '../../../constants';
import niftyActions from '../../../../actions';
import rifActions from '../../../actions';
import DomainHeader from '../../../components/domain-header';
import { rns } from '../../../../../../rif.config';

// TODO @fmelo
// Here you can set the classnames for the entire page
const styles = {
  chainAddresses: {
    title: 'n-table-title',
    table: 'n-table',
    thead: '',
    theadTr: '',
    theadTh: '',
    tbody: '',
    tbodyTr: '',
    tbodyTd: 'n-table-td',
    noData: '',
    content: 'n-table-content-address',
    contentActions: 'n-table-actions',
    customButton: {
      button: 'btn-add',
      icon: '',
      text: '',
    },
    pagination: {
      body: 'n-table-pagination',
      buttonBack: 'n-table-pagination-back',
      indexes: '',
      activePageButton: 'n-table-pagination-active',
      inactivePageButton: 'n-table-pagination-inactive',
      buttonNext: 'n-table-pagination-next',
    },
  },
  subdomains: {
    title: 'n-table-title',
    table: 'n-table',
    thead: '',
    theadTr: '',
    theadTh: '',
    tbody: '',
    tbodyTr: '',
    tbodyTd: 'n-table-td',
    noData: '',
    content: '',
    contentActions: 'n-table-actions',
    customButton: {
      button: 'btn-add',
      icon: '',
      text: '',
    },
    pagination: {
      body: 'n-table-pagination',
      buttonBack: 'n-table-pagination-back',
      indexes: '',
      activePageButton: 'n-table-pagination-active',
      inactivePageButton: 'n-table-pagination-inactive',
      buttonNext: 'n-table-pagination-next',
    },
  },
  LuminoNetworkChannels: {
    title: 'n-table-title',
    table: 'n-table',
    thead: '',
    theadTr: '',
    theadTh: '',
    tbody: '',
    tbodyTr: '',
    tbodyTd: 'n-table-td',
    noData: '',
    content: 'n-table-content-channels',
    contentActions: 'n-table-actions',
    customButton: {
      button: 'btn-add',
      icon: '',
      text: '',
    },
    pagination: {
      body: 'n-table-pagination',
      buttonBack: 'n-table-pagination-back',
      indexes: '',
      activePageButton: 'n-table-pagination-active',
      inactivePageButton: 'n-table-pagination-inactive',
      buttonNext: 'n-table-pagination-next',
    },
  },
}

class DomainsDetailActiveScreen extends Component {
	static propTypes = {
    addNewChainAddress: PropTypes.func.isRequired,
    setNewResolver: PropTypes.func.isRequired,
    deleteChainAddressForResolver: PropTypes.func.isRequired,
		setAutoRenew: PropTypes.func.isRequired,
    getUnapprovedTransactions: PropTypes.func,
    domain: PropTypes.object.isRequired,
		domainName: PropTypes.string.isRequired,
		address: PropTypes.string.isRequired,
		content: PropTypes.string.isRequired,
		expirationDate: PropTypes.string.isRequired,
		autoRenew: PropTypes.bool.isRequired,
		ownerAddress: PropTypes.string.isRequired,
    selectedResolverAddress: PropTypes.string,
		isOwner: PropTypes.bool,
		isLuminoNode: PropTypes.bool,
		isRifStorage: PropTypes.bool,
    displayToast: PropTypes.func.isRequired,
    disableResolvers: PropTypes.bool,
    newChainAddresses: PropTypes.array,
    getDomain: PropTypes.func,
    showToast: PropTypes.func,
	}
	constructor (props) {
		super(props);
    const resolvers = Object.assign([], GET_RESOLVERS());
    const enableComboResolvers = this.props.isOwner && !(props.disableResolvers || false);
		this.state = {
      disableCombo: !enableComboResolvers,
			resolvers: resolvers,
		};
	}
  /*
	async onChangeComboResolvers (e) {
    for (const resolverItem of e.target.children) {
      if (resolverItem.value === e.target.value) {
        const address = resolverItem.getAttribute('data-address');
        const transactionListenerId = await this.props.setNewResolver(this.props.domainName, address);
        this.props.waitForListener(transactionListenerId)
          .then(transactionReceipt => {
            this.props.showDomainsDetailPage({
              domain: this.props.domain,
              status: this.props.domain.details.status,
              disableResolvers: false,
              selectedResolverAddress: address,
            });
          });
        this.props.showTransactionConfirmPage({
          action: () => {
            this.props.showDomainsDetailPage({
              domain: this.props.domain,
              status: this.props.domain.details.status,
              disableResolvers: true,
              selectedResolverAddress: address,
            });
            this.props.showToast('Waiting Confirmation');
          },
        });
        return;
      }
    }
  }
*/
  componentDidUpdate (prevProps, prevState) {
    if (this.props.disableResolvers !== this.state.disableCombo) {
      this.setState({ disableCombo: this.props.disableResolvers });
    }
  }

  getDefaultSelectedValue (resolvers, selectedResolverAddress) {
    const selectedResolver = resolvers.find(resolver => resolver.address === selectedResolverAddress);
    if (selectedResolver) {
      return selectedResolver.name;
    }
    return rns.contracts.publicResolver;
  }

	render () {
    const { domain, domainName, content, expirationDate, autoRenew, ownerAddress, isOwner, isLuminoNode, isRifStorage, selectedResolverAddress, newChainAddresses } = this.props;
    const domainInfo = {
      domainName,
      expirationDate,
      autoRenew,
      ownerAddress,
      isOwner,
      isLuminoNode,
      isRifStorage,
      content,
    };
		const { resolvers } = this.state;
		return (
      <div className='domain-detail'>
        <DomainHeader domainName={domainName}
                      showOwnerIcon={isOwner}
                      showLuminoNodeIcon={isLuminoNode}
                      showRifStorageIcon={isRifStorage}/>
        <div id="domainDetailBody" className={''}>
          {resolvers &&
          <div id="chainAddressesBody" className={''}>
            <ChainAddresses
              domain={domain}
              domainName={domainName}
              selectedResolverAddress={selectedResolverAddress}
              paginationSize={3}
              classes={styles.chainAddresses}
              isOwner={isOwner}
              newChainAddresses={newChainAddresses}
              redirectParams={{domain: this.props.domain,
                status: this.props.domain.status,
                newChainAddresses: newChainAddresses,
              }}
              pageName={pageNames.rns.domainsDetail}
            />
          </div>
          }
          <Subdomains
            isOwner={isOwner}
            domainInfo={domainInfo}
            classes={styles.subdomains}
            paginationSize={3}
            pageName={pageNames.rns.domainsDetail}
          />
          <LuminoNetworkChannels
            isOwner={isOwner}
            paginationSize={3}
            classes={styles.LuminoNetworkChannels}
            pageName={pageNames.rns.domainsDetail}
          />
        </div>
      </div>
		);
	}
}

function mapStateToProps (state) {
	const params = state.appState.currentView.params;
	const domain = params.domain;
	const details = domain.details || params.details;
  return {
		dispatch: state.dispatch,
		status: details.status,
		domainName: details.name,
		address: details.address,
		content: details.content,
		expirationDate: details.expiration,
		autoRenew: details.autoRenew,
		ownerAddress: details.ownerAddress,
		isOwner: state.metamask.selectedAddress.toLowerCase() === details.ownerAddress.toLowerCase(),
		isLuminoNode: details.isLuminoNode,
		isRifStorage: details.isRifStorage,
    selectedResolverAddress: params.selectedResolverAddress ? params.selectedResolverAddress : details.selectedResolverAddress,
    newChainAddresses: details.newChainAddresses || [],
    disableResolvers: details.disableResolvers,
		domain: domain,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		addNewChainAddress: (message) => dispatch(rifActions.showModal(message)),
    setNewResolver: (domainName, resolverAddress) => dispatch(rifActions.setResolverAddress(domainName, resolverAddress)),
    deleteChainAddressForResolver: (domainName, chain, chainAddress) => {},
    getUnapprovedTransactions: () => dispatch(rifActions.getUnapprovedTransactions()),
		setAutoRenew: () => {},
    displayToast: (message) => dispatch(niftyActions.displayToast(message)),
    getDomain: (domainName) => dispatch(rifActions.getDomain(domainName)),
    showToast: (message, success) => dispatch(niftyActions.displayToast(message, success)),
	}
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(DomainsDetailActiveScreen)
