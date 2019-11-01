import React, { Component } from 'react';
import '../App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Test from "./Test/Test";
import Authorization from "../securities/Authorization";
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  componentDidMount() {
  }
  render() {
    return (
      <div className="App">
        <Router>
          <div style={{ height: '100vh', width: '100%' }}>
            <div>{this.state.x}</div>
            <button onClick={() => { this.setState({ x: 1, test: 'xxxx' }) }}></button>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Route exact path="/" component={Authorization(Test, [])} />
            <Route path="/about" component={Authorization(Test, ['admin', 'user'])} />            
          </div>
        </Router>

        <ToastContainer />
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
  };
}
export default connect(mapStateToProps)(Main);