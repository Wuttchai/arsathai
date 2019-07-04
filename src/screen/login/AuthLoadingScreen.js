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
            <ActivityIndicator />
            <StatusBar barStyle="default" />
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
  });

  