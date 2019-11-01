import React, { Component } from 'react';
import { connect } from 'react-redux';
// import Home from "./test/Home";
// import Stuff from "./test/Stuff";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  componentDidMount() {
  }
  render() {
    return (
      <div>
        this is home page
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    userApp: state.userApp
  };
}
export default connect(mapStateToProps)(Home);