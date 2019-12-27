import React from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { divIcon } from 'leaflet';

import { locations } from "../data.json";
import "./MapsPage.less";

const ConfirmationPopup = ({position, addThisPoint, dismissPoint}) => (
  <Popup className='confirmation_popup' position={position}>
    <div>
      Add this point?<br />
      <button onClick={addThisPoint}>Yes</button>
      <button onClick={dismissPoint}>No</button>
    </div>
  </Popup>
)

const CategoryMarkers = ({checkboxes}) => 
  checkboxes.map(({checked, value}, index) => {
    if(checked) {
      const categoryIcon = divIcon({
        html: value.icon,
        className: 'custom-leaflet-icon'
      });
      return value.positions.map((placePosition, subIndex) => <Marker key={index + '.' + subIndex} icon={categoryIcon} position={placePosition} />)
    }
  })


export default class MapsPage extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      position: [46.29,30.44],
      popupData: undefined,
      markers: JSON.parse(localStorage.getItem('savedMarkers') || '[]'),
      checkboxes: Object.entries(locations).map(([key, value]) => {
        return { checked: false, value, key}
      })
    };

    this.obtainPosition = this.obtainPosition.bind(this);
    this.onContextMenu = this.onContextMenu.bind(this);
    this.addThisPoint = this.addThisPoint.bind(this);
    this.dismissPoint = this.dismissPoint.bind(this);
    this.onPopupClose = this.onPopupClose.bind(this);
    this.saveMarkers = this.saveMarkers.bind(this);
    this.clearMarkers = this.clearMarkers.bind(this);
    this.checkboxChange = this.checkboxChange.bind(this);

    this.obtainPosition();
  }

  obtainPosition() {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    navigator.geolocation.getCurrentPosition(({coords}) => {
      this.setState({
        position: [
          coords.latitude,
          coords.longitude
        ]
      })
    }, (err) => {
      console.log(err);
    }, options)
  }

  onContextMenu(ev) {
    this.setState({
      popupData: {
        unconfirmed: true,
        position: [ev.latlng.lat, ev.latlng.lng]
      }
    })
  }

  addThisPoint() {

    const { popupData, markers } = this.state;

    this.setState({
      markers: [...markers, popupData.position]
    });

    this.dismissPoint();
  }

  dismissPoint() {
    this.setState({
      popupData: null
    })
  }

  onPopupClose(ev) {
    const popupNodeElement = ev.popup._container;
    if(popupNodeElement.className.indexOf('confirmation_popup') > -1) {
      this.dismissPoint();
    }
  }

  saveMarkers() {
    localStorage.setItem('savedMarkers', JSON.stringify(this.state.markers));
    this.forceUpdate();
  }

  clearMarkers() {
    localStorage.removeItem('savedMarkers');
    this.setState({
      markers: []
    })
  }

  checkboxChange(ev) {
    let { checkboxes } = this.state;
    checkboxes.forEach(checkbox => {
      if(checkbox.key == ev.target.value)
        checkbox.checked = ev.target.checked
    });
    this.setState({
      checkboxes
    })
  }

  render() {
    const existingMarkers = localStorage.getItem('savedMarkers');

    const iconMarkup = renderToStaticMarkup(<i className=" fa fa-map-marker-alt fa-3x" />);
    const customMarkerIcon = divIcon({
      html: iconMarkup,
      className: 'custom-leaflet-icon'
    });

    return (
      <>
        <div id='map_main'>
          <Map onPopupClose={this.onPopupClose} onContextMenu={this.onContextMenu} style={{width: '800px', height: '800px'}} center={this.state.position} zoom={13}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            />
            <Marker position={this.state.position}>
              <Popup>Your location</Popup>
            </Marker>
            {this.state.markers.map((markerPosition, index)=> (
              <Marker key={index} icon={customMarkerIcon} position={markerPosition} />
            ))}
            <CategoryMarkers checkboxes={this.state.checkboxes} />
            {this.state.popupData && <ConfirmationPopup 
                position={this.state.popupData.position} 
                addThisPoint={this.addThisPoint}
                dismissPoint={this.dismissPoint} />}
          </Map>
        </div>
        <div id='storage_markers_controls'>
          {existingMarkers && <button onClick={this.clearMarkers}>Remove saved markers (from cache and map)</button>}
          <br />
          {this.state.markers.length > 0 && <button onClick={this.saveMarkers}>Save added markers data</button>}
          <ul>
            {this.state.checkboxes.map(({checked, key, value}, index) => (
              <li key={index}>
                <label>
                  <input value={key} onChange={this.checkboxChange} onClick={this.checkboxChange} checked={checked} type='checkbox' />
                  <span dangerouslySetInnerHTML={{ __html: value.icon}} /> 
                </label>
                {key}
              </li>
            ))}
          </ul>
        </div>
      </>
    )
  }

}