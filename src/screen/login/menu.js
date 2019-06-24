import React from "react";
import{ View, StyleSheet } from "react-native";  
import Button from './../login/Button';
import AssetExample from './../login/AssetExample';
export default class App extends React.Component {    
      static navigationOptions = {
        header:null
   }
    render() { 
      return (
        <View style={styles.container}>
            <AssetExample />
            <Button />
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

  