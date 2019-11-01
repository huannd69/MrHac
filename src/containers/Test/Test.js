import React, { Component } from 'react';
class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  componentDidMount() {
    debugger;
    setTimeout(()=>{
      let map = new window.google.maps.Map(document.getElementById('map'), {
        center: {lat: -33.8688, lng: 151.2195},
        zoom: 13,
        mapTypeId: 'roadmap',
      });  
    },2000);
  }
  
  render() {
    return (
      <div>
       <div id='map' />
      </div>
    );
  }
}
export default Test;