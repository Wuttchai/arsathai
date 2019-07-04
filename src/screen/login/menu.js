import React from "react";
import{ View, StyleSheet, Text, AsyncStorage } from "react-native";  
import Buttonx from './../login/Button';
import AssetExample from './../login/AssetExample';
import { Button } from 'react-native-elements'; 

import { Ionicons } from '@expo/vector-icons';
export default class App extends React.Component {    
      static navigationOptions = {
        header:null
   }
   logout= async () =>{
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth'); 
  }
    render() { 
      return (
        <View style={styles.container}>
          <View  style={{alignItems: 'flex-end'}}>
        
          <Button
              onPress={() => this.logout()}
              icon={
              <Ionicons name="md-log-out"  size={20} color="white" style={{marginRight:10}} />
              }
              iconLeft
              title="ออกระบบ"
              buttonStyle={{
                height: 30,
                width: "20%",
                backgroundColor: '#83c336'
              }}
              titleStyle={{
                fontSize:10
              }}
              
          />
                
           </View>
            <AssetExample />
            <Buttonx />
        </View>
      );
    }
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: "15%",
      backgroundColor: '#effde3',
      padding: 8,
    },
    paragraph: {
      margin: 24,
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    }, 
  });

  