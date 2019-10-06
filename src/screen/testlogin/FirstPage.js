import React from "react";
import { View,Button, Picker, Image, StyleSheet, KeyboardAvoidingView  , ScrollView, TouchableOpacity, Alert, TouchableHighlight, AsyncStorage } from "react-native";   
 import { ListItem, Badge,Input,Text  } from 'react-native-elements'; 
import DatePicker from 'react-native-datepicker' 
import { Ionicons } from '@expo/vector-icons';  
import { Camera } from 'expo-camera';
import {Permissions, ImagePicker} from 'expo'
import MapView, {
  MAP_TYPES 
} from 'react-native-maps'; 
import { createMaterialTopTabNavigator, createAppContainer, NavigationEvents } from 'react-navigation'; 
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
            province:[],
            amphur:[],
            district:[],
            project_moo:null,
            polygons: [],
            pt_ref1:null,
            ptd_ref1:null,
            ptd_ref2:null,
            ptd_ref3:null,
            editing: null,
            creatingHole: false, 
            greentype_id:null, 
            project_percent:null,
            user:[], 
            latitude:null,
            longitude:null,
            listtree:[]
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
        AsyncStorage.getItem("user").then((value) => {   
          if(value == null){     
            this.props.navigation.navigate('login')
          }else{
            me.setState({
              userdata:JSON.parse(value)
            })  
          }
        });
        const {status} = await Permissions.getAsync(Permissions.LOCATION)
        const { statusca } = await Permissions.askAsync(Permissions.CAMERA); 
        if(status !== 'granted'){
          const {response} = await Permissions.askAsync(Permissions.LOCATION)
      }
      await   navigator.geolocation.getCurrentPosition(
        ({ coords: {latitude, longitude } }) =>  this.setState({latitude, longitude})
      )
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
         fetch("http://www.greenarea.deqp.go.th/api/api_get_tree.php?uiid")
         .then((response) =>  response.json())
         .then((responseJson) => {      
                 me.setState({
                  listtree:responseJson 
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
        if(this.state.greentype_id == null){ 
          Alert.alert(
            'ล้มเหลว !',
            'กรุณาเลือกพรรณไม้',
            [ 
              {
                text: 'ยืนยัน'
              },
            ], 
          );
        }else if(this.state.project_moo == null){ 
          Alert.alert(
            'ล้มเหลว !',
            'กรุณาใส่ความสูง',
            [ 
              {
                text: 'ยืนยัน'
              },
            ], 
          );
        }else if(this.state.project_percent == null){ 
          Alert.alert(
            'ล้มเหลว !',
            'กรุณาใส่เส้นรอบวง',
            [ 
              {
                text: 'ยืนยัน'
              },
            ], 
          );
        }else if(this.state.image == null){ 
          this.submitform('null')
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
        fetch('http://www.greenarea.deqp.go.th/api_upload.php', {
          method: 'post',
          body: data
        })
        .then(res => {    
            this.submitform(img_file_name)
          
        }).catch(err => { 
          let reportfail = [];
          reportfail.push({ 
            report_detail : this.state.namereport,
            report_timestamp:this.formatDate(perfix_img), 
          });
          AsyncStorage.getItem("Datafail3").then((value) => {   
            if(value == null){  
              datafail = JSON.stringify(reportfail)   
              AsyncStorage.setItem("Datafail3", datafail);
            }else{  
              datafail = JSON.parse(value).concat(reportfail)
              
              AsyncStorage.setItem("Datafail3", JSON.stringify(datafail));
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
        let date = this.formatDate(this.state.date)
        let report =  {}; 
        report.uuid = this.state.userdata.user_id
        report.tree_id = this.state.greentype_id
        report.pt_lat = this.state.latitude.toString();
        report.pt_lng = this.state.longitude.toString();
        report.project_id = this.state.dataitem.project_id 
        report.action = 'insert' 
        report.survey_date = date
        report.project_img = img_file_name
        report.project_address = this.state.project_moo
        report.project_moo = this.state.project_percent
        report.pt_ref1 = this.state.pt_ref1
        
        report.ptd_ref1 = this.state.ptd_ref1  
        report.ptd_ref2 = this.state.ptd_ref2  
        report.ptd_ref3 = this.state.ptd_ref3  
        
        let data =  JSON.stringify(report) 
        fetch("http://www.greenarea.deqp.go.th/api/api_set_tree.php", {
          method: "post", 
          body: data,
        }).then(res => {   
              Alert.alert(
                "สำเร็จ!",
                "รายงานผลเรียบร้อย!",
                [{ text: "OK",  onPress: () => {
                  this.setState({
                    num:0, 
                    image: null,
                    date:new Date(), 
                    check1:false,
                    check2:false, 
                    report_detail:"",
                    report_keyword:"",
                    type: Camera.Constants.Type.back,  
                    province:[],
                    amphur:[],
                    district:[],
                    project_moo:null,
                    polygons: [],
                    pt_ref1:null,
                    ptd_ref1:null,
                    ptd_ref2:null,
                    ptd_ref3:null,
                    editing: null,
                    creatingHole: false, 
                    greentype_id:null, 
                    project_percent:null,
                    user:[], 
                  }) 
                  }
                }],
                { cancelable: false }
              );       
          }).catch(err => {  
            let reportfail = [];
            reportfail.push({ 
              report_detail : this.state.namereport,
              report_timestamp:this.formatDate(perfix_img), 
            });
            AsyncStorage.getItem("Datafail3").then((value) => {   
              if(value == null){  
                datafail = JSON.stringify(reportfail)   
                AsyncStorage.setItem("Datafail3", datafail);
              }else{  
                datafail = JSON.parse(value).concat(reportfail)
                
                AsyncStorage.setItem("Datafail3", JSON.stringify(datafail));
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
        const treeItems = this.state.listtree.map( (l, i) => {
         
          return <Picker.Item label={l.tree_name} value={l.tree_id} />
      });
        return (
          
          <View style={styles.container}>
          <KeyboardAvoidingView behavior="padding" style={styles.form} enabled>
                      <Text h3 style={styles.paragraph}>{this.state.namereport}</Text> 

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
        
          <View style={{ flexDirection: 'column', marginBottom: 10, marginLeft:"2%"}}>
  <Text style={{color: '#86939e',fontSize: 16,fontWeight: 'bold'}}   >พรรณไม้</Text>
  
           <Picker
    selectedValue={this.state.greentype_id}
    style={{height: 50, width: "100%"}}
    onValueChange={(itemValue, itemIndex) =>
      this.setState({greentype_id: itemValue})
    }>
      <Picker.Item label="เลือกพรรณไม้" value=" " />
      {treeItems}
  
    
    
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
        
         
         
   
               
               
   
   
  <View style={{ flexDirection: 'column',marginTop: 10,marginBottom: 10 }}>
  <Input 
             style={styles.inputs}   
             label="ความสูง" 
             onChangeText={(keyword) => this.setState({project_moo:keyword})}
             value={this.state.project_moo}
             />
            
           
             
            </View>
            <View style={{ flexDirection: 'column',marginTop: 10,marginBottom: 10 }}>
            <Input 
             style={styles.inputs}   
             label="เส้นรอบวง" 
             onChangeText={(keyword) => this.setState({project_percent:keyword})}
             value={this.state.project_percent}
             />
            
             
            </View>
           
            <View style={{ flexDirection: 'column',marginTop: 10,marginBottom: 10 }}>
             <Input 
             style={styles.inputs}   
             label="หมายเหตุ" 
             value={this.state.pt_ref1}
             onChangeText={(keyword) => this.setState({pt_ref1:keyword})}/>
              </View>
              <View style={{ flexDirection: 'column',marginTop: 10,marginBottom: 10 }}>
             <Input 
             style={styles.inputs}   
             label="ref1" 
             value={this.state.ptd_ref1}
             onChangeText={(keyword) => this.setState({ptd_ref1:keyword})}/>
              </View>
              <View style={{ flexDirection: 'column',marginTop: 10,marginBottom: 10 }}>
             <Input 
             style={styles.inputs}   
             label="ref2" 
             value={this.state.ptd_ref2}
             onChangeText={(keyword) => this.setState({ptd_ref2:keyword})}/>
              </View>
              <View style={{ flexDirection: 'column',marginTop: 10,marginBottom: 10 }}>
             <Input 
             style={styles.inputs}   
             label="ref3" 
             value={this.state.ptd_ref3}
             onChangeText={(keyword) => this.setState({ptd_ref3:keyword})}/>
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
        </KeyboardAvoidingView>
          </View>
          
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
        fetch("http://www.greenarea.deqp.go.th/api/api_get_tree.php?uiid="+datauser.user_id)
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
      <ScrollView>
      <View >
        <NavigationEvents onDidFocus={() => this.componentDidMount()} />
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
                  <Text>{o.tree_name}</Text>
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
      </ScrollView>
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
      <ScrollView>
      <View style={styles.container}>
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
      </ScrollView>
    );
  }
}



const TabNavigator = createMaterialTopTabNavigator({
  
  screen: HomeScreen ,  
  Suess: SuessScreen, 
  //Settings: SettingsScreen,
}); 
export default   createAppContainer(TabNavigator); 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  header: {
    paddingTop: 20 + Constants.statusBarHeight,
    padding: 20,
    backgroundColor: '#336699',
  },
  description: {
    fontSize: 14,
    color: 'white',
  },
  input: {
    margin: 20,
    marginBottom: 0,
    height: 34,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderColor: '#ccc',
    borderWidth: 1,
    fontSize: 16,
  },
  legal: {
    margin: 10,
    color: '#333',
    fontSize: 12,
    textAlign: 'center',
  },
  form: {
    flex: 1,
    justifyContent: 'space-between',
  },
});