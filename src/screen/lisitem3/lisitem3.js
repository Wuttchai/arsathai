import React from "react";
import { View,Button, Picker, Image, StyleSheet  , ScrollView, TouchableOpacity, Alert, TouchableHighlight, AsyncStorage } from "react-native";   
 import { ListItem, Badge,Input,Text  } from 'react-native-elements'; 
import DatePicker from 'react-native-datepicker' 
import { Ionicons } from '@expo/vector-icons';  
import { Camera } from 'expo-camera';
import {Permissions, ImagePicker} from 'expo'
import { createMaterialTopTabNavigator, createAppContainer } from 'react-navigation'; 
const logoimg = require('../../../assets/icons/tree.jpg');
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
            namereport:'สร้างข้อมูลต้นไม้',
            num:0, 
            image: null,
            date:new Date(), 
            check1:false,
            check2:false, 
            report_detail:"",
            report_keyword:"",
            type: Camera.Constants.Type.back, 
            listtree:[],
            province:[],
            amphur:[],
            district:[],
            project_moo:null,
            polygons: [],
            pt_ref1:null,
            editing: null,
            creatingHole: false, 
            greentype_id:null, 
            project_percent:0,
            user:[],
            lat:null,
            Lng:null
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
        let me = this 
        const { statusca } = await Permissions.askAsync(Permissions.CAMERA); 
        this.setState({ 
          hasCameraPermission: statusca === 'granted', 
        });
          
          AsyncStorage.getItem("listitem3").then((value) => {   
            if(value != null){       
              me.setState({
                dataitem:JSON.parse(value)
              })  
            } 
         }).done();  
         
          
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
        let date = this.formatDate(this.state.date) 
        let perfix_img = Date.now()
        let random = Math.floor(Math.random()*100)
        let img_file_name = perfix_img+"_"+random+".jpg"
        const data = new FormData();
        data.append('photo', {
        uri: this.state.image,
        type: 'image/jpeg',
        name: img_file_name
        });    
        fetch('http://green2.tndevs.com/api_upload.php', {
          method: 'post',
          body: data
        })
        .then(res => {    
          let report =  {}; 
          report.tree_id = this.state.greentype_id
          report.pt_lat = this.state.lat
          report.pt_lng = this.state.Lng
          report.project_id = this.state.dataitem.project_id 
          report.action = 'insert' 
          report.survey_date = date
          report.project_img = img_file_name
          report.project_address = this.state.project_moo
          report.project_moo = this.state.project_percent
          report.pt_ref1 = this.state.pt_ref1
          console.log(report)
          let data =  JSON.stringify(report) 
          fetch("http://green2.tndevs.com/api/api_set_tree.php", {
            method: "post", 
            body: data,
          }).then(res =>  res.json())
            .then(res => { 
              console.log(res)
              if(res.status === "success"){
                Alert.alert(
                  "สำเร็จ!",
                  "รายงานผลเรียบร้อย!",
                  [{ text: "OK",  onPress: () => { 
                    this.props.navigation.navigate('Settings')
                    }}],
                  { cancelable: false }
                );
              }else{
                let reportfail = [];
                reportfail.push({ 
                  report_detail : this.state.namereport,
                  report_timestamp:this.formatDate(perfix_img), 
                });
                AsyncStorage.setItem("Datafail3", JSON.stringify(reportfail)); 
              }          
            }).catch(err => { 
              let reportfail = [];
              reportfail.push({ 
                report_detail : this.state.namereport,
                report_timestamp:this.formatDate(perfix_img), 
              });
              AsyncStorage.setItem("Datafail3", JSON.stringify(reportfail));  
            Alert.alert(
              "ล้มเหลว!",
              "ไม่สามารถรายงานผลได้!",
              [{ text: "ตกลง" }]
            );
          });   
          
        }).catch(err => { 
          let reportfail = [];
          reportfail.push({ 
            report_detail : this.state.namereport,
            report_timestamp:this.formatDate(perfix_img), 
          });
          AsyncStorage.setItem("Datafail3", JSON.stringify(reportfail));  
        Alert.alert(
          "ล้มเหลว!",
          "ไม่สามารถรายงานผลได้!",
          [{ text: "ตกลง" }]
        );
      });
        
        

      }
      render() {   
 
        return (
          
            <ScrollView ref={(scroll) => {this.scroll = scroll;}} contentContainerStyle={styles.contentContainer}>
          <View >   
                      <Text h3 style={styles.paragraph}>{this.state.namereport}</Text> 
        
        
          <View style={{ flexDirection: 'column', marginBottom: 10, marginLeft:"2%"}}>
  <Text style={{color: '#86939e',fontSize: 16,fontWeight: 'bold'}}   >พรรณไม้</Text>
  
           <Picker
    selectedValue={this.state.greentype_id}
    style={{height: 50, width: "100%"}}
    onValueChange={(itemValue, itemIndex) =>
      this.setState({greentype_id: itemValue})
    }>
      <Picker.Item label="เลือกพรรณไม้" value=" " />
      <Picker.Item label="สัก" value="1" />
  
    
    
  </Picker>
  
  </View>
  <View style={{ flexDirection: 'column',marginTop: 10,marginBottom: 10, marginLeft:"2%"}}>
  <Text style={{color: '#86939e',fontSize: 16,fontWeight: 'bold'}}   >วันที่ติดตามผล</Text>
   
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
          <Input 
             style={styles.inputs}   
             label="Lat" 
             onChangeText={(detail) => this.setState({lat:detail})}/>
         
   
  
  <View  >
  <Input 
             style={styles.inputs} 
             label="Lng" 
             onChangeText={(keyword) => this.setState({Lng:keyword})}/> 
  </View>
               
               
   
   
  <View style={{ flexDirection: 'column',marginTop: 10,marginBottom: 10 }}>
  <Input 
             style={styles.inputs}   
             label="ความสูง" 
             onChangeText={(keyword) => this.setState({project_moo:keyword})}/>
            
           
             
            </View>
            <View style={{ flexDirection: 'column',marginTop: 10,marginBottom: 10 }}>
            <Input 
             style={styles.inputs}   
             label="เส้นรอบวง" 
             onChangeText={(keyword) => this.setState({project_percent:keyword})}/>
           
             
            </View>
           
            <View style={{ flexDirection: 'column',marginTop: 10,marginBottom: 10 }}>
             <Input 
             style={styles.inputs}   
             label="หมายเหตุ" 
             value={this.state.pt_ref1}
             onChangeText={(keyword) => this.setState({pt_ref1:keyword})}/>
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

class SettingsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'ประวัติรายงาน', 
    };
  };
  state = { 
    reportsess:[] 
  } 
  componentDidMount(){ 
    let me = this
    let datauser = []; 
      AsyncStorage.getItem("user").then((value) => {   
      if(value == null){     
        this.props.navigation.navigate('login')
      }else{
        datauser = JSON.parse(value);
        fetch("http://green2.tndevs.com/api/api_get_tree.php?uiid="+datauser.user_id)
      .then((response) =>  response.json())
      .then((responseJson) => {        
              me.setState({
                reportsess:responseJson 
              })
      })
      } 
   }).done();   
}
    reportree(project_name){   
        NavigationService.navigate('listitem3', { 
            project_name: project_name, 
          })
    }


  render() {
    const { state, navigate } = this.props.navigation;
    console.disableYellowBox = true;
    return (
      <View >
         {           
            this.state.reportsess.map((o, x) => (             
              <ListItem  
              containerStyle={{  
                  borderBottomWidth: 1,
                  borderBottomColor: '#CCCCCC'
                }}
                key={o.reportcat_id} 
                leftAvatar={{ source: logoimg }}
                title={o.project_name}
                subtitle={
                  <View>
                  <Text>{o.report_detail}</Text>
                  <Text>{o.report_timestamp}</Text> 
                  <Badge containerStyle={{ position: 'absolute', top: -4, right: -4 }}  value="สร้างรายงานต้นไม้" status="success" 
                    onPress={() => this.reportree(o.project_name)}
                  />
                  
                </View>
                } 
              />
            ))
          }
      </View>
    );
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
  
      AsyncStorage.getItem("Datafail3").then((value) => {  
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
      <View >
         {           
           
            this.state.reportfail.map((o, x) => (             
              <ListItem  
              containerStyle={{  
                  borderBottomWidth: 1,
                  borderBottomColor: '#CCCCCC'
                }} 
                leftAvatar={{ source: logoimg }}
                title={o.report_detail}
                subtitle={
                  <View> 
                  <Text>{o.report_timestamp}</Text> 
                  <Badge containerStyle={{ position: 'absolute', top: -4, right: -4 }}  value="สถานะรายงาน : ไม่สำเร็จ" status="error" />
                </View>
                } 
              />
            ))
          } 
      </View>
    );
  }
}



const TabNavigator = createMaterialTopTabNavigator({
  
  screen: HomeScreen ,  
  Suess: SuessScreen, 
  Settings: SettingsScreen,
}); 
export default   createAppContainer(TabNavigator); 
const styles = StyleSheet.create({
  contentContainer: { 
    //paddingVertical: 50
  },
  inputs:{
    marginLeft:"3%",
    marginBottom: 10
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
button: { 
  alignItems: 'center', 
  justifyContent: 'center'
},

});