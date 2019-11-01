import React, { Component } from 'react';
import { connect } from 'react-redux';
import userProvider from "./data-access/user-provider";

import constants from "./resources/strings";
import { BrowserRouter } from 'react-router-dom'
import Main from './Main';
// import Test from './containers/Test/Test';
const AppMain = () => {
  return <BrowserRouter>
    <Main />
    {/* <Test /> */}
  </BrowserRouter>
}

class App2 extends Component {
  constructor(props) {
    super(props);
    this.state = {}
    this.props.dispatch({ type: constants.action.action_user_login, value: userProvider.getAccountStorage() })
  }
  render() {
    return (<AppMain />);
  }
}
function mapStateToProps(state) {
  return {
    userApp: state.userApp
  };
}

export default connect(mapStateToProps)(App2);