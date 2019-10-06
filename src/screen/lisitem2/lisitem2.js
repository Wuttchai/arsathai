import React from 'react';
import { View, KeyboardAvoidingView, Picker, ActivityIndicator, Image, StyleSheet  , ScrollView, TouchableOpacity, Alert, TouchableHighlight, AsyncStorage } from "react-native";   
 
import { ListItem, Badge,Input,Text  } from 'react-native-elements'
import { Camera } from 'expo-camera';
import {Permissions, ImagePicker} from 'expo'
import DatePicker from 'react-native-datepicker'
import { Ionicons } from '@expo/vector-icons';
import NavigationService from './../../NavigationService';
import MapView, {
  MAP_TYPES,
  Polygon,
  ProviderPropType,
} from 'react-native-maps'; 

import { createMaterialTopTabNavigator, createAppContainer, NavigationEvents} from 'react-navigation';
import Formreport from '../lisitem2/report'; 
const logoimg = require('../../../assets/icons/pang.jpg');
class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'รายงาน', 
    };
  };
  constructor(props) {
    super(props);   
    this.scroll = null;
    this.state = {
        namereport:'สร้างข้อมูลแปลง',
        num:0, 
        image: null,
        date:new Date(),
        date2:new Date(),   
        check1:false,
        check2:false,
        latitude:null,
        longitude:null,
        report_detail:"",
        report_keyword:"",
        type: Camera.Constants.Type.back, 
        listtree:[],
        province:[],
        amphur:[],
        polygonsx:[],
        district:[],
        projectaddress:[],
        project_moo:null,
        polygons: [],
        number_of_area:0,
        editing: null,
        creatingHole: false,
        province_id:null,
        amphur_id:null,
        district_id:null,
        greentype_id:null,
        project_address:null,
        project_percent:null,
        user:[],
        region:[]
    }
  }   
  static navigationOptions = { 
    title: 'รายงาน', 
  }
  finish() {
    const { polygons, editing } = this.state;
    this.setState({
      polygons: [...polygons, editing],
      editing: null,
      creatingHole: false,
    });
    this.calculateDistance(editing);
  }

  createHole(polygons) {
    
      this.setState({
        polygons:[],
        editing:null, 
      })
  }
  calculateDistance(polygons) { 
    let datalat = [];
    let num = 0
     polygons.coordinates.map(polygon => (
      datalat[num] = [polygon.latitude,polygon.longitude],
      num++
    ))  
    this.setState({
      polygonsx:datalat
    })
     
  }
  onPress(e) {
    const { editing, creatingHole } = this.state;
    if (!editing) { 
      this.setState({
        editing: {
          id: id++,
          coordinates: [e.nativeEvent.coordinate],
          holes: [],
        },
      });
    } else if (!creatingHole) {
      this.setState({
        editing: {
          ...editing,
          coordinates: [...editing.coordinates, e.nativeEvent.coordinate],
        },
      });
    } else {
      const holes = [...editing.holes];
      holes[holes.length - 1] = [
        ...holes[holes.length - 1],
        e.nativeEvent.coordinate,
      ];
      this.setState({
        editing: {
          ...editing,
          id: id++, // keep incrementing id to trigger display refresh
          coordinates: [...editing.coordinates],
          holes,
        },
      });
    }
  }
  async componentDidMount(){     
    console.disableYellowBox = true; 
    let me = this
    const {status} = await Permissions.getAsync(Permissions.LOCATION) 
    const { statusca } = await Permissions.askAsync(Permissions.CAMERA);
    var date = new Date(); 
    //date.setDate(date.getDate() + 3)
    this.setState({ 
      hasCameraPermission: statusca === 'granted',
      date2:date, 
     }); 
      if(status !== 'granted'){
          const {response} = await Permissions.askAsync(Permissions.LOCATION)
      }
      await   navigator.geolocation.getCurrentPosition(
        ({ coords: {latitude, longitude } }) =>  this.setState({latitude, longitude})
      )
      AsyncStorage.getItem("user").then((value) => {   
        if(value == null){     
          this.props.navigation.navigate('login')
        }else{
          datauser = JSON.parse(value);  
          this.setState({
            user:JSON.parse(value)
          })          
        } 
     }).done();   
     fetch("http://www.greenarea.deqp.go.th/api/api_get_province.php?fbclid=IwAR3K5dAOQE7AuXrpGsMjyqBQZNlw7u8ekePbj6oxKz5YjuowizCzPAXrUrc")
     .then((response) => response.json())
     .then((responseJson) => {    
             me.setState({
               province:responseJson
             })
     })
     fetch("http://www.greenarea.deqp.go.th/api/api_get_greentype.php?fbclid=IwAR2EqZup4goE4aV2fmVWpDcB-Jsld3K5TROW_8XwjSUysYEDI2vbvzOeWM0")
     .then((response) => response.json())
     .then((responseJson) => {   
             me.setState({
               listtree:responseJson
             })
     })
  }
  getdateall(){
    let me = this
    fetch("http://www.greenarea.deqp.go.th/api/api_get_greentype.php?fbclid=IwAR2EqZup4goE4aV2fmVWpDcB-Jsld3K5TROW_8XwjSUysYEDI2vbvzOeWM0")
    .then((response) => response.json())
    .then((responseJson) => {   
            me.setState({
              listtree:responseJson
            })
    }) 
  }

  province_select(data){
    let me = this
    this.setState({
      province_id:data
    })
    fetch("http://www.greenarea.deqp.go.th/api/api_get_amphur.php?province_id="+data+"&fbclid=IwAR2Tg1l3NMnGwTM1SaXnpc1oi0b0u74ttZdDvry_xttNPCkl8z58Gs_U1go")
    .then((response) => response.json())
    .then((responseJson) => {    
            me.setState({
              amphur:responseJson
            })        
    })
    fetch("http://www.greenarea.deqp.go.th/api/api_get_local.php?province_id="+data)
    .then((response) => response.json())
    .then((responseJson) => {     
            me.setState({
              projectaddress:responseJson
            })
    })
  }
  district_select(data){
    let me = this
    this.setState({
      amphur_id:data
    })
    fetch("http://www.greenarea.deqp.go.th/api/api_get_district.php?amphur_id="+data+"&fbclid=IwAR0dqLiStj9Lb1Eq_IQjSw7mZe8cXKHmWRsz_vm9HMY3NsV3Gyzb8XNNqCE")
    .then((response) => response.json())
    .then((responseJson) => {    
            me.setState({
              district:responseJson
            })
    })
  }

  _renderImages() {
    let images = [];
    this.state.image != null ?
      images.push(
        <TouchableOpacity
        onLongPress ={()=>this.handlerLongClick()} 
        //Here is the trick
        activeOpacity={0.6}
        style={styles.button}>
          <Image 
          source={{ uri: this.state.image }}
          style={{ width: 200, height: 200 ,marginBottom:10}}
        /> 
      </TouchableOpacity>
      )     
     : null

    return images;
  }

  handlerLongClick = () => { 
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
        {text: 'ยืนยัน',  onPress: () => { 
          this.setState({
            image: null
          })
          } },
      ],
      {cancelable: false},
    );


  };
 
   
 
  async pickFromGallery(){  
    
    let image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'Images',
    }).catch(error => console.log(error));
    this.setState({ 
      image: image.uri
    }) 
  
}
async pickFromCamera () {    
  let image = await ImagePicker.launchCameraAsync({
    mediaTypes: 'Images',
  }).catch(error => console.log(error));
  this.setState({ 
    image: image.uri
  }) 
}
formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}
  submit(){
    if(this.state.polygonsx.length == 0){ 
      Alert.alert(
        'ล้มเหลว !',
        'กรุณาเลือกพื้นที่',
        [ 
          {
            text: 'ยืนยัน'
          },
        ], 
      );
    }else if(this.state.report_detail == ""){ 
      Alert.alert(
        'ล้มเหลว !',
        'กรุณาใส่ชื่อโครงการ',
        [ 
          {
            text: 'ยืนยัน'
          },
        ], 
      );
    }else if(this.state.project_address == null){ 
      Alert.alert(
        'ล้มเหลว !',
        'กรุณาใส่เขตการปกครอง',
        [ 
          {
            text: 'ยืนยัน'
          },
        ], 
      );
    }else if(this.state.greentype_id == " "){ 
    Alert.alert(
      'ล้มเหลว !',
      'กรุณาเลือกประเภทต้นไม้',
      [ 
        {
          text: 'ยืนยัน'
        },
      ], 
    );
  }else if(this.state.report_keyword == ""){ 
    Alert.alert(
      'ล้มเหลว !',
      'กรุณาใส่รายละเอียดโครงการ',
      [ 
        {
          text: 'ยืนยัน'
        },
      ], 
    );
  } 
    else if(this.state.province_id == " "){ 
      Alert.alert(
        'ล้มเหลว !',
        'กรุณาเลือกจังหวัด',
        [ 
          {
            text: 'ยืนยัน'
          },
        ], 
      );
    }else if(this.state.amphur_id == " "){ 
      Alert.alert(
        'ล้มเหลว !',
        'กรุณาเลือกอำเภอ',
        [ 
          {
            text: 'ยืนยัน'
          },
        ], 
      );
    }else if(this.state.district_id == " "){ 
      Alert.alert(
        'ล้มเหลว !',
        'กรุณาเลือกตำบล',
        [ 
          {
            text: 'ยืนยัน'
          },
        ], 
      );
    }else if(this.state.project_moo == null){ 
      Alert.alert(
        'ล้มเหลว !',
        'กรุณาใส่หมู่',
        [ 
          {
            text: 'ยืนยัน'
          },
        ], 
      );
    }else if(this.state.project_percent == null){ 
      Alert.alert(
        'ล้มเหลว !',
        'กรุณาใส่พื้นที่สิ่งกรีดขวาง',
        [ 
          {
            text: 'ยืนยัน'
          },
        ], 
      );
    }else if(this.state.image == null){ 
      this.submitform('null');
    }else{
      let perfix_img = Date.now()
      let random = Math.floor(Math.random()*100)
      let img_file_name = perfix_img+"_"+random+".jpg"
      const data = new FormData();
    data.append('photo', {
    uri: this.state.image,
    type: 'image/jpeg',
    name: img_file_name
    });    
    fetch('http://www.greenarea.deqp.go.th/api_upload2.php', {
      method: 'post',
      body: data
    })
    .then(res => {   
        this.submitform(img_file_name);

     }).catch(err => { 
      let reportfail = [];
      reportfail.push({ 
        report_detail : this.state.report_keyword,
        report_timestamp:this.formatDate(perfix_img),
        namereport:this.state.report_detail,
      });
      AsyncStorage.getItem("Datafail2").then((value) => {   
        if(value == null){  
          datafail = JSON.stringify(reportfail)   
          AsyncStorage.setItem("Datafail2", datafail);
        }else{  
          datafail = JSON.parse(value).concat(reportfail)
          
          AsyncStorage.setItem("Datafail2", JSON.stringify(datafail));
        } 
     }).done();  
    Alert.alert(
      "ล้มเหลว!",
      "ไม่สามารถรายงานผลได้!",
      [{ text: "ตกลง" }]
    );
  });
}
  }
  submitform(img_file_name){
    let report =  {}; 
    report.uuid = this.state.user.user_id
    report.project_name = this.state.report_detail
    report.project_description = this.state.report_keyword
    report.planting_date = this.formatDate(this.state.date2)
    report.survey_date = this.formatDate(this.state.date)
    report.action = 'insert'
    report.project_img = img_file_name
    report.project_address = this.state.project_address
    report.project_moo = this.state.project_moo
    report.province_id = this.state.province_id 
    report.amphur_id = this.state.amphur_id 
    report.district_id = this.state.district_id 
    report.greentype_id = this.state.greentype_id
    report.project_area = this.state.number_of_area 
    report.project_percent = this.state.project_percent
    report.project_polygon = JSON.stringify(this.state.polygonsx)
    console.log(report)
    let data =  JSON.stringify(report) 
    fetch("http://www.greenarea.deqp.go.th/api/api_set_report.php", {
      method: "post", 
      body:data,
    }).then(res => res.json())
      .then(res => { 
        if(res.status === "success"){
          Alert.alert(
            "สำเร็จ!",
            "รายงานผลเรียบร้อย!",
            [{ text: "OK",  onPress: () => { 
              var date = new Date(); 
              date.setDate(date.getDate() + 3)
              this.setState({
                num:0, 
                image: null,
                date:new Date(),
                date2:date,   
                check1:false,
                check2:false, 
                report_detail:"",
                report_keyword:"",  
                amphur:[],
                polygonsx:[],
                district:[],
                projectaddress:[],
                project_moo:null,
                polygons: [],
                number_of_area:0,
                editing: null,
                creatingHole: false,
                province_id:null,
                amphur_id:null,
                district_id:null,
                greentype_id:null,
                project_address:null,
                project_percent:null, 
                region:[]
                
              }); 
              this.props.navigation.navigate('Settings', {
                onGoBack: () => this.refresh(),
              }) 
              
              }
            }],
            { cancelable: false }
          );
        }else{
          let reportfail = [];
          reportfail.push({ 
            report_detail : this.state.report_keyword,
            report_timestamp:this.formatDate(perfix_img),
            namereport:this.state.report_detail,
          });
          AsyncStorage.getItem("Datafail2").then((value) => {   
            if(value == null){  
              datafail = JSON.stringify(reportfail)   
              AsyncStorage.setItem("Datafail2", datafail);
            }else{  
              datafail = JSON.parse(value).concat(reportfail)
              
              AsyncStorage.setItem("Datafail2", JSON.stringify(datafail));
            } 
         }).done(); 
        }
      }).catch(err => { 
          let reportfail = [];
          reportfail.push({ 
            report_detail : this.state.report_keyword,
            report_timestamp:this.formatDate(perfix_img),
            namereport:this.state.report_detail,
          });

          AsyncStorage.getItem("Datafail2").then((value) => {   
            if(value == null){  
              datafail = JSON.stringify(reportfail)   
              AsyncStorage.setItem("Datafail2", datafail);
            }else{  
              datafail = JSON.parse(value).concat(reportfail)
              
              AsyncStorage.setItem("Datafail2", JSON.stringify(datafail));
            } 
         }).done(); 


        Alert.alert(
          "ล้มเหลว!",
          "ไม่สามารถรายงานผลได้!",
          [{ text: "ตกลง" }]
        );
      });
  }
  render() {    
    const mapOptions = {
      scrollEnabled: true,
    };

    if (this.state.editing) {
      mapOptions.scrollEnabled = false;
      mapOptions.onPanDrag = e => this.onPress(e);
    } 
    const serviceItems = this.state.listtree.map( (l, i) => {
      return <Picker.Item label={l.greentype_name} value={l.greentype_id} />
  }); 

  const province = this.state.province.map( (l, i) => {
    return <Picker.Item label={l.province_name} value={l.province_id} />
}); 
const amphur = this.state.amphur.map( (l, i) => {
  return <Picker.Item label={l.amphur_name} value={l.amphur_id} />
}); 
const district = this.state.district.map( (l, i) => {
return <Picker.Item label={l.district_name} value={l.district_id} />
}); 
const projectaddress = this.state.projectaddress.map( (l, i) => { 
  return <Picker.Item label={l.local_name} value={l.local_id} />
  });  
  
    return ( this.state.latitude != null ?
      
        <ScrollView ref={(scroll) => {this.scroll = scroll;}} keyboardShouldPersistTaps={false} contentContainerStyle={styles.contentContainer}>
      <View > 
      <KeyboardAvoidingView behavior="padding" style={styles.form} enabled>
      <NavigationEvents onDidFocus={() =>
      this.state.listtree.length == 0 || this.state.province.length == 0 || this.state.projectaddress.length == 0 ?
         this.getdateall()
         :null
         } /> 
                  <Text h3 style={styles.paragraph}>{this.state.namereport}</Text> 
                  <MapView  
        provider={this.props.provider}
        style={{ flex: 1 ,height:300,marginLeft:"5%",marginRight:"5%",marginBottom:"5%" }}
        mapType={MAP_TYPES.HYBRID}
        initialRegion={{
          latitude:this.state.latitude,  
          longitude:this.state.longitude,
          latitudeDelta: 0.0022,
          longitudeDelta: 0.0121,
        }}
        onPress={e => this.onPress(e)}
        {...mapOptions}
      >
         
          <MapView.Marker 
            coordinate={{ latitude: this.state.latitude, longitude: this.state.longitude }}
          />
          
        {this.state.polygons.map(polygon => (
          <Polygon
            key={polygon.id}
            coordinates={polygon.coordinates}
            holes={polygon.holes}
            strokeColor="#F00"
            fillColor="rgba(255,0,0,0.5)"
            strokeWidth={1}
          />
        ))}
        {this.state.editing && (
          <Polygon
            key={this.state.editing.id}
            coordinates={this.state.editing.coordinates}
            holes={this.state.editing.holes}
            strokeColor="#000"
            fillColor="rgba(255,0,0,0.5)"
            strokeWidth={1}
          />
        )}
      </MapView>
      <View style={styles.buttonContainer}>
        {this.state.editing && (
          <TouchableOpacity
            onPress={() => this.createHole()}
            style={[styles.bubble, styles.button]}
          >
            <Text> ล้าง </Text>
          </TouchableOpacity>
        )}
        {this.state.editing && (
          <TouchableOpacity
            onPress={() => this.finish()}
            style={[styles.bubble, styles.button]}
          >
            <Text>เสร็จ เเล้วกรุณากด</Text>
          </TouchableOpacity>
        )}
      </View>

      <Input 
         style={styles.inputs}   
         label="ชื่อโครงการ" 
         value={this.state.report_detail}
         onChangeText={(detail) => this.setState({report_detail:detail})}/>
      

<View style={{ flexDirection: 'column',marginTop: 10,marginBottom: 10, marginLeft:"3%"}}>
<Text style={{color: '#86939e',fontSize: 16,fontWeight: 'bold'}}   >เลือกประเภทของพื้นที่สีเขียว</Text>

       <Picker
selectedValue={this.state.greentype_id}
style={{height: 50, width: "100%"}}
onValueChange={(itemValue, itemIndex) =>
  this.setState({greentype_id: itemValue})
}>
  <Picker.Item label="--เลือก--" value=" " />
  {serviceItems}



</Picker>

</View>
<View  style={{marginBottom: 10}}  >
<Input 
         value={this.state.report_keyword}
         label="รายละเอียดโครงการ" 
         onChangeText={(keyword) => this.setState({report_keyword:keyword})}/> 
</View>
<View style={{ flexDirection: 'column',marginTop: 10,marginBottom: 10, marginLeft:"3%"}}>
<Text style={{color: '#86939e',fontSize: 16,fontWeight: 'bold'}}   >วันที่ปลูก</Text>

</View>  
<View style={{ flexDirection: 'column',marginTop: 10,marginBottom: 10, marginLeft:"3%"}}>

<DatePicker
      style={{width: "90%"}}
      date={this.state.date2}
      mode="date" 
      format="DD-MM-YYYY"
      confirmBtnText="Confirm"
      cancelBtnText="Cancel"
      customStyles={{
        dateIcon: {
          position: 'absolute',
          left: 0,
          top: 4,
          marginLeft: 0
        },
        dateInput: {
          marginLeft: 36, 
        } 
      }}
      onDateChange={(date) => {this.setState({date: date2})}}
    />
</View>              

<View style={{ flexDirection: 'column',marginTop: 10,marginBottom: 10, marginLeft:"3%"}}>
<Text style={{color: '#86939e',fontSize: 16,fontWeight: 'bold'}}   >วันที่สำรวจ</Text>

</View>  
<View style={{ flexDirection: 'column',marginTop: 10,marginBottom: 10, marginLeft:"3%"}}>

<DatePicker
      style={{width: "90%"}}
      date={this.state.date}
      mode="date" 
      format="DD-MM-YYYY"
      confirmBtnText="Confirm"
      cancelBtnText="Cancel"
      customStyles={{
        dateIcon: {
          position: 'absolute',
          left: 0,
          top: 4,
          marginLeft: 0
        },
        dateInput: {
          marginLeft: 36, 
        } 
      }}
      onDateChange={(date) => {this.setState({date: date})}}
    />
</View>              

<View style={{ flexDirection: 'column',marginTop: 10,marginBottom: 10, marginLeft:"3%"}}>
<Text style={{color: '#86939e',fontSize: 16,fontWeight: 'bold'}}   >สถานที่ปลูก</Text>
<Picker
selectedValue={this.state.province_id}
style={{height: 50, width: "100%"}}
onValueChange={(itemValue, itemIndex) =>
  this.province_select(itemValue)
}>
  <Picker.Item label="--จังหวัด--" value=" " />
  {province}



</Picker>
<Picker
selectedValue={this.state.amphur_id}
style={{height: 50, width: "100%"}}
onValueChange={(itemValue, itemIndex) =>
  this.district_select(itemValue)
}>
  <Picker.Item label="--อำเภอ--" value=" " />
  {amphur}



</Picker>
<Picker
selectedValue={this.state.district_id}
style={{height: 50, width: "100%"}}
onValueChange={(itemValue, itemIndex) =>
  this.setState({district_id: itemValue})
}>
  <Picker.Item label="--ตำบล--" value=" " />
  {district} 
</Picker> 
</View>  

<View style={{ flexDirection: 'column',marginTop: 10,marginBottom: 10, marginLeft:"3%"}}>
<Text style={{color: '#86939e',fontSize: 16,fontWeight: 'bold'}}   >เขตการปกครองท้องถิ่น</Text>
<Picker
selectedValue={this.state.project_address}
style={{height: 50, width: "100%"}}
onValueChange={(itemValue, itemIndex) =>
  this.setState({project_address: itemValue})
}>
  <Picker.Item label="--เขตการปกครองท้องถิ่น--" value=" " />
  {projectaddress}
</Picker>
</View>

<View style={{ flexDirection: 'column',marginTop: 10,marginBottom: 10,  }}>
<Input 
         style={styles.inputs}   
         label="หมู่" 
         value={this.state.project_moo}
         onChangeText={(keyword) => this.setState({project_moo:keyword})}/>
         </View>
         <View style={{ flexDirection: 'column',marginTop: 10,marginBottom: 10, }}>
        <Input 
         style={styles.inputs}   
         label="พื้นที่สิ่งกรีดขวาง %" 
         value={this.state.project_percent}
         onChangeText={(keyword) => this.setState({project_percent:keyword})}/>
         </View>
         <View style={{ flexDirection: 'column',marginTop: 10,marginBottom: 10, }}>
        
         
        </View>
        {this.state.image != null &&    
 
 <Text style={{
     marginLeft:"20%",
     textAlign: 'center', 
     fontSize: 15,
     marginTop: 0,
     width: 200, 
     backgroundColor: 'yellow', 
     }}>กดค้างเพื่อลบรูปภาพ</Text>
   }
{this._renderImages()} 


  <View style={{  marginTop:10  }}>
    <View style={styles.buttonContainer}>                   
    <TouchableHighlight
onPress={() => this.pickFromGallery()} style={styles.btnClickContain}
underlayColor='#042417'>
<View
  style={styles.btnContainer}>
<Ionicons name="md-image"  size={32} color="white"  />                     
    
  <Text style={styles.btnText}>เลือกจากคลัง</Text>
</View>
</TouchableHighlight>
</View> 
     
     
<TouchableHighlight
onPress={() => this.pickFromCamera()} style={styles.btnClickContain}
underlayColor='#042417'>
<View
  style={styles.btnContainer}>
<Ionicons name="md-camera"  size={32} color="white"   />                     
    
  <Text style={styles.btnText}> กล้องถ่ายรูป </Text>
</View>
</TouchableHighlight>

    

          

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
    </KeyboardAvoidingView>  
      </View>
      
      </ScrollView>
    : <ActivityIndicator style={{flex: 1, justifyContent: 'center'}} size="large" color="#83c336" /> );
  }
}
class SuessScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'รอรายงาน', 
    };
  };
  state = { 
    reportfail:[] 
  } 
  componentDidMount(){
    let me = this
  
      AsyncStorage.getItem("Datafail2").then((value) => {   
      if(value != null){     
        me.setState({
           reportfail:JSON.parse(value) 
        })
      } 
   }).done();   
}

  render() {
    
    console.disableYellowBox = true; 
    return (
      <ScrollView>
      <View >
         {           
           
            this.state.reportfail.map((o, x) => (             
              <ListItem  
              containerStyle={{  
                  borderBottomWidth: 1,
                  borderBottomColor: '#CCCCCC'
                }} 
                leftAvatar={{ source: logoimg }}
                title={o.namereport}
                subtitle={
                  <View> 
                  <Text>{o.report_detail}</Text>
                  <Text>{o.report_timestamp}</Text> 
                  <Badge containerStyle={{ position: 'absolute', top: -4, right: -4 }}  value="สถานะรายงาน : ไม่สำเร็จ" status="error" />
                </View>
                } 
              />
            ))
          } 
      </View>
      </ScrollView>
    );
  }
}
class SettingsScreen extends React.Component {
  
  static navigationOptions = ({ navigation }) => { 
    const { params } = navigation.state;
    return {
      title: 'ประวัติรายงาน', 
      params
    };
  };
  state = { 
    reportsess:[] 
  }  
  componentDidMount(){
    
    let me = this
    let datauser = []; 
      AsyncStorage.removeItem("listitem3")
      AsyncStorage.getItem("user").then((value) => {   
      if(value == null){     
        this.props.navigation.navigate('login')
      }else{
        datauser = JSON.parse(value);
        fetch("http://www.greenarea.deqp.go.th/api/api_get_report.php?uiid="+datauser.user_id)
      .then((response) =>  response.json())
      .then((responseJson) => {     
              me.setState({
                reportsess:responseJson 
              })
      })
      } 
   }).done();   
}
  async  reportree(project_name,project_id){
    let data = {}
    data.project_name = project_name
    data.project_id = project_id
     
      await AsyncStorage.setItem('listitem3', JSON.stringify(data));

          NavigationService.navigate('listitem3')
           
    }


  render() { 
    
    console.disableYellowBox = true;
    return (
      <ScrollView>
      <View >
        <NavigationEvents onDidFocus={() => this.componentDidMount()} />
         {           
            this.state.reportsess.map((o, x) =>(      
              <ListItem  
              containerStyle={{  
                  borderBottomWidth: 1,
                  borderBottomColor: '#CCCCCC'
                }}
                key={o.reportcat_id}  
                leftAvatar={{ source: logoimg }}
                 
                subtitle={
                  <View>
                  <Text>{o.project_name}</Text>
                  <Text>{o.report_timestamp}</Text> 
                  <Badge containerStyle={{ position: 'absolute', top: -4, right: -4 }}  value="สร้างรายงานต้นไม้" status="success" 
                    onPress={() => this.reportree(o.project_name, o.project_id)}
                  />
                  
                </View>
                } 
              />
            ))
          }
          
      </View>
      </ScrollView>
    );
  }
}
const TabNavigator = createMaterialTopTabNavigator({ 
  Home: HomeScreen,
  Suess:SuessScreen,
  Settings: SettingsScreen,
},{
  initialRouteName: 'Home' 
}); 
export default   createAppContainer(TabNavigator);  
const styles = StyleSheet.create({
  contentContainer: {  
    paddingTop: 10,
    paddingBottom: '80%',
    
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
},
map: {
  ...StyleSheet.absoluteFillObject,
},
bubble: {
  backgroundColor: 'rgba(255,255,255,0.7)',
  paddingHorizontal: 18,
  paddingVertical: 12,
  borderRadius: 20,
},
latlng: {
  width: 200,
  alignItems: 'stretch',
},
button: { 
  alignItems: 'center', 
  justifyContent: 'center'
},
form: {
  flex: 1,
  justifyContent: 'space-between',
},

});


let id = 0; 