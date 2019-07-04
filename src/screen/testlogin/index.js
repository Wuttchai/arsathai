import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native';
import { RNCamera } from 'react-native-camera';

export default class BadInstagramCloneApp extends Component {
  constructor(props){
    super(props);
    this.state = {
      isVisible: false,
      pictureType: null,
      value1: null,
      value2: null
    }
  }
  initTakingPicture = (pictureType) => {
    this.setState({
      isVisible: true,
      pictureType: pictureType
    })
  }
  async componentDidMount(){ 
    console.disableYellowBox = true; 
    const {status} = await Permissions.getAsync(Permissions.LOCATION) 
    const { statusca } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: statusca === 'granted' });
     
      if(status !== 'granted'){
          const {response} = await Permissions.askAsync(Permissions.LOCATION)
      }
      await   navigator.geolocation.getCurrentPosition(
        ({ coords: {latitude, longitude } }) =>  this.setState({latitude, longitude})
      )

  }
  takePicture = async function() {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
      let fieldToSave = "value1" // Fallback
      if (this.state.pictureType === "A") {
        // Operation you need to do for pictureType A
        fieldToSave = "value1"
      } else if (this.state.pictureType === "B") {
        // Operation you need to do for pictureType B
        fieldToSave = "value2"
      } 

      this.setState({
        isVisible: false,  
        pictureType: null,
        [fieldToSave]: data.uri
      });
    }
  };
  render() {
    return (
        <View style={styles.subcontainer}>
          {this.state.isVisible === true
              ?
                <View style={styles.container}>
                  <RNCamera
                      ref={ref => {
                        this.camera = ref;
                      }}
                      style={styles.preview}
                      type={RNCamera.Constants.Type.back}
                      flashMode={RNCamera.Constants.FlashMode.on}
                      permissionDialogTitle={'Permission to use camera'}
                      permissionDialogMessage={'We need your permission to use your camera phone'}
                      onGoogleVisionBarcodesDetected={({ barcodes }) => {
                        console.log(barcodes);
                      }}
                  />
                  <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
                      <Text style={{ fontSize: 14 }}> SNAP </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              :
                <View>
                  <Button title='PHOTO 1' onPress={() => this.initTakingPicture("A")}/>
                  <Button title='PHOTO 2' onPress={() => this.initTakingPicture("B")}/>
                  <Button title='SHOW RESULTS' onPress={this.showResults}/>
                </View>
          }
        </View>
    );
  }

  changeState = () =>{
    this.setState({isVisible: true})
  }

  changeState2 = () =>{
    this.setState({isVisible: true})
  }

  showResults = () => {
    console.log('VALUE1: ' + this.state.value1);
    console.log('VALUE2: ' + this.state.value2);
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black'
  },
  subcontainer: {
    flex: 1,
    flexDirection: 'column',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});