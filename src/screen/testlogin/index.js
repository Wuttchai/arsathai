import * as React from 'react';
import MapView from 'react-native-maps'; 
export default class MyMapView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: [],
    };
  }

  addMarker(coordinates) {
    this.setState({
      markers: [{ latitude: coordinates.latitude, longitude: coordinates.longitude }]
    });
  }

  render() {
    console.log(this.state.markers)
    return (
      <MapView
      showsUserLocation
      style={{ flex: 1 ,height:300,marginLeft:"5%",marginRight:"5%",marginBottom:"5%" }}
      mapType={MAP_TYPES.HYBRID}
      initialRegion={{
        latitude:this.state.latitude,  
        longitude:this.state.longitude,
        latitudeDelta: 0.0022,
        longitudeDelta: 0.0121,
      }} 
        onPress={event => this.addMarker(event.nativeEvent.coordinate)}
      > 
        {this.state.markers.map(marker =>
          (<MapView.Marker
            key={marker.index}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
          />)
        )}
      </MapView>
    );
  }
}