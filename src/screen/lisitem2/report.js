import React from "react";
import { View,Button, Picker, Image, StyleSheet  , ScrollView, TouchableOpacity, Alert, TouchableHighlight, AsyncStorage } from "react-native";   
  
import { Input,Text  } from 'react-native-elements'; 
import { Camera } from 'expo-camera';
import {Permissions, ImagePicker} from 'expo'
import DatePicker from 'react-native-datepicker'
import * as FileSystem from 'expo-file-system'; 


import { Ionicons } from '@expo/vector-icons';
import MapView, {
  MAP_TYPES,
  Polygon,
  ProviderPropType,
} from 'react-native-maps';  
export default class App extends React.Component { 
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
        district:[],
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
        project_percent:0,
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
  }

  createHole() {
    const { editing, creatingHole } = this.state;
    if (!creatingHole) {
      this.setState({
        creatingHole: true,
        editing: {
          ...editing,
          holes: [...editing.holes, []],
        },
      });
    } else {
      const holes = [...editing.holes];
      if (holes[holes.length - 1].length === 0) {
        holes.pop();
        this.setState({
          editing: {
            ...editing,
            holes,
          },
        });
      }
      this.setState({ creatingHole: false });
    }
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
    date.setDate(date.getDate() + 3)
    this.setState({ 
      hasCameraPermission: statusca === 'granted',
      date2:date
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
        fetch("http://green2.tndevs.com/api/api_get_greentype.php?fbclid=IwAR2EqZup4goE4aV2fmVWpDcB-Jsld3K5TROW_8XwjSUysYEDI2vbvzOeWM0")
      .then((response) => response.json())
      .then((responseJson) => {   
              me.setState({
                listtree:responseJson
              })
      })
        
      fetch("http://green2.tndevs.com/api/api_get_province.php?fbclid=IwAR3K5dAOQE7AuXrpGsMjyqBQZNlw7u8ekePbj6oxKz5YjuowizCzPAXrUrc")
      .then((response) => response.json())
      .then((responseJson) => {    
              me.setState({
                province:responseJson
              })
      })
      
      fetch("http://green2.tndevs.com/api/api_get_amphur.php?province_id=10&fbclid=IwAR2Tg1l3NMnGwTM1SaXnpc1oi0b0u74ttZdDvry_xttNPCkl8z58Gs_U1go")
      .then((response) => response.json())
      .then((responseJson) => {    
              me.setState({
                amphur:responseJson
              })
      })

      fetch("http://green2.tndevs.com/api/api_get_district.php?amphur_id=151&fbclid=IwAR0dqLiStj9Lb1Eq_IQjSw7mZe8cXKHmWRsz_vm9HMY3NsV3Gyzb8XNNqCE")
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
    

    let perfix_img = Date.now()
    let random = Math.floor(Math.random()*100)
    let img_file_name = perfix_img+"_"+random+".jpg"
    const data = new FormData();
    data.append('photo', {
    uri: this.state.image,
    type: 'image/jpeg',
    name: img_file_name
    });    
    fetch('http://green2.tndevs.com/api_upload2.php', {
      method: 'post',
      body: data
    })
    .then(res => {   
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
      report.project_polygon = JSON.stringify(this.state.polygons)
      let data =  JSON.stringify(report) 
      fetch("http://green2.tndevs.com/api/api_set_report.php", {
        method: "post", 
        body:data,
      }).then(res => res.json())
        .then(res => { 
          if(res.status === "success"){
            Alert.alert(
              "สำเร็จ!",
              "รายงานผลเรียบร้อย!",
              [{ text: "OK",  onPress: () => { 
                this.props.navigation.navigate('menu') 
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
            AsyncStorage.setItem("Datafail2", JSON.stringify(reportfail));
          }
        }).catch(err => { 
            let reportfail = [];
            reportfail.push({ 
              report_detail : this.state.report_keyword,
              report_timestamp:this.formatDate(perfix_img),
              namereport:this.state.report_detail,
            });
            AsyncStorage.setItem("Datafail2", JSON.stringify(reportfail));  
          Alert.alert(
            "ล้มเหลว!",
            "ไม่สามารถรายงานผลได้!",
            [{ text: "ตกลง" }]
          );
        });   
     })



    
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
      return (
        
          <ScrollView ref={(scroll) => {this.scroll = scroll;}} contentContainerStyle={styles.contentContainer}>
        <View >   
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
              <Text>
                {this.state.creatingHole ? 'Finish Hole' : 'Create Hole'}
              </Text>
            </TouchableOpacity>
          )}
          {this.state.editing && (
            <TouchableOpacity
              onPress={() => this.finish()}
              style={[styles.bubble, styles.button]}
            >
              <Text>Finish</Text>
            </TouchableOpacity>
          )}
        </View>

        <Input 
           style={styles.inputs}   
           label="ชื่อโครงการ" 
           onChangeText={(detail) => this.setState({report_detail:detail})}/>
        <Input 
           style={styles.inputs}   
           label="เขตการปกครอง" 
           onChangeText={(keyword) => this.setState({project_address:keyword})}/>
 
<View style={{ flexDirection: 'column',marginTop: 10,marginBottom: 10, marginLeft:"3%"}}>
<Text style={{color: '#86939e',fontSize: 16,fontWeight: 'bold'}}   >เลือกประเภทต้นไม้</Text>

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
    this.setState({province_id: itemValue})
  }>
    <Picker.Item label="--จังหวัด--" value=" " />
    {province}

  
  
</Picker>
<Picker
  selectedValue={this.state.amphur_id}
  style={{height: 50, width: "100%"}}
  onValueChange={(itemValue, itemIndex) =>
    this.setState({amphur_id: itemValue})
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
<View style={{ flexDirection: 'column',marginTop: 10,marginBottom: 10,  }}>
<Input 
           style={styles.inputs}   
           label="หมู่" 
           onChangeText={(keyword) => this.setState({project_moo:keyword})}/>
           </View>
           <View style={{ flexDirection: 'column',marginTop: 10,marginBottom: 10, }}>
          <Input 
           style={styles.inputs}   
           label="พื้นที่สิ่งกรีดขวาง %" 
           onChangeText={(keyword) => this.setState({project_percent:keyword})}/>
           </View>
           <View style={{ flexDirection: 'column',marginTop: 10,marginBottom: 10, }}>
           <Input 
           style={styles.inputs}   
           label="พื้นที่ปลูก (ตรม.) " 
           value={this.state.number_of_area}
           onChangeText={(keyword) => this.setState({number_of_area:keyword})}/>
           
          </View>
      
 {this._renderImages()} 
 

    <View style={{  marginTop:10  }}>
      <View style={styles.buttonContainer}>                   
      <TouchableHighlight
  onPress={() => this.pickFromGallery()} style={styles.btnClickContain}
  underlayColor='#042417'>
  <View
    style={styles.btnContainer}>
 <Ionicons name="md-image"  size={32} color="white"  />                     
      
    <Text style={styles.btnText}>เลือกจากคลั่ง</Text>
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
  
  });
 
 
let id = 0; 