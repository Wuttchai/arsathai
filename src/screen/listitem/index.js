import * as React from 'react';
import { View, StyleSheet, Dimensions,Button } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { ListItem } from 'react-native-elements'
import { Ionicons } from '@expo/vector-icons';


 
export default class TabViewExample extends React.Component {
  state = {
    index: 0,
    routes: [
      { key: 'first', title: 'รายงาน' },
      { key: 'second', title: 'รอรายงาน' },
      { key: 'third', title: 'ประวัติรายงาน' }
    ],
    menu:[]
  };
  static navigationOptions = { 
    title: 'ระบบรายงาน',
    headerStyle: {
      backgroundColor: '#83c336',
    }, 
    headerLeft: (
      null
    ),
    headerRight: (
    
    <Ionicons name="md-log-out" onPress={() => alert('This is a button!')} size={32} color="white" style={{marginRight:10}} />
   ),
    headerTintColor: 'white'
  }
 componentWillMount(){
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
    user:this.props.navigation.state.params.user
  }) 
 }
 
  render() {
    console.log(this.props)
    const FirstRoute = () => (
      <View>
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
            onPress={() => this.onClickReport(l.reportcat_id,l.reportcat_thname,l.reportcat_id)}
          />
        ))
      }
      
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
  <View></View>
);

const ThirdRoute = () => (
  <View style={[styles.scene, { backgroundColor: '#673ab8' }]} />
);

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});