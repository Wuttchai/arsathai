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
import ImageCamera from './camera';
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
        butsubmit:true,
        check1:false,
        check2:false,
        latitude:null,
        longitude:null,
        report_detail:"",
        report_keyword:"",
        type: Camera.Constants.Type.back,
        imageBrowserOpen: false,
        imageCameraOpen:false,
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
    const { testtt } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
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
      onLongPress ={()=>this.handlerLongClick(i)} 
      //Here is the trick
      activeOpacity={0.6}
      style={styles.button}>       
      <Image
        style={{ width: 100, height: 100,marginRight:10,marginBottom:(i+1) % 3 == 0 ? 10 : 0 }}
        source={{uri: item.uri}}
        key={i}
      />
    </TouchableOpacity>
      
    )
  }

  
  handlerLongClick = (index) => {  
    let me = this
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
           me.setState({ 
             photos: this.state.photos.filter((_, i) => i !== index)
           })
           }},
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
   
   imageBrowserCallback = (callback,report_keyword,report_detail) => { 
    callback.then((photos) => { 
      this.setState({
        imageBrowserOpen: false, 
        photos: this.state.photos.concat(photos),
        report_detail : report_detail,
        report_keyword :report_keyword ,
      })
    }).catch((e) => console.log(e))
  }
  imageCameraCallback = (callback,report_keyword,report_detail) => {  
    let data = [];
    if(callback !=  undefined)   {
        data = this.state.photos.concat(callback)
    }else{
      data = this.state.photos
    }
  this.setState({
    imageCameraOpen: false, 
    photos: data,
    report_detail : report_detail,
    report_keyword :report_keyword ,
})
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
  async imgupload(){
   let me = this
    this.state.photos.map((item) => {
      let perfix_img = Date.now()
      let random = Math.floor(Math.random()*100)
      let img_file_name = perfix_img+"_"+random+".jpg"
      const data = new FormData();

 data.append('photo', {
  uri: item.uri,
  type: 'image/jpeg', // or photo.type
  name: img_file_name
});    

      fetch('http://www.nevt.deqp.go.th/DEQP_NEVT/nevt_v2/api_upload.php', {
        method: 'post',
        body: data
      }).then(res => {
        me.setState({image:me.state.image.concat(img_file_name)})  
      }) .catch(err => {  
        let date = new Date(); 
        let month = ''; 
        let day = ''; 
          if(date.getMonth() <= 9 ){
           month = '0'+date.getMonth()
          }else{
             month = date.getMonth() 
          }
          if(date.getDate() <= 9 ){
            day = '0'+date.getDate() 
          }else{
            day = date.getDate() 
          }
          let timestamp = date.getFullYear()+"-"+month+"-"+day
          let reportfail = [];
          reportfail.push({
            reportcat_thname: me.props.navigation.state.params.namereport,
            report_detail : me.state.report_detail,
            report_timestamp:timestamp,
            report_icon:me.props.navigation.state.params.iconreport,
          }); 
          
          let datafail = []  
          
          AsyncStorage.getItem("Datafail").then((value) => {   
            if(value == null){  
              datafail = JSON.stringify(reportfail)   
              AsyncStorage.setItem("Datafail", datafail);
            }else{  
              datafail = JSON.parse(value).concat(reportfail)
              
              AsyncStorage.setItem("Datafail", JSON.stringify(datafail));
            } 
         }).done(); 
           Alert.alert(
          "ล้มเหลว!",
          "ไม่สามารถรายงานผลได้!",
          [{ text: "ตกลง" }]
        );
      });
          
    })
    this.submit(data);
  }

  getdata(){
    this.setState({
      butsubmit :false
    })  
    let me = this 
    let dataimg = [] 
    let numimg = this.state.photos.length
      return   this.state.photos.map((item,i) => {
         
        let perfix_img = Date.now()
        let random = Math.floor(Math.random()*100)
        let img_file_name = perfix_img+"_"+random+".jpg"
        const data = new FormData();
  
   data.append('photo', {
    uri: item.uri,
    type: 'image/jpeg', // or photo.type
    name: img_file_name
  });    
  dataimg = dataimg.concat(img_file_name)
        fetch('http://www.nevt.deqp.go.th/DEQP_NEVT/nevt_v2/api_upload.php', {
          method: 'post',
          body: data
        }).then(res => {
          me.setState({image:me.state.image.concat(img_file_name)}) 
          if(numimg === i+1){
          let report =  {};
          report.report_lat = me.state.latitude
          report.report_lng = me.state.longitude
          report.reportcat_id = me.props.navigation.state.params.reportcat_id
          report.reportcat_name  = me.props.navigation.state.params.namereport
          report.user_id  = me.props.navigation.state.params.user.user_id
          report.report_detail = me.state.report_detail
          report.report_keyword = me.state.report_keyword
          report.action = "insert" 
          report.report_img1 = dataimg[0] != undefined ? dataimg[0] : ''
          report.report_img2 = dataimg[1] != undefined ? dataimg[1] : ''
          report.report_img3 = dataimg[2] != undefined ? dataimg[2] : ''
          report.report_img4 = dataimg[3] != undefined ? dataimg[3] : ''
          report.report_img5 = dataimg[4] != undefined ? dataimg[4] : ''   
          report.base64Image = "insert" 
          let data =  JSON.stringify(report)
        fetch("http://www.nevt.deqp.go.th/DEQP_NEVT/nevt_v2/api/api_set_report.php", {
            method: "post", 
            body: data,
          }).then(res => res.json())
            .then(res => { 
              if(res.status === "success"){ 
                Alert.alert(
                  "สำเร็จ!",
                  "รายงานผลเรียบร้อย!",
                  [{ text: "ตกลง", onPress: () => {         
                    this.props.navigation.navigate('listitem')
                    }}]
                );
              }      
            })
            .catch(err => {  
              let date = new Date(); 
              let month = ''; 
              let day = ''; 
                if(date.getMonth() <= 9 ){
                 month = '0'+date.getMonth()
                }else{
                   month = date.getMonth() 
                }
                if(date.getDate() <= 9 ){
                  day = '0'+date.getDate() 
                }else{
                  day = date.getDate() 
                }
                let timestamp = date.getFullYear()+"-"+month+"-"+day
                let reportfail = [];
                reportfail.push({
                  reportcat_thname: me.props.navigation.state.params.namereport,
                  report_detail : me.state.report_detail,
                  report_timestamp:timestamp,
                  report_icon:me.props.navigation.state.params.iconreport,
                }); 
                
                let datafail = []  
                
                AsyncStorage.getItem("Datafail").then((value) => {   
                  if(value == null){  
                    datafail = JSON.stringify(reportfail)   
                    AsyncStorage.setItem("Datafail", datafail);
                  }else{  
                    datafail = JSON.parse(value).concat(reportfail)
                    
                    AsyncStorage.setItem("Datafail", JSON.stringify(datafail));
                  } 
               }).done(); 
                 Alert.alert(
                "ล้มเหลว!",
                "ไม่สามารถรายงานผลได้!",
                [{ text: "ตกลง" }]
              );
            });
          } 
        });
            
      })
     
  }
 async warningdata(){
    return await this.getdata()   
 }   

  submit(){
    this.warningdata()
     
  }

    render() { 
      if (this.state.imageBrowserOpen) { 
        return(<ImageBrowser max={5-this.state.photos.length} report_keyword={this.state.report_keyword} report_detail={this.state.report_detail} num={this.state.photos.length} callback={this.imageBrowserCallback}/>);
      }
      if (this.state.imageCameraOpen) {
        return(<ImageCamera max={5-this.state.photos.length} report_keyword={this.state.report_keyword} report_detail={this.state.report_detail} num={this.state.photos.length} callback={this.imageCameraCallback}/>);
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
           value={this.state.report_detail}
           onChangeText={(detail) => this.setState({report_detail:detail})}/>
        <Input 
           style={styles.inputs}   
           label="KeyWord" 
           value={this.state.report_keyword}
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
 
<View  style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap',marginLeft:10}}> 
        
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
  onPress={() => this.setState({imageCameraOpen: true})} style={styles.btnClickContain}
  underlayColor='#042417'>
  <View
    style={styles.btnContainer}>
 <Ionicons name="md-camera"  size={32} color="white"   />                     
      
    <Text style={styles.btnText}> กล้องถ่ายรูป </Text>
  </View>
</TouchableHighlight>
 
       

<View style={{ marginTop: 20,flex: 1, marginBottom: 10 }}> 
    
<TouchableHighlight
  onPress={() => this.state.butsubmit ? this.submit() : null} style={styles.btnClickContain2}
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

  