import extend from 'xtend'

function showModal (appState, action) {
  if (action.currentModal) {
    return extend(appState, {
      currentModal: {
        name: action.currentModal.name,
        message: action.currentModal.message,
      },
      transForward: false,
      warning: null,
    });
  } else {
    return extend(appState, {
      currentModal: null,
      transForward: false,
      warning: null,
    });
  }
}

function showMenu (appState, action) {
  if (action.data) {
    return extend(appState, {
      currentMenu: {
        data: action.data,
      },
    });
  } else {
    return extend(appState, {
      currentMenu: null,
    });
  }
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
