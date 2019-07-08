import React from 'react';
import { Text, View, Button, AsyncStorage } from 'react-native';
import { ListItem, Badge  } from 'react-native-elements'
import { createMaterialTopTabNavigator, createAppContainer} from 'react-navigation';
import Formreport from '../lisitem2/report'; 
const logoimg = require('../../../assets/icons/pang.jpg');
class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'รายงาน', 
    };
  };
  render() {
    return (
      <View>
        <Formreport />
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
        fetch("http://green2.tndevs.com/api/api_get_report.php?uiid="+datauser.user_id)
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
                    onPress={() => this.reportree(o.project_name, o.project_id)}
                  />
                  
                </View>
                } 
              />
            ))
          }
           <Button
          title="Go to Home"
          onPress={() => this.props.navigation.navigate('Home')}
        />
      </View>
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
