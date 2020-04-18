import React from 'react';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import BugsList from './components/BugsList';
// import Bugs from './components/Bugs';
import './App.css';

const store = configureStore();

function App() {
  return (
    <Provider store={store}>
      <BugsList />
      {/* <Bugs /> */}
    </Provider>
  );
}

export default App;
