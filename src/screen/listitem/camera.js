import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Dimensions, Button, Image, Alert } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
const { width } = Dimensions.get('window')

export default class CameraExample extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    photos: [],
    selected: {},
    num:this.props.num,
    after: null,
    has_next_page: true
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }
   
  async snap() {
    if (this.state.num == 5){
      Alert.alert(
        'สามารถเพิ่มรูปได้ 5รูป',
        ' ',
        [  
          {text: 'ตกลง', onPress: () => { return; }},
        ],
        {cancelable: false},
      );
    }else{
      if (this.camera) { 
        const options = {  skipProcessing: true,exif: true};
        await this.camera.takePictureAsync(options).then(photox => {
         photox.exif.Orientation = 1;        
           this.setState({            
             photos: this.state.photos.concat(photox),
             num:this.state.num+1
           })          
            });     
      }
    }
 

    }
    renderImage(item, i) {  
      return(
        <TouchableOpacity
        onLongPress ={()=>this.handlerLongClick(i)} 
        //Here is the trick
        activeOpacity={0.6}
        style={styles.button}>       
        <Image
          style={{ width: 100, height: 100,marginRight:"5%",marginBottom:(i+1) % 3 == 0 ? 10 : 0 }}
          source={{uri: item.uri}}
          key={i}
        />
      </TouchableOpacity>
        
      )
    }
    handlerLongClick = (index) => {  
     Alert.alert(
        'ลบรูปภาพ',
        ' ',
        [
           {
            text: 'ยกเลิก',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'ยืนยัน', onPress: () => {
             
            this.setState({ 
              photos: this.state.photos.filter((_, i) => i !== index),
              num:this.state.num-1
            })
            }},
        ],
        {cancelable: false},
      );
  
    };
    prepareCallback() {
  
      this.props.callback(this.state.photos,this.props.report_keyword,this.props.report_detail)
       
    }
    renderHeader = () => { 
      let headerText = 'มีรูปภาพอยู่ : '+this.state.num;
      if (this.state.num === 5) headerText = headerText + ' (Max)';
      return (
        <View style={styles.header}>
          <Button
            title="ยกเลิก"
            onPress={() => this.props.callback(undefined,this.props.report_keyword,this.props.report_detail)}
          />
          <Text>{headerText}</Text>
          <Button
            title="ยืนยัน"
            onPress={() => this.prepareCallback()}
          />
          
        </View>
        
      )
    }
    _renderCancel() {
      if (this.state.photos.length != 0) {
          return (
            <View  style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}> 
        
        {this.state.photos.map((item,i) => this.renderImage(item,i))}
       </View>
          );
      } else {
          return null;
      }
    } 
    renderImages() {
      return(
        <Camera ref={ (ref) => {this.camera = ref} } style={{ flex: 1 }} type={this.state.type}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            style={{
              flex: 0.1,
              alignSelf: 'flex-end',
              alignItems: 'center',
              
            }}
            onPress={() => {
              this.setState({
                type:
                  this.state.type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back,
              });
            }}>
            <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> สลับ </Text>
          </TouchableOpacity>
          <TouchableOpacity  onPress={this.snap.bind(this)}   style={{
              flex: 0.8,
              alignSelf: 'flex-end',
              alignItems: 'center',
              
            }} >
            <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> ถ่ายภาพ </Text>
          </TouchableOpacity>
        </View>
      </Camera>
      )
    }
    
  render() {
      
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1,height:200 }}>
        {this.renderHeader()}       
        {this._renderCancel()}
        {this.renderImages()}
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 50,
    width: width,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: 20
  },
})