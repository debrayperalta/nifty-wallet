import {rns} from './rns';
import {lumino} from './lumino';

const global = {
  TRANSACTION_STATUS_OK: '0x1',
  TRANSACTION_STATUS_FAIL: '0x0',
  networks: {
    main: '30',
    test: '31',
    reg: '33',
  },
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
  lumino,
  global,
  EXPIRING_REMAINING_DAYS,
  DOMAIN_STATUSES,
  RSK_CHAINID,
}
