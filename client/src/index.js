import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import globalReducer from "state"; //only state is written because of file jsconfig
import { setupListeners } from '@reduxjs/toolkit/query';
import {api} from "state/api";

//defined the store
const store = configureStore({
  reducer : {
    global : globalReducer,
    [api.reducerPath] : api.reducer,
  },
  middleware : (getDefault) => getDefault().concat(api.middleware)
})
setupListeners(store.dispatch);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store = {store}> {/*The <Provider> component makes the Redux store available to any nested components that need to access the Redux store. */}
      <App />
    </Provider>
  </React.StrictMode>
);

