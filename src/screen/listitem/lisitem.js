import React from 'react';
import { Text, View, AsyncStorage } from 'react-native';
import { createMaterialTopTabNavigator, createAppContainer, NavigationEvents } from 'react-navigation'; 
import { ListItem, Badge  } from 'react-native-elements' 
import NavigationService from './../../NavigationService';
import { ScrollView } from 'react-native-gesture-handler';

class HomeScreen extends React.Component {
   
  state = { 
    menu:[], 
    user:[], 
  }  
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'รายงาน', 
    };
  };
  componentDidMount(){
    
    let me = this
    let datauser = []; 
      AsyncStorage.getItem("user").then((value) => {   
      if(value == null){     
        this.props.navigation.navigate('login')
      }else{
        datauser = JSON.parse(value); 
        
        this.setState({
          user:JSON.parse(value)
        }) 
  
        fetch("http://www.nevt.deqp.go.th/DEQP_NEVT/nevt_v2/api/api_get_reportcat.php")
        .then((response) => response.json())
        .then((responseJson) => {  
                me.setState({
                  menu:responseJson
                })
        })         
      } 
   }).done();   
   
    
   }
   onClickReport = (reportcat_set, reportname_set, reportcat_id,iconreport) => {
    
    NavigationService.navigate('formreport', { 
      idreport: reportcat_set,
      namereport:reportname_set,
      reportcat_id:reportcat_id,
      user:this.state.user,
      iconreport:iconreport
    })  
   }
  render() {
    return (
      <ScrollView>
      <View  >
        {
        this.state.menu.map((l, i) => (
          <ListItem  
          containerStyle={{  
              borderBottomWidth: 1,
              borderBottomColor: '#CCCCCC'
            }}
            key={l.reportcat_id} 
            leftAvatar={{ rounded: true,source: { uri: "http://www.nevt.deqp.go.th/DEQP_NEVT/nevt_v2/img_icon/"+l.reportcat_icon } }}
            title={l.reportcat_thname} 
            onPress={() => this.onClickReport(l.reportcat_id,l.reportcat_thname,l.reportcat_id,l.reportcat_icon)}
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
        fetch("http://www.nevt.deqp.go.th/DEQP_NEVT/nevt_v2/api/api_get_report.php?uiid="+datauser.user_id)
   .then((response) =>  response.json())
   .then((responseJson) => {     
      
           me.setState({
             reportsess:responseJson 
           })
   })
      } 
   }).done();   
   
}

  render() {
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
                leftAvatar={{ rounded: true,source: { uri: "http://www.nevt.deqp.go.th/DEQP_NEVT/nevt_v2/img_icon/"+o.reportcat_icon } }}
                title={o.reportcat_thname}
                subtitle={
                  <View>
                  <Text>{o.report_detail}</Text>
                  <Text>{o.report_timestamp}</Text> 
                  <Badge containerStyle={{ position: 'absolute', top: -4, right: -4 }}  value="สถานะรายงาน : เรียบร้อย" status="success" />
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
      AsyncStorage.getItem("Datafail").then((value) => {   
      if(value == null){     
        this.props.navigation.navigate('login')
      }else{   
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
                leftAvatar={{ rounded: true,source: { uri: "http://www.nevt.deqp.go.th/DEQP_NEVT/nevt_v2/img_icon/"+o.report_icon } }}
                title={o.reportcat_thname}
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



const TabNavigator = createMaterialTopTabNavigator({
  
  screen: HomeScreen ,  
  Suess: SuessScreen, 
  Settings: SettingsScreen,
}); 
export default   createAppContainer(TabNavigator); 
 