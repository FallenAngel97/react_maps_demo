import { createStore } from 'redux';

const initialState = {
  user: localStorage.getItem('userLogged')
}

function userChanged(state = initialState, action) {
  if(action.type == 'USER_CHANGED') {
    return Object.assign({}, state, { user: action.user })
  }
  return state;
}

const store = createStore(
  userChanged,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export default store;