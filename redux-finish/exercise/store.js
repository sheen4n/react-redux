class Store {
  constructor(reducer, state = []) {
    let _reducer = reducer;
    let _state = state;

    this.dispatch = (action) => {
      _state = _reducer(_state, action);
    };

    this.getState = () => {
      return _state;
    };

    this.subscribe = () => {
      return null;
    };
  }
}

export default Store;
