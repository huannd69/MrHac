import React, { Component } from 'react';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import Home from "./sites/user/containners/Home";
import Login from "./sites/user/containners/account/Login";
import Admin from "./sites/admin/Home";
import clientUtils from "./utils/client-utils";
import objectUtils from "./utils/object-utils";
import constants from "./resources/strings";
// import Stuff from "./test/Stuff";

class Main extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <Route exact path="/" component={Login} />
            <Route exact path="/dang-nhap" component={Login} />
            {
              ["/admin", "/admin/:function", "/admin/:function/:id"].map((item, index) =>
                <Route key={index} exact path={item} component={Admin} />
              )
            }
          </div>
        </Router>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userApp: state.userApp
  };
}

export default connect(mapStateToProps)(Main);