import * as React from 'react';
import { View, StyleSheet, Dimensions,Button, AsyncStorage } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { ListItem } from 'react-native-elements'
import { Ionicons } from '@expo/vector-icons';
import Formreport from '../lisitem2/report';

export default class TabViewExample extends React.Component {
  
  state = {
    index: 0,
    routes: [
      { key: 'first', title: 'รายงาน' },
      { key: 'second', title: 'รอรายงาน' },
      { key: 'third', title: 'ประวัติรายงาน' }
    ],
    menu:[],
    user:'',
  };
  
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'ระบบรายงาน',
      headerStyle: {
        backgroundColor: '#83c336',
      }, 
     
     headerTintColor: 'white'
    };
  };
  logout= () =>{
    AsyncStorage.removeItem('user');
    this.props.navigation.navigate('menu');
  }
  componentDidMount(){
    AsyncStorage.getItem("user").then((value) => {   
    if(value == null){     
      this.props.navigation.navigate('login')
    }else{
      this.setState({
        user:JSON.parse(value)
      })
    } 
 }).done();    
  _this = this;
   let me = this
    fetch("http://www.nevt.deqp.go.th/DEQP_NEVT/nevt_v2/api/api_get_reportcat.php")
    .then((response) => response.json())
    .then((responseJson) => {  
            me.setState({
              menu:responseJson
            })
    })
    .catch((error) => {
      console.log(error);
    });
 }
 onClickReport = (reportcat_set, reportname_set, reportcat_id) => {
  this.props.navigation.navigate('formreport', { 
    idreport: reportcat_set,
    namereport:reportname_set,
    reportcat_id:reportcat_id,
    user:this.state.user
  }) 
 }
 
  render() {  
    const FirstRoute = () => (
      <View>
     <Formreport />
      
    </View>
    );
    return (
      <TabView 
        style={[styles.label,  '#c9ced6' ]}
        navigationState={this.state}
        renderScene={SceneMap({
          first: FirstRoute,
          second: SecondRoute,
          third: ThirdRoute
        })}
        onIndexChange={index => this.setState({ index })}
        initialLayout={{ width: Dimensions.get('window').width }}
      />
    );
  }
}
 

 
 
const SecondRoute = () => (
  <View>
  {
    
  }
  
</View>
);

const ThirdRoute = () => (
  <View style={[styles.scene, { backgroundColor: '#673ab8' }]} />
);

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});