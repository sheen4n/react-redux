import store from './customStore.js';
import { bugAdded, bugRemoved, bugResolved } from '../actions';

const unsubscribe = store.subscribe(() => {
  console.log('Store changed!', store.getState());
});
console.log(store);

// unsubscribe();

store.dispatch(bugAdded('Bug 1'));
store.dispatch(bugResolved(1));
// store.dispatch(bugRemoved(1));

console.log(store.getState());
