/*This is an Example of LongPress on Button Using TouchableOpacity*/
import React, { Component } from 'react';
//import react in our project
import { StyleSheet, View, Alert, TouchableOpacity, Text } from 'react-native';
//import all the components we will need in our project
 
export default class App extends Component {
  handlerLongClick = () => {
    //handler for Long Click
    Alert.alert(' Button Long Pressed');
  };
  handlerClick = () => {
    //handler for Long Click
    Alert.alert(' Button Long Pressed');
  };
  render() {
    return (
      <View style={styles.containerMain}>
        <TouchableOpacity
          onLongPress={this.handlerLongClick}
          onPress={this.handlerClick}
          //Here is the trick
          activeOpacity={0.6}
          style={styles.button}>
          <Text style={styles.TextStyle}> LONG PRESS THE BUTTON </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
 
const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    alignItems: 'center',
  },
 
  button: {
    width: '80%',
    height: 40,
    justifyContent: 'center',
    backgroundColor: '#EE5407',
  },
 
  TextStyle: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});