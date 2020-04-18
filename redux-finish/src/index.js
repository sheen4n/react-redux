import configureStore from './store/configureStore';
import { loadBugs, resolveBug, assignBugToUser } from './store/bugs';

const store = configureStore();

// UI Layer
store.dispatch(loadBugs());
// store.dispatch(addBug({ description: 'a' }));

// setTimeout(() => store.dispatch(loadBugs()), 2000);
// setTimeout(() => store.dispatch(resolveBug(1)), 2000);
setTimeout(() => store.dispatch(assignBugToUser(1, 4)), 2000);
