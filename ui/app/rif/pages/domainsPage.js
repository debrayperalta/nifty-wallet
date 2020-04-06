import { Component } from 'react';
import h from 'react-hyperscript'
import { connect } from 'react-redux'
import actions from '../../actions'

class DomainsScreen extends Component {
  navigateTo (url) {
    global.platform.openWindow({ url })
  }
  render () {
    return (
      h('.flex-column.flex-grow', {
        style: {
          maxWidth: '400px',
        },
      }, [
        // subtitle and nav
        h('.section-title.flex-row.flex-center', [
          h('i.fa.fa-arrow-left.fa-lg.cursor-pointer', {
            onClick: (event) => {
              this.props.dispatch(actions.goHome())
            },
            style: {
              position: 'absolute',
              left: '30px',
            },
          }),
          h('h2', 'Domains Screen'),
        ]),
        // main view
        h('.flex-column.flex-justify-center.flex-grow.select-none', [
          h('.flex-space-around', {
            style: {
              padding: '0 30px',
            },
          }, [
            h('.info', [
              h('div', 'RNS Domains'),
            ]),
          ]),
        ]),
      ])
    )
  }
}
function mapStateToProps (state) {
  return {dispatch: state.dispatch}
}
module.exports = connect(mapStateToProps)(DomainsScreen)