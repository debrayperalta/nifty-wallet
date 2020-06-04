import CustomButton from './customButton'
import SearchDomains from './searchDomains'
import {DomainIcon, LuminoNodeIcon, RifStorageIcon} from './commons'
import Menu from './menu/index'
import h from 'react-hyperscript'
import CustomModal from './modal/modal';
import { GenericTable } from './table';

function buildModal (modalComponent, currentModal) {
  return h(modalComponent, {key: currentModal.name, message: currentModal.message})
}

function showModal (currentModal) {
  if (currentModal) {
    switch (currentModal.name) {
      case 'generic-modal':
        return buildModal(CustomModal, currentModal);
    }
  }
  return null;
}

export {
  CustomButton,
  SearchDomains,
  DomainIcon,
  LuminoNodeIcon,
  RifStorageIcon,
  Menu,
  showModal,
  GenericTable,
}
