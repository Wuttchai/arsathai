import React from 'react'; 
import  {Permissions,MapView} from 'expo'
export default class App extends React.Component {
  state = {
    latitude:null,
    longitude:null
  }

    async componentDidMount(){ 
      const {status} = await Permissions.getAsync(Permissions.LOCATION)
      console.log("ปปปปป");
        if(status !== 'granted'){
            const {response} = await Permissions.askAsync(Permissions.LOCATION)
        }

        await   navigator.geolocation.getCurrentPosition(
          ({ coords: {latitude, longitude } }) =>  this.setState({latitude, longitude})
        )

    }


  render() { 
    console.disableYellowBox = true; 
    return (         
      <MapView
        showsUserLocation
        style={{ flex: 1,paddingBottom: "10%",height:200}}
        initialRegion={{
          latitude:this.state.latitude,  
          longitude:this.state.longitude,
          latitudeDelta: 0.0022,
          longitudeDelta: 0.0121,
        }}
      />
    );
  }
}