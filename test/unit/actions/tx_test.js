var assert = require('assert')
var path = require('path')

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const actions = require(path.join(__dirname, '../../../ui/app/actions.js'))
const rifActions = require(path.join(__dirname, '../../../ui/app/rif/actions.js'))

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('tx confirmation screen', function () {
  const txId = 1457634084250832
  const initialState = {
    appState: {
      currentView: {
        name: 'confTx',
      },
    },
    metamask: {
      unapprovedTxs: {
        [txId]: {
          id: txId,
          status: 'unconfirmed',
          time: 1457634084250,
        },
      },
    },
  }

  const store = mockStore(initialState)

  describe('cancelTx', function () {
    before(function (done) {
      const backgroundConnection = {
        approveTransaction (txId, cb) { cb('An error!') },
        cancelTransaction (txId, cb) { cb() },
        clearSeedWordCache (cb) { cb() },
        getState (cb) { cb() },
      }
      actions._setBackgroundConnection(backgroundConnection)
      rifActions.setBackgroundConnection(backgroundConnection)
      done()
    })

    it('creates COMPLETED_TX with the cancelled transaction ID', function (done) {
      store.dispatch(actions.cancelTx({ id: txId }))
        .then(() => {
          const storeActions = store.getActions()
          const completedTxAction = storeActions.find(({ type }) => type === actions.COMPLETED_TX)
          assert.equal(completedTxAction.value, txId)
          done()
        })
    })
  })
})
