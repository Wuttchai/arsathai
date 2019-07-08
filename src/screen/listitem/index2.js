import * as React from 'react';
import { View, StyleSheet, Dimensions,Button, AsyncStorage } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { ListItem, Badge, Text  } from 'react-native-elements' 
export default class TabViewExample extends React.Component {
  
  state = {
    routes: [],
    index: 0,
    routes: [
      { key: 'first', title: 'รายงาน' },
      { key: 'second', title: 'รอรายงาน' },
      { key: 'third', title: 'ประวัติรายงาน' }
    ],
    loaded: false,
    
    menu:[],
    reportsess:[],
    user:[],
    datafail:[],
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
  logout= async () =>{
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth'); 
  }
  blackpage= () =>{
    AsyncStorage.removeItem('user');
    this.props.navigation.navigate('menu');
  }
  componentDidMount(){
  _this = this;
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
    
      fetch("http://www.nevt.deqp.go.th/DEQP_NEVT/nevt_v2/api/api_get_report.php?uiid="+datauser.user_id)
    .then((response) =>  response.json())
    .then((responseJson) => {       
            me.setState({
              reportsess:responseJson 
            })
    })
    } 
 }).done();   
 
 AsyncStorage.getItem("Datafail").then((value) => {  
  if(value != null){  
    me.setState({
      //datafail:JSON.parse(value)
    })
  }
}).done();   
  
 
 }
 



 onClickReport = (reportcat_set, reportname_set, reportcat_id,iconreport) => {
  this.props.navigation.navigate('formreport', { 
    idreport: reportcat_set,
    namereport:reportname_set,
    reportcat_id:reportcat_id,
    user:this.state.user,
    iconreport:iconreport
  }) 
 }
 
  render() {  
    console.disableYellowBox = true; 
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
            onPress={() => this.onClickReport(l.reportcat_id,l.reportcat_thname,l.reportcat_id,l.reportcat_icon)}
          />
        ))
      }
      
    </View>
    );
    console.log()
    const SecondRoute = () => (
      <View>
        {
         
          
          this.state.datafail.map((o, x) => (             
            <ListItem  
             
            />
          ))
          
          
           


        }
      
    </View>
    );
    const  ThirdRoute = () => (
      <View>
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
 

 
 




const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});