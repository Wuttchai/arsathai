import React from 'react';
import { Button, StyleSheet, View, Text,TouchableHighlight } from 'react-native';
import { Badge } from 'react-native-elements'
import { Ionicons } from '@expo/vector-icons';
import { ImagePicker } from 'expo';
import CameraRollPicker from 'react-native-camera-roll-picker'; 
import Camera from "../listitem/camera";

export default class ImagePickerExample extends React.Component {   
    constructor(props) {
        super(props);
        this.state = {
            num:0,
            numca:0,
            image: [],
            gallery:false,
            header:null
        }
      } 
    
   buttonclick(status){
    if(status == 'เลือกจากคลั่ง'){
      this.setState({gallery: !this.state.gallery,header: !this.state.header })
    }else{
      this.setState({camera: !this.state.camera,header: !this.state.header })
    }       
   }
      
  myImages(images){
      
        this.setState({
            num:images.length,
            image: this.state.image.concat([images.uri])
        })
        console.log(images)
  }
  render() {     
    return (      
      <View style={{  marginTop:10  }}>
      <View style={styles.buttonContainer}>                   
       <Button title={this.state.num > 0 ? "เลือกจากคลั่ง : "+this.state.num : "เลือกจากคลั่ง"} color="#00c910" onPress={() => this.buttonclick('เลือกจากคลั่ง')} />                       
       </View> 
       <View style={ styles.buttonContainer}>          
       <Button   title={this.state.numca > 0 ? " กล้องถ่ายรูป : "+this.state.num : " กล้องถ่ายรูป "} color="#00c910" onPress={() => this.buttonclick('กล้องถ่ายรูป')} />                             
       </View> 
      

            {this.state.gallery ? (
                 <View style={{  alignItems: 'center', justifyContent: 'center',marginTop:10,height:200  }}>
                 <Text style={{marginTop:20}}>
                {this.state.num} Image selected
                </Text>
                <CameraRollPicker  callback={this.myImages.bind(this)} />
                 </View>
            ):null} 
              {this.state.camera ? (
              <Camera />
              ):null} 

      </View>
    );
  }
  
 
}
const styles = StyleSheet.create({

  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom:20, 
}
});