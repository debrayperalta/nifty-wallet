import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faTimes } from '@fortawesome/free-solid-svg-icons';
import { getChainAddressByChainAddress } from '../../../utils/utils';
import { CustomButton } from '../../../components';
import AddNewChainAddressToResolver from './addNewTokenNetworkAddress/addNewChainAddressToResolver';
import { GET_RESOLVERS, DEFAULT_ICON } from '../../../constants';
import { SLIP_ADDRESSES } from '../../../constants/slipAddresses';
import niftyActions from '../../../../actions';
import {pageNames} from '../../index';
import rifActions from '../../../actions';
import DomainHeader from '../../../components/domain-header';
import {rns} from '../../../../../../rif.config';
import GenericTable from '../../../components/table/genericTable';

class DomainsDetailActiveScreen extends Component {
	static propTypes = {
    addNewChainAddress: PropTypes.func.isRequired,
    setNewResolver: PropTypes.func.isRequired,
    setChainAddressForResolver: PropTypes.func.isRequired,
    deleteChainAddressForResolver: PropTypes.func.isRequired,
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
      chainAddresses: [],
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
  componentDidMount () {
    this.loadChainAddresses();
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.domainName !== this.props.domainName) {
      this.loadChainAddresses();
    } else if (this.props.updateChains) {
      if (this.state.updateChains) {
        this.setState({ updateChains: false });
        this.loadChainAddresses();
      }
    }
    if (this.props.disableResolvers !== this.state.disableCombo) {
      this.setState({ disableCombo: this.props.disableResolvers });
    }
  }

  async loadChainAddresses () {
    if (this.state.resolvers.find(resolver => resolver.address === this.props.selectedResolverAddress)) {
      const chainAddresses = await this.props.getChainAddresses(this.props.domainName);
      this.setState({chainAddresses: chainAddresses});
    }
  }

  getDefaultSelectedValue (resolvers, selectedResolverAddress) {
    const selectedResolver = resolvers.find(resolver => resolver.address === selectedResolverAddress);
    if (selectedResolver) {
      return selectedResolver.name;
    }
    return rns.contracts.publicResolver;
  }

  convertChainAddressesToTableData () {
    const data = [];
    this.state.chainAddresses.map((chainAddress, index) => {
      const address = getChainAddressByChainAddress(chainAddress.chain);
      const icon = address.icon ? address.icon : DEFAULT_ICON;
      const tableRow = {};
      tableRow.content =
        <div className={''}>
          <div className={''}>
            <FontAwesomeIcon icon={icon.icon} color={icon.color} className={''}/>
            <span>{address.symbol}</span>
          </div>
          <div className={''}>
            <span>{chainAddress.address}</span>
          </div>
        </div>
      tableRow.actions =
        <div className={''}>
          <FontAwesomeIcon
            icon={faPen}
            // color={'#FFFFFFFFFFF'}
            className={''}
            onClick={() => {}}
          />
          <FontAwesomeIcon
            icon={faTimes}
            // color={'#FFFFFFFFFFF'}
            className={''}
            onClick={() => {}}
          />
        </div>
      data.push(tableRow);
    });
    return data;
  }
	render () {
		const { domainName, address, expirationDate, ownerAddress, isOwner, isLuminoNode, isRifStorage } = this.props;
		const { chainAddresses } = this.state;
    const columnsChainAddresses = [
      {
        Header: 'Content',
        accessor: 'content',
      },
      {
        Header: 'actions',
        accessor: 'actions',
      },
    ];

    // TODO Fede
    // Acá van los styles para la tabla
    const styles = {
      title: '',
      table: '',
      thead: '',
      theadTr: '',
      theadTh: '',
      tbody: '',
      tbodyTr: '',
      tbodyTd: '',
      pagination: {
        body: '',
        buttonBack: '',
        indexes: '',
        activePageButton: '',
        inactivePageButton: '',
        buttonNext: '',
      },
    }
		return (
      <div className={'body'}>
        <DomainHeader domainName={domainName}
                      showOwnerIcon={isOwner}
                      showLuminoNodeIcon={isLuminoNode}
                      showRifStorageIcon={isRifStorage}/>
        <div id="domainDetailBody" className={''}>
          {this.state.resolvers &&
          <div id="resolversBody" className={''}>
            <div className="">
              {
                (this.state.resolvers && chainAddresses.length > 0) &&
                <GenericTable
                  title={'Addresses'}
                  columns={[
                    {
                      Header: 'Content',
                      accessor: 'content',
                    },
                    {
                      Header: 'actions',
                      accessor: 'actions',
                    },
                  ]}
                  data={this.convertChainAddressesToTableData()}
                  paginationSize={3}
                  className={styles}
                />
              }
              {(isOwner && this.state.resolvers.find(resolver => resolver.address === this.props.selectedResolverAddress)) &&
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
          </div>
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
    getChainAddresses: (domainName) => dispatch(rifActions.getChainAddresses(domainName)),
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
