import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { getChainAddressByChainAddress } from '../../../utils/utils';
import { CustomButton, Menu } from '../../../components'
import AddNewChainAddressToResolver from './addNewTokenNetworkAddress/addNewChainAddressToResolver'
import { GET_RESOLVERS, DEFAULT_ICON } from '../../../constants'
import { SLIP_ADDRESSES } from '../../../constants/slipAddresses'
import niftyActions from '../../../../actions'
import {pageNames} from '../../index'
import rifActions from '../../../actions'
import DomainHeader from '../../../components/domain-header'

class DomainsDetailActiveScreen extends Component {
	static propTypes = {
    addNewChainAddress: PropTypes.func.isRequired,
    setNewResolver: PropTypes.func.isRequired,
    setChainAddressForResolver: PropTypes.func.isRequired,
		setAutoRenew: PropTypes.func.isRequired,
    getChainAddresses: PropTypes.func,
    getUnapprovedTransactions: PropTypes.func,
    showTransactionConfirmPage: PropTypes.func,
    domain: PropTypes.object.isRequired,
		domainName: PropTypes.string.isRequired,
		address: PropTypes.string.isRequired,
		content: PropTypes.string.isRequired,
		expirationDate: PropTypes.string.isRequired,
		autoRenew: PropTypes.bool.isRequired,
		ownerAddress: PropTypes.string.isRequired,
    selectedResolverAddress: PropTypes.string.isRequired,
		isOwner: PropTypes.bool,
		isLuminoNode: PropTypes.bool,
		isRifStorage: PropTypes.bool,
    showDomainsDetailPage: PropTypes.func.isRequired,
    displayToast: PropTypes.func.isRequired,
    waitForListener: PropTypes.func,
    disableResolvers: PropTypes.bool,
	}
	constructor(props) {
		super(props);
    let resolvers = Object.assign([], GET_RESOLVERS());
    let slipChainAddresses = Object.assign([], SLIP_ADDRESSES);
    const enableComboResolvers = this.props.isOwner && !(props.disableResolvers || false);
		this.state = {
      disableCombo: !enableComboResolvers,
			resolvers: resolvers,
      slipChainAddresses: slipChainAddresses,
      selectedChainAddress: slipChainAddresses[0].chain,
			insertedAddress: '',
      chainAddresses: [],
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
        this.props.showDomainsDetailPage(this.props.domain);
      });
    this.props.showTransactionConfirmPage({
      action: () => this.props.showDomainsDetailPage(this.props.domain),
    });
	}
  showModalAddChainAddress = () => {
		let elements = [];
		elements.push(<AddNewChainAddressToResolver
      updateChainAddress={this.updateChainAddress.bind(this)}
			updateAddress={this.updateAddress.bind(this)}
      slipChainAddresses={this.state.slipChainAddresses}
		/>);
		let message = {
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
    for (let resolverItem of e.target.children) {
      if (resolverItem.value === e.target.value) {
        const address = resolverItem.getAttribute('data-address');
        const transactionListenerId = await this.props.setNewResolver(this.props.domainName, address);
        let domain = this.props.domain;
        this.props.waitForListener(transactionListenerId)
          .then(transactionReceipt => {
            domain.disableResolvers = false;
            domain.selectedResolverAddress = address;
            this.props.showDomainsDetailPage(domain);
          });

        domain.disableResolvers = true;
        this.props.showTransactionConfirmPage({
          action: () => this.props.showDomainsDetailPage(domain),
        });
        return;
      }
    }
  }
  componentDidMount () {
    this.loadChainAddresses();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.domainName !== this.props.domainName) {
      this.loadChainAddresses();
    }
  }

  async loadChainAddresses () {
    if (this.state.resolvers.find(resolver => resolver.address === this.props.selectedResolverAddress)) {
      const chainAddresses = await this.props.getChainAddresses(this.props.domainName);
      this.setState({chainAddresses: chainAddresses});
    }
  }

	render () {
		const { domainName, address, content, expirationDate, autoRenew, ownerAddress, isOwner, isLuminoNode, isRifStorage, selectedResolverAddress } = this.props;
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
		const { chainAddresses, disableCombo } = this.state;
		return (
      <div className={'body'}>
        <DomainHeader domainName={domainName}
                      showOwnerIcon={isOwner}
                      showLuminoNodeIcon={isLuminoNode}
                      showRifStorageIcon={isRifStorage}/>
        <div id="domainDetailBody" className={'domain-detail-body'}>
          <div id="bodyDescription" className={'domain-description'}>
            <div><span className={'domain-description-field'}>Address:</span><span className={'domain-description-value label-spacing-left'}>{address}</span></div>
            <div><span className={'domain-description-field'}>Content:</span><span className={'domain-description-value label-spacing-left'}>{content}</span></div>
            <div><span className={'domain-description-field'}>Expires on:</span><span className={'domain-description-value label-spacing-left'}>{expirationDate}</span></div>
            <div><span className={'domain-description-field'}>Auto renew: <a href={this.props.setAutoRenew()}>{autoRenew ? 'on' : 'off'}</a></span></div>
            <div><span className={'domain-description-field'}>Owner:</span><span className={'domain-description-value label-spacing-left'}>{ownerAddress}</span></div>
          </div>
          {this.state.resolvers &&
            <div id="resolversBody" className={'resolvers-body'}>
              <div className="resolver-body-top">
                <div id="selectResolver" className={'custom-select'}>
                  <select id="comboResolvers" className="select-css" disabled={disableCombo} onChange={!disableCombo && this.onChangeComboResolvers.bind(this)}>
                    <option disabled selected value hidden> Select Resolver </option>
                      {
                        this.state.resolvers.map((resolver, index) => {
                          return (<option
                            key={index}
                            selected={resolver.address === selectedResolverAddress}
                            value={resolver.name}
                            data-address={resolver.address}
                          >{resolver.name}</option>)
                        })
                      }
                  </select>
                </div>
                {(isOwner && this.state.resolvers.find(resolver => resolver.address === this.props.selectedResolverAddress)) &&
                  <CustomButton
                    icon={faPlusCircle}
                    text={'NEW'}
                    onClick={() => this.showModalAddChainAddress()}
                    className={
                      {
                        button: 'domain-detail-new-button',
                        icon: 'domain-icon centerY',
                        text: 'center',
                      }
                    }
                  />
                }
              </div>
              <div id="resolverChainAddressBody" className={'resolver-chainaddress'}>
                {
                  chainAddresses.length <= 0 ? <div></div> :
                    chainAddresses.map((chainAddress, index) => {
                    const address = getChainAddressByChainAddress(chainAddress.chain);
                    const icon = address.icon ? address.icon : DEFAULT_ICON;
                    return <div key={index} className={'resolver-chainaddress-description'}>
                      <div className={'resolver-chainaddress-description-chain'}>
                        <FontAwesomeIcon icon={icon.icon} color={icon.color} className={'domain-icon'}/>
                        <span>{address.symbol}</span>
                      </div>
                      <div className={'resolver-chainaddress-description-chain-address'}>
                        <span>{chainAddress.address}</span>
                      </div>
                    </div>
                  })
                }
              </div>
            </div>
          }
          {!isOwner &&
          <CustomButton
            text={'WATCH & REGISTER'}
            onClick={() => {}}
            className={
              {
                button: 'domain-detail-watch-and-register',
                text: 'center',
              }
            }
          />
          }
          <Menu domainInfo={domainInfo} />
        </div>
      </div>
		);
	}
}

function mapStateToProps (state) {
	const data = state.appState.currentView.params;
  return {
		dispatch: state.dispatch,
		status: data.status,
		domainName: data.domain,
		address: data.address,
		content: data.content,
		expirationDate: data.expiration,
		autoRenew: data.autoRenew,
		ownerAddress: data.ownerAddress,
		isOwner: state.metamask.selectedAddress.toLowerCase() === data.ownerAddress.toLowerCase(),
		isLuminoNode: data.isLuminoNode,
		isRifStorage: data.isRifStorage,
    selectedResolverAddress: data.selectedResolverAddress,
    disableResolvers: data.disableResolvers,
		domain: data,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		addNewChainAddress: (message) => dispatch(rifActions.showModal(message)),
    setNewResolver: (domainName, resolverAddress) => dispatch(rifActions.setResolverAddress(domainName, resolverAddress)),
    getChainAddresses: (domainName) => dispatch(rifActions.getChainAddresses(domainName)),
    setChainAddressForResolver: (domainName, chain, chainAddress) => dispatch(rifActions.setChainAddressForResolver(domainName, chain, chainAddress)),
    getUnapprovedTransactions: () => dispatch(rifActions.getUnapprovedTransactions()),
    showTransactionConfirmPage: (afterApproval) => dispatch(rifActions.goToConfirmPageForLastTransaction(afterApproval)),
    waitForListener: (transactionListenerId) => dispatch(rifActions.waitForTransactionListener(transactionListenerId)),
		setAutoRenew: () => {},
    showDomainsDetailPage: (data) => dispatch(rifActions.navigateTo(pageNames.rns.domainsDetail, data)),
    displayToast: (message) => dispatch(niftyActions.displayToast(message)),
	}
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(DomainsDetailActiveScreen)
