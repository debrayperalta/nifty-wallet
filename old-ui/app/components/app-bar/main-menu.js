import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Dropdown, DropdownMenuItem } from '../dropdown'
import actions from '../../../../ui/app/actions'
import { connect } from 'react-redux'
import { faMoneyBill, faAddressCard, faShoppingCart } from '@fortawesome/free-solid-svg-icons'

class MainMenu extends Component {
  static propTypes = {
    showConfigPage: PropTypes.func.isRequired,
    lockMetamask: PropTypes.func.isRequired,
    showInfoPage: PropTypes.func.isRequired,
    changeState: PropTypes.func.isRequired,
    openMainMenu: PropTypes.func.isRequired,
    showDomainsPage: PropTypes.func.isRequired,
    showPaymentsPage: PropTypes.func.isRequired,
    showMarketplacePage: PropTypes.func.isRequired,
    isMainMenuOpen: PropTypes.bool,
  }

  render () {
    const isOpen = this.props.isMainMenuOpen
    const isMainMenuOpen = !isOpen

    return (
      <Dropdown
        useCssTransition={true}
        isOpen={isOpen}
        zIndex={11}
        constOverflow={true}
        onClickOutside={(event) => {
          const classList = event.target.classList
          const parentClassList = event.target.parentElement.classList

          const isToggleElement = classList.contains('sandwich-expando') ||
            parentClassList.contains('sandwich-expando')

          if (isOpen && !isToggleElement) {
            this.props.openMainMenu()
          }
        }}
        style={{
          position: 'absolute',
          right: '2px',
          top: '38px',
          width: '12rem',
          maxHeight: isOpen ? '350px' : '0px',
          overflow: 'hidden',
        }}
      >
        <DropdownMenuItem
          closeMenu={() => this.props.changeState(isMainMenuOpen)}
          onClick={() => { this.props.showConfigPage() }}
          title={'Settings'}
        />

        <DropdownMenuItem
          closeMenu={() => this.props.changeState(isMainMenuOpen)}
          onClick={() => { this.props.lockMetamask() }}
          title={'Log Out'}
        />

        <DropdownMenuItem
          closeMenu={() => this.props.changeState(isMainMenuOpen)}
          onClick={() => { this.props.showInfoPage() }}
          title={'Info/Help'}
        />

        <DropdownMenuItem
          closeMenu={() => this.props.changeState(isMainMenuOpen)}
          onClick={() => { this.props.showDomainsPage() }}
          title={"Your Domains"}
          icon={faAddressCard}
        ></DropdownMenuItem>

        <DropdownMenuItem
          closeMenu={() => this.props.changeState(isMainMenuOpen)}
          onClick={() => { this.props.showPaymentsPage() }}
          title={'Payments'}
          icon={faMoneyBill}
        />

        <DropdownMenuItem
          closeMenu={() => this.props.changeState(isMainMenuOpen)}
          onClick={() => { this.props.showMarketplacePage() }}
          title={'Marketplace'}
          icon={faShoppingCart}
        />
      </Dropdown>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    showConfigPage: () => dispatch(actions.showConfigPage()),
    lockMetamask: () => dispatch(actions.lockMetamask()),
    showInfoPage: () => dispatch(actions.showInfoPage()),
    showDomainsPage: () => dispatch(actions.showDomainsPage()),
    showPaymentsPage: () => dispatch(actions.showPaymentsPage()),
    showMarketplacePage: () => dispatch(actions.showMarketplacePage()),
  }
}

export default connect(null, mapDispatchToProps)(MainMenu)
