import React from "react";
import{ View, StyleSheet, ActivityIndicator, StatusBar, AsyncStorage } from "react-native";
export default class App extends React.Component {    
    constructor() {
        super();
        this._bootstrapAsync();
      }
      _bootstrapAsync = async () => {
        const userToken = await AsyncStorage.getItem('userToken');
        this.props.navigation.navigate(userToken ? 'App' : 'Auth');
      };
      render() {
        return (
          <View style={styles.container}>
            <ActivityIndicator size="large" color="#83c336" />
             
          </View>
        );
      }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center'
    },
  });

  