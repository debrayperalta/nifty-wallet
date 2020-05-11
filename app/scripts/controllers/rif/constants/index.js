import {rns} from './rns'

const global = {
  TRANSACTION_STATUS_OK: '0x1',
  TRANSACTION_STATUS_FAIL: '0x0',
}

const EXPIRING_REMAINING_DAYS = 30;

const DOMAIN_STATUSES = {
  ACTIVE: 'active',
  PENDING: 'pending',
  EXPIRING: 'expiring',
  EXPIRED: 'expired',
};

const RSK_CHAINID = '0x80000089';

export {
  rns,
  global,
  EXPIRING_REMAINING_DAYS,
  DOMAIN_STATUSES,
  RSK_CHAINID,
}
