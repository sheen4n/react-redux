import reducer from '../reducer';

function createStore(reducer) {
  let state;
  let listeners = [];

  function dispatch(action) {
    state = reducer(state, action);
    listeners.map((listener) => listener());
  }

  function getState() {
    return state;
  }

  function subscribe(listener) {
    listeners.push(listener);
    return () => (listeners = []);
  }

  return {
    getState,
    dispatch,
    subscribe,
  };
}

export default createStore(reducer);
