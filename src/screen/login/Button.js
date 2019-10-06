import * as React from 'react';
import { Text, View, StyleSheet, Image, Button, TouchableHighlight, Linking, AsyncStorage,TouchableOpacity } from 'react-native';  
import NavigationService from '../../NavigationService'; 
export default class AssetExample extends React.Component {
  constructor(props) {
    super(props); 
    this.state = {
      userid: null
    }
 }
 
  componentDidMount(){
    let me = this 
    AsyncStorage.getItem("user").then((value) => {   
      if(value == null){     
        this.props.navigation.navigate('login')
      }else{
        let user = JSON.parse(value)
        me.setState({
          userid:user.user_id
        })  
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
          <TouchableOpacity style={styles.ButtonStyle} activeOpacity = { .5 } onPress={() =>  NavigationService.navigate('listitem') }>
            <Text style={styles.TextStyle}>สร้างรายงาน Arsa4thai</Text>
        </TouchableOpacity> 
        
        <TouchableOpacity style={styles.ButtonStyle} activeOpacity = { .5 } onPress={() => Linking.openURL("http://www.nevt.deqp.go.th/DEQP_NEVT/nevt_v2/index.php?page=1")}>
            <Text style={styles.TextStyle}>ติดตาม Arsa4Thai</Text>
        </TouchableOpacity> 

        <TouchableOpacity style={styles.ButtonStyle} activeOpacity = { .5 } onPress={() =>  Linking.openURL("http://www.greenarea.deqp.go.th/")  }>
            <Text style={styles.TextStyle}>ติดตามรายงานพื้นที่สีเขียว</Text>
        </TouchableOpacity> 
        { this.state.userid != 'guest' ? 
           <TouchableOpacity style={styles.ButtonStyle} activeOpacity = { .5 } onPress={() =>  NavigationService.navigate('listitem2')  }>
              <Text style={styles.TextStyle}>สร้างรายงานพื้นที่สีเขียว</Text>
           </TouchableOpacity> 
        : null}
                  
      </View>
    );
  }
}
const styles = StyleSheet.create({

  buttonContainer: {
  height: 45,
  marginBottom: 10,
  width: "100%",
  borderRadius: 20
},

ButtonStyle: { 
  paddingTop:10,
  paddingBottom:10,
  backgroundColor:'#83c336', 
  marginBottom: 20, 
},

TextStyle:{
    color:'#fff',
    textAlign:'center',
    fontWeight: "bold"
}

});
