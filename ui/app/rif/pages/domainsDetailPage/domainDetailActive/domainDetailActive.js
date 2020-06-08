import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { faPlus, faPen } from '@fortawesome/free-solid-svg-icons';
import { CustomButton, ChainAddresses, Subdomains, LuminoChannels } from '../../../components';
import AddNewChainAddressToResolver from './addNewTokenNetworkAddress/addNewChainAddressToResolver';
import { GET_RESOLVERS } from '../../../constants';
import { SLIP_ADDRESSES } from '../../../constants/slipAddresses';
import niftyActions from '../../../../actions';
import {pageNames} from '../../index';
import rifActions from '../../../actions';
import DomainHeader from '../../../components/domain-header';
import { rns } from '../../../../../../rif.config';

class DomainsDetailActiveScreen extends Component {
	static propTypes = {
    addNewChainAddress: PropTypes.func.isRequired,
    setNewResolver: PropTypes.func.isRequired,
    setChainAddressForResolver: PropTypes.func.isRequired,
    deleteChainAddressForResolver: PropTypes.func.isRequired,
		setAutoRenew: PropTypes.func.isRequired,
    getUnapprovedTransactions: PropTypes.func,
    showTransactionConfirmPage: PropTypes.func,
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
    showDomainsDetailPage: PropTypes.func.isRequired,
    displayToast: PropTypes.func.isRequired,
    waitForListener: PropTypes.func,
    disableResolvers: PropTypes.bool,
    updateChains: PropTypes.bool,
    getDomain: PropTypes.func,
    showToast: PropTypes.func,
	}
	constructor (props) {
		super(props);
    const resolvers = Object.assign([], GET_RESOLVERS());
    const slipChainAddresses = Object.assign([], SLIP_ADDRESSES);
    const enableComboResolvers = this.props.isOwner && !(props.disableResolvers || false);
		this.state = {
      disableCombo: !enableComboResolvers,
			resolvers: resolvers,
      slipChainAddresses: slipChainAddresses,
      selectedChainAddress: slipChainAddresses[0].chain,
			insertedAddress: '',
      updateChains: true,
		};
	}
  updateChainAddress = (selectedOption) => {
    this.setState({ selectedChainAddress: selectedOption });
	}
	updateAddress = (address) => {
		this.setState({ insertedAddress: address });
	}
  async addAddress () {
    const transactionListenerId = await this.props.setChainAddressForResolver(this.props.domainName, this.state.selectedChainAddress, this.state.insertedAddress);
    this.props.waitForListener(transactionListenerId)
      .then(transactionReceipt => {
        this.props.showDomainsDetailPage({updateChains: true, ...this.props.domain});
      });
    this.props.showTransactionConfirmPage({
      action: () => this.props.showDomainsDetailPage(this.props.domain),
    });
	}
  showModalAddChainAddress = () => {
    const elements = [];
		elements.push(<AddNewChainAddressToResolver
      updateChainAddress={this.updateChainAddress.bind(this)}
			updateAddress={this.updateAddress.bind(this)}
      slipChainAddresses={this.state.slipChainAddresses}
		/>);
    const message = {
			title: 'Add new chain address',
			body: {
				elements: elements,
			},
			confirmLabel: 'SAVE',
			cancelLabel: 'CANCEL',
			confirmCallback: () => {
				this.addAddress()
			},
			cancelCallback: () => {
			},
		};
		this.props.addNewChainAddress(message);
	}

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
    const { domainName, content, expirationDate, autoRenew, ownerAddress, isOwner, isLuminoNode, isRifStorage, selectedResolverAddress } = this.props;
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

    // TODO @fmelo
    // Here you can set the classnames for the entire page
    const styles = {
      chainAddresses: {
        title: '',
        table: '',
        thead: '',
        theadTr: '',
        theadTh: '',
        tbody: '',
        tbodyTr: '',
        tbodyTd: '',
        noData: '',
        content: '',
        contentActions: '',
        pagination: {
          body: '',
          buttonBack: '',
          indexes: '',
          activePageButton: '',
          inactivePageButton: '',
          buttonNext: '',
        },
      },
      subdomains: {
        title: '',
        table: '',
        thead: '',
        theadTr: '',
        theadTh: '',
        tbody: '',
        tbodyTr: '',
        tbodyTd: '',
        noData: '',
        content: '',
        contentActions: '',
        pagination: {
          body: '',
          buttonBack: '',
          indexes: '',
          activePageButton: '',
          inactivePageButton: '',
          buttonNext: '',
        },
      },
      luminoChannels: {
        title: '',
        table: '',
        thead: '',
        theadTr: '',
        theadTh: '',
        tbody: '',
        tbodyTr: '',
        tbodyTd: '',
        noData: '',
        content: '',
        contentActions: '',
        pagination: {
          body: '',
          buttonBack: '',
          indexes: '',
          activePageButton: '',
          inactivePageButton: '',
          buttonNext: '',
        },
      },
    }
		return (
      <div className={'body'}>
        <DomainHeader domainName={domainName}
                      showOwnerIcon={isOwner}
                      showLuminoNodeIcon={isLuminoNode}
                      showRifStorageIcon={isRifStorage}/>
        <div id="domainDetailBody" className={''}>
          <LuminoChannels />
          {resolvers &&
          <div id="chainAddressesBody" className={''}>
            <ChainAddresses
              domainName={domainName}
              selectedResolverAddress={selectedResolverAddress}
              paginationSize={3}
              classes={styles.chainAddresses}
            />
            {(isOwner && resolvers.find(resolver => resolver.address === selectedResolverAddress)) &&
            <CustomButton
              icon={faPlus}
              text={'Add Address'}
              onClick={() => this.showModalAddChainAddress()}
              className={
                {
                  button: '',
                  icon: '',
                  text: '',
                }
              }
            />
            }
          </div>
          }
          <Subdomains domainInfo={domainInfo} className={styles.subdomains} paginationSize={3}/>
          {isOwner &&
          <CustomButton
            icon={faPlus}
            text={'Add Subdomain'}
            onClick={() => { }}
            className={
              {
                button: '',
                icon: '',
                text: '',
              }
            }
          />
          }
          <div id="renewDescription" className={''}>
            <div className={''}>Renew</div>
            <div>
              <span className={''}>Renewal date:</span>
              <span className={''}>{expirationDate}</span>
              <CustomButton
                text={'Renew'}
                onClick={ () => {} }
                className={
                  {
                    button: '',
                    text: '',
                  }
                }
              />
            </div>
          </div>
          <div id="transferDescription" className={''}>
            <div className={''}>Transfer</div>
            <div>
              <span className={''}>Owner:</span>
              <span className={''}>{ownerAddress}</span>
              <CustomButton
                icon={faPen}
                onClick={ () => {}}
                className={
                {
                  button: '',
                  icon: '',
                  text: '',
                  }
                }
              />
            </div>
          </div>
        </div>
      </div>
		);
	}
}

function mapStateToProps (state) {
	const params = state.appState.currentView.params;
	const domain = params.domain;
	const details = domain.details;
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
    updateChains: details.updateChains,
    disableResolvers: details.disableResolvers,
		domain: domain,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		addNewChainAddress: (message) => dispatch(rifActions.showModal(message)),
    setNewResolver: (domainName, resolverAddress) => dispatch(rifActions.setResolverAddress(domainName, resolverAddress)),
    setChainAddressForResolver: (domainName, chain, chainAddress) => dispatch(rifActions.setChainAddressForResolver(domainName, chain, chainAddress)),
    deleteChainAddressForResolver: (domainName, chain, chainAddress) => {},
    getUnapprovedTransactions: () => dispatch(rifActions.getUnapprovedTransactions()),
    showTransactionConfirmPage: (afterApproval) => dispatch(rifActions.goToConfirmPageForLastTransaction(afterApproval)),
    waitForListener: (transactionListenerId) => dispatch(rifActions.waitForTransactionListener(transactionListenerId)),
		setAutoRenew: () => {},
    showDomainsDetailPage: (props) => dispatch(rifActions.navigateTo(pageNames.rns.domainsDetail, {
      tabOptions: {
        screenTitle: 'Domain Details',
      },
      ...props,
    })),
    displayToast: (message) => dispatch(niftyActions.displayToast(message)),
    getDomain: (domainName) => dispatch(rifActions.getDomain(domainName)),
    showToast: (message, success) => dispatch(niftyActions.displayToast(message, success)),
	}
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(DomainsDetailActiveScreen)
