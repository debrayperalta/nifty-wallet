import extend from 'xtend'

function showModal (appState, action) {
  return extend(appState, {
    currentModal: {
      name: action.data.name,
      message: action.data.message,
    },
    transForward: false,
    warning: null,
  })
}

function showMenu (appState, action) {
  return extend(appState, {
    currentMenu: {
      data: action.data,
    },
  });
}

function navigateTo (appState, action) {
  return extend(appState, {
    currentView: {
      name: 'rif',
      screenName: action.data.screenName,
      context: appState.currentView.context,
      params: action.data.params,
    },
  })
}

export const rifReducers = {
  navigateTo,
  showMenu,
  showModal,
}
