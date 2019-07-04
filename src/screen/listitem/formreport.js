import React from "react";
import { View, Button, Image, StyleSheet, CheckBox, ScrollView, TouchableOpacity, Alert, TouchableHighlight, AsyncStorage } from "react-native";   
import { Input, Text  } from 'react-native-elements'; 
import { Camera } from 'expo-camera';
import {Permissions} from 'expo'
import MapView, {
  MAP_TYPES 
} from 'react-native-maps'; 
import * as FileSystem from 'expo-file-system';
import base64 from 'base-64';
import { Ionicons } from '@expo/vector-icons';
import ImageBrowser from './image';
export default class App extends React.Component { 
  constructor(props) {
    super(props);  
    this.scroll = null;
    this.state = {
        namereport:this.props.navigation.state.params.namereport,
        num:0, 
        image: [],
        gallery:false,
        header:null,
        header:null,
        check1:false,
        check2:false,
        latitude:null,
        longitude:null,
        report_detail:"",
        report_keyword:"",
        type: Camera.Constants.Type.back,
        imageBrowserOpen: false,
        photos: [] 
    }
  }   
  static navigationOptions = { 
    title: 'รายงาน',
    headerStyle: {
      backgroundColor: '#83c336',
    },
    headerTintColor: 'white'
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
  renderImage(item, i) { 
    return(
      <TouchableOpacity
      onLongPress ={()=>this.handlerLongClick(this,i)} 
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
  imageBrowserCallback = (callback) => {
    callback.then((photos) => {
      console.log(photos)
      this.setState({
        imageBrowserOpen: false,
        photos
      })
    }).catch((e) => console.log(e))
  }
  
  handlerLongClick = (index) => { 
    

    Alert.alert(
      'ลบรูปภาพ', 
      [ 
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK',  onPress: () => {
          let newlist = this.state.image.splice(index,1) 
          this.setState({
            image: newlist
          })
          } },
      ],
      {cancelable: false},
    );


  };
  async buttonclick(status){
    if(await status == 'เลือกจากคลั่ง'){
       this.setState({
         gallery: !this.state.gallery,
         header: !this.state.header,
         camera: false 
        })
    }else{
       this.setState({
        camera: !this.state.camera,
        header: !this.state.header,
        gallery: false 
      })
    } 
    this.scroll.scrollToEnd();  
   }
   async snap() {   
       
    if (this.camera) { 
       const options = {  skipProcessing: true,exif: true};
       await this.camera.takePictureAsync(options).then(photox => {
        photox.exif.Orientation = 1;        
          this.setState({ 
            photos: this.state.photos.concat(photox)
          })            
           });     
     }
    }   
  


    
  imageBrowserCallback = (callback) => {
    callback.then((photos) => { 
      this.setState({
        imageBrowserOpen: false,
        photos
      })
    }).catch((e) => console.log(e))
  }
  imgupload(){
    let perfix_img = Date.now()
    let random = Math.floor(Math.random()*100)
    let img_file_name = perfix_img+"_"+random+".jpg"
    let data = {
      fileKey: 'photo',
      fileName: img_file_name,
      chunkedMode: false,
      httpMethod: 'post',
      mimeType: "image/jpeg",
      headers: {}
     }

    let image = []
    this.state.image.map((item) => { 
      image = image.concat('data:image/jpeg;base64,' +item)
    })
    console.log(image)

    fetch(image, 'http://www.nevt.deqp.go.th/DEQP_NEVT/nevt_v2/api_upload.php', {
      method: "post",
      headers: {
        Accept: "application/x-www-form-urlencoded"
      },
      body: data,
    }).then(res => res.json())
      .then(res => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  }


  submit(){
   // this.imgupload()
    

    let report =  {};
    report.report_lat = this.state.latitude
    report.report_lng = this.state.longitude
    report.reportcat_id = this.props.navigation.state.params.reportcat_id
    report.reportcat_name  = this.props.navigation.state.params.namereport
    report.user_id  = this.props.navigation.state.params.user.user_id
    report.report_detail = this.state.report_detail
    report.report_keyword = this.state.report_keyword
    report.action = "insert"
    report.report_img1 = "testinsert.jpg"
    report.base64Image = "insert"

    let data =  JSON.stringify(report)

    let datafail = [];
    datafail.reportcat_icon = this.props.navigation.state.params.iconreport
    datafail.reportcat_thname = this.props.navigation.state.params.namereport
    datafail.report_detail = this.state.report_detail

    AsyncStorage.setItem("Datafail", datafail);
    fetch("http://www.nevt.deqp.go.th/DEQP_NEVT/nevt_v2/api/api_set_report.php", {
      method: "post", 
      body: data,
    }).then(res => res.json())
      .then(res => { 
        if(res.status === "success"){
          AsyncStorage.setItem("Datafail", data);  
          Alert.alert(
            "สำเร็จ!",
            "รายงานผลเรียบร้อย!",
            [{ text: "OK"}]
          );
        }      
      })
      .catch(err => {  
          AsyncStorage.setItem("Datafail", data);  
        Alert.alert(
          "ล้มเหลว!",
          "ไม่สามารถรายงานผลได้!",
          [{ text: "OK" }]
        );
      });   
  }

    render() { 
      if (this.state.imageBrowserOpen) {
        return(<ImageBrowser max={5} callback={this.imageBrowserCallback}/>);
      }
      return (
        
          <ScrollView ref={(scroll) => {this.scroll = scroll;}} contentContainerStyle={styles.contentContainer}>
        <View >   
                    <Text h3 style={styles.paragraph}>รายงาน : {this.state.namereport}</Text> 
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
      />

        <Input 
           style={styles.inputs}   
           label="รายละเอียด" 
           onChangeText={(detail) => this.setState({report_detail:detail})}/>
        <Input 
           style={styles.inputs}   
           label="KeyWord" 
           onChangeText={(keyword) => this.setState({report_keyword:keyword})}/>
         

   <View style={{ flexDirection: 'column',marginTop: 10}}> 
  <View style={{ flexDirection: 'row' }}>
    <CheckBox
    style={styles.checkBox}
      value={this.state.check1}
      onValueChange={() => this.setState({ check1: !this.state.check1 })}
    />
    <Text style={{marginTop: 5}}> เหตุการ์ณเร่งด่วน</Text>
  </View>
</View>

         <View
  style={{
    borderBottomColor: 'black',
    borderBottomWidth: 0.5,
    marginLeft: "7%",
    marginRight: "3%"
  }}
/>

<View style={{ flexDirection: 'column'}}> 
  <View style={{ flexDirection: 'row' }}>
    <CheckBox
    style={styles.checkBox}
      value={this.state.check2}
      onValueChange={() => this.setState({ check2: !this.state.check2 })}
    />
    <Text style={{marginTop: 5}}> Hotspot</Text>
  </View>
</View>
 
<View  style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}> 
        
 {this.state.photos.map((item,i) => this.renderImage(item,i))}
</View> 

    <View style={{  marginTop:10  }}>
      <View style={styles.buttonContainer}>                   
      <TouchableHighlight
  onPress={() => this.setState({imageBrowserOpen: true})} style={styles.btnClickContain}
  underlayColor='#042417'>
  <View
    style={styles.btnContainer}>
 <Ionicons name="md-image"  size={32} color="white"  />                     
      
    <Text style={styles.btnText}>เลือกจากคลั่ง</Text>
  </View>
</TouchableHighlight>
</View> 
       
       
<TouchableHighlight
  onPress={() => this.buttonclick('xxxxx')} style={styles.btnClickContain}
  underlayColor='#042417'>
  <View
    style={styles.btnContainer}>
 <Ionicons name="md-camera"  size={32} color="white"   />                     
      
    <Text style={styles.btnText}> กล้องถ่ายรูป </Text>
  </View>
</TouchableHighlight>
 
      

          
              {this.state.camera ? (
               <View style={{ flex: 1,height:200 }}>
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
                     <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Flip </Text>
                   </TouchableOpacity>
                   <TouchableOpacity  onPress={this.snap.bind(this)}   style={{
                       flex: 0.8,
                       alignSelf: 'flex-end',
                       alignItems: 'center',
                       
                     }} >
                     <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> capture </Text>
                     
                   </TouchableOpacity>
                 </View>
               </Camera>
               
             </View>
              ):null}  

<View style={{ marginTop: 20,flex: 1, marginBottom: 10 }}> 
    
<TouchableHighlight
  onPress={() => this.submit()} style={styles.btnClickContain2}
  underlayColor='#042417'>
  <View
    style={styles.btnContainer}>               
      
    <Text style={styles.btnText}> ส่งรายงาน </Text>
  </View>
</TouchableHighlight>   
</View>
 
      </View>      
        </View>
        </ScrollView>
      );
    }
  }

  const styles = StyleSheet.create({
    contentContainer: { 
      //paddingVertical: 50
    },
    container: {
      flex: 1, 
      backgroundColor: 'white',
      padding: 8, 
    },
    checkBox:{
      marginLeft: "5%",
    },
    paragraph: { 
      textAlign: 'center',
      paddingBottom: "10%",
    }, 
    buttonContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      marginBottom:20, 
  },
  btnClickContain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height:50,
    backgroundColor: '#83c336',  
    marginRight: 20, 
    marginLeft: 20,
  }, 
  btnClickContain2: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height:50,
    backgroundColor: '#0418ed',  
    marginRight: 20,
    marginLeft: 20,
  }, 
  btnContainer: { 
    flexDirection: 'row',
    justifyContent: 'center',  
  },
  btnIcon: { 
  },
  btnText: {
    fontSize: 18,
    color: '#FAFAFA',
    marginLeft: 10,
    marginTop: 2,
  }
  });

  