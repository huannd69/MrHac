import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { ToastContainer } from 'react-toastify';
import { connect } from 'react-redux';
import App2 from './App2';

import AppReducer from './reducers';

const store = createStore(AppReducer, applyMiddleware(thunk));

const Kernel = () => ( 
  <div>
    <ToastContainer autoClose={3000} />
    <Provider store={store}>
      <App2 />
    </Provider>
  </div>
)
function mapStateToProps(state) {
  return {
    userApp: state.userApp
  };
}

export default Kernel;