import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'

import WbSunnyOutlinedIcon from '@material-ui/icons/WbSunnyOutlined';

import ReactMapboxGl, { Layer, Feature, Popup } from 'react-mapbox-gl';

import { getWeatherData } from './netatmoRequests'
import styled from 'styled-components';

import {MAPBOX_API_KEY} from './constants'
var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');


const StyledPopup = styled.div`
  background: white;
  color: #3f618c;
  font-weight: 400;
  padding: 5px;
  border-radius: 2px;
`;

// Initialisation of the Map component with a mapbox API_KEY. See https://www.mapbox.com/
const Map = ReactMapboxGl({
  accessToken:MAPBOX_API_KEY
});

// Bounds of the cities. I updated some values because someones doesn't match with the real city. 
const cities = {
  paris: {
    bounds: mapboxgl.LngLatBounds.convert([[2.3291015625, 48.83579746243092], [2.373046875, 48.86471476180278]]).toArray()
  },
  newyork: {
    bounds: mapboxgl.LngLatBounds.convert([[-74.67718186441802, 40.40057264073772], [-73.51243870453973, 41.06928944867016]]).toArray()
  },
  sarcelles: {
    bounds: mapboxgl.LngLatBounds.convert([[2.341007932433257, 48.970197013074795], [2.420165500404323, 49.009554150225256]]).toArray()
  },
  berlin: {
    bounds: mapboxgl.LngLatBounds.convert([[13.217500793878457, 52.45509602483412], [13.577954522064402, 52.563721188708115]]).toArray()
  },
  bogota: {
    bounds: mapboxgl.LngLatBounds.convert([[-74.49692513843868, 4.247312397253026], [-73.71815482360886, 4.835534969080413]]).toArray()
  }
};

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { weatherData: {}, bounds: cities.newyork.bounds }
    this.handleStationClick = this.handleStationClick.bind(this)
    this.changeLocation = this.changeLocation.bind(this)
  }

  handleStationClick(station) {
    var name = station._id //Mac address of the netamo system
    var position = station.place.location //GPS coordinates of the system
    var information = {} //Information ( temperature , humidity and pressure only) sended by the system

    //Here we identify all the json keys (because it's the mac address, impossible to predict)
    var keys = Object.keys(station.measures);
    //For each json key we read the information sended by the device
    keys.forEach(key => {
      var sensor = station.measures[key]
      for (var i = 0; sensor.type !== undefined && i < sensor.type.length; i++) {
        //filter in order to have only the temperature, humidity and pressure
        if (sensor.type[i] === "temperature" || sensor.type[i] === "humidity" || sensor.type[i] === "pressure") {
          var time = Object.keys(sensor.res)
          information[sensor.type[i]] = sensor.res[time][i]
        }
      }
    })
    this.setState({ details: true, netatmoStationName: name, netatmoStationPosition: position, netatmoStationInformation: information })

  }

  changeLocation(city) {
    this.setState({ bounds: cities[city].bounds })
  }

  render() {
    return (
      <div>
        <Navbar bg="light" expand="lg">
          <Navbar.Brand href="#home"><WbSunnyOutlinedIcon className="d-inline-block align-top" style={{ fontSize: 30 }} />{' '}N-Weather</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link onClick={() => this.changeLocation("sarcelles")}>Home</Nav.Link>
              <NavDropdown title="City" id="basic-nav-dropdown">
                <NavDropdown.Item onClick={() => this.changeLocation("paris")}>Paris</NavDropdown.Item>
                <NavDropdown.Item onClick={() => this.changeLocation("newyork")}>New York</NavDropdown.Item>
                <NavDropdown.Item onClick={() => this.changeLocation("berlin")}>Berlin</NavDropdown.Item>
                <NavDropdown.Item onClick={() => this.changeLocation("bogota")}>Bogota</NavDropdown.Item>
                <NavDropdown.Item onClick={() => this.changeLocation("sarcelles")}>Sarcelles</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Map
          style="mapbox://styles/mapbox/streets-v9"
          containerStyle={{
            height: '100vh',
            width: '100vw'
          }}
          fitBounds={this.state.bounds}

          onStyleLoad={(map, loadEvent) => { getWeatherData(map.getBounds().getNorthEast().wrap().lat, map.getBounds().getNorthEast().wrap().lng, map.getBounds().getSouthWest().wrap().lat, map.getBounds().getSouthWest().wrap().lng).then(res => this.setState({ weatherMap: res })) }}
          onMoveEnd={(map, loadEvent) => {getWeatherData(map.getBounds().getNorthEast().wrap().lat, map.getBounds().getNorthEast().wrap().lng, map.getBounds().getSouthWest().wrap().lat, map.getBounds().getSouthWest().wrap().lng).then(res => this.setState({ weatherMap: res })) }}
        >
          <Layer type="symbol" layout={{ "icon-image": "circle-15", 'icon-size': 2 }}>
            {typeof this.state.weatherMap !='undefined' && typeof this.state.weatherMap["body"] != 'undefined' && this.state.weatherMap.body.map((station, index) => {
              return <Feature key={index} coordinates={station.place.location} onClick={() => this.handleStationClick(station)} />
            })}
          </Layer>

          {
            this.state.details &&
            <Popup key={this.state.netatmoStationName} coordinates={this.state.netatmoStationPosition}>
              <StyledPopup>
                <div>id : {this.state.netatmoStationName}</div>
                <div>Temperature : {this.state.netatmoStationInformation.temperature + '°C'}</div>
                <div>Humidity : {this.state.netatmoStationInformation.humidity + ' %'}</div>
                <div>Pressure : {this.state.netatmoStationInformation.pressure + ' mBar'}</div>
              </StyledPopup>
            </Popup>
          }

        </Map>
      </div>
    );
  }
}

export default App;
