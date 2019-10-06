import React, { Component } from 'react';
import { Input } from 'react-native-elements';   
import {
  StyleSheet, 
  Text,
  View,
  ScrollView,
  Button,
  TouchableHighlight,
  Image,
  Alert,
  AsyncStorage,
  Linking
} from 'react-native'; 
import { Ionicons } from '@expo/vector-icons';
import SHA1 from 'sha1'; 
export default class LoginView extends Component {

  constructor(props) {
    
    super(props);
    this.state = {
      email   : '',
      password: '',
    }
    _this = this
  }
  static navigationOptions = { 
    title: 'เข้าสู่ระบบ',
    headerStyle: {
      backgroundColor: '#83c336', 
    }, 
    headerTitleStyle: {
      alignSelf: 'center',
      textAlign: "center",
      justifyContent: 'center',
      flex: 1,
      fontWeight: 'bold',
      textAlignVertical: 'center'
      },
    headerLeft: (
     null
    ),
    headerTintColor: 'white'
  }

   onClickListener  = async () => { 
    var _username = this.state.email;
    var _password = this.state.password;
    if (_username !== "" && _password !== "") {
    var hash = SHA1(_password); 
    fetch("https://www.deqp.go.th/data-center/user-auth/?UserId="+_username+"&UserPassword="+hash)
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson.length);
      let datatuser =  {};
      datatuser.user_id = _username
      datatuser.datauser =  responseJson
      
      if(responseJson.username !== undefined){  
        this._signInAsync(JSON.stringify(datatuser));                      
      }else{
        Alert.alert(
          "ผิดพลาด!",
          "ชื่อผู้ใช้ หรือ รหัสผ่าน ไม่ถูกต้อง!",
          [{ text: "OK"}],
          { cancelable: false }
        );
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }else{
    Alert.alert(
      "ผิดพลาด!",
      "กรุณากรอกข้อมูลให้ครบ!",
      [{ text: "OK"}],
      { cancelable: false }
    );
  } 
    
  }
  _signInAsync = async (data) => {
   await AsyncStorage.setItem("user", data); 
   await AsyncStorage.setItem('userToken', 'abc');
    this.props.navigation.navigate('App');
  };
  _signorther = async () => {
    let datauser = {
      "user_id":"guest",
      "datauser":{
        "userName":"ผู้ใช้ทั่วไป",
        "userSurname":"ระบบ",
        "userPrefix":"นาย",
        "position":"-1",
        "addrMoo":"",
        "addrSubdistrict":"",
        "addrDistrict":""
    ,"addrProvince":""
    }
  }
  this._signInAsync(JSON.stringify(datauser)); 
  };
  render() {
    return (
      <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.container}> 
        <Image style={styles.logo} source={require('../../../assets/icons/aip_01.png')} /> 
        <View style={styles.inputContainer}>        
        <Ionicons name="md-person" size={32} color="#83c336" />
          <Input 
           style={styles.inputs} 
           placeholder='ชื่อผู้ใช้งาน' 
           placeholderTextColor={'#83c336'}
           onChangeText={(email) => this.setState({email:email})}/>
        </View>
        
        <View style={styles.inputContainer}>
        <Ionicons name="md-key" size={32} color="#83c336" />
          <Input 
           style={styles.inputs} 
           placeholder='รหัสผ่าน' 
           placeholderTextColor={'#83c336'} 
           secureTextEntry={true}
           onChangeText={(password) => this.setState({password:password})}/>
           
        </View>
      
        <TouchableHighlight style={styles.buttonContainer2}>
          <Button title="เข้าสู่ระบบ" color="#83c336" onPress={() => this.onClickListener()}/>
          </TouchableHighlight>

        <TouchableHighlight style={{justifyContent:'center',alignItems: 'center',marginBottom:20}} onPress={() => Linking.openURL("http://www.deqp.go.th/service-portal/tsm-network-system/member-create")}>
            <Text >สมัครสมาชิก ทสม. | ลืมรหัสผ่าน</Text>
        </TouchableHighlight>

        <TouchableHighlight style={styles.buttonContainer}>
          <Button title="ผู้ใช้ทั่วไป" color="#83c336" onPress={() => this._signorther()}/>
          </TouchableHighlight>
      </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer:{
    paddingVertical: "15%"
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  }, 
  inputContainer: { 
    paddingTop:50,  
    height: 70,
    flexDirection: 'row',
    alignItems:'center',
    marginRight:"10%" ,
    marginLeft:"10%" ,
    marginBottom:"5%"
},  
inputIcon:{
  width:30,
  height:30, 
  justifyContent: 'center', 
}, 
  buttonContainer: {
    height: 45,     
    marginBottom: 10,
    width: "95%",
    borderRadius: 20
  } ,
  buttonContainer2: {
    marginTop: "15%",
    height: 45,     
    marginBottom: 10,
    width: "95%",
    borderRadius: 20
  } ,
  loginText: {
    color: 'white',
  },
  logo: {
    height: 128,
    width: 128,  
  }
});