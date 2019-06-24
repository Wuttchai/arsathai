import * as React from 'react';
import { Text, View, StyleSheet, Image, Button, TouchableHighlight } from 'react-native';
import NavigationService from './../src/NavigationService';
export default class AssetExample extends React.Component {
 
  render() {  
    return (
      <View style={styles.container}>
        <TouchableHighlight style={styles.buttonContainer}>
          <Button title="สร้างรายงาน" color="#00c910" onPress={() => this.props.navigation.navigate('screenB', { name: 'Brent' })}/>
          </TouchableHighlight>
        <TouchableHighlight style={styles.buttonContainer}>
              <Button title="ติดตาม" color="#00c910" />
              </TouchableHighlight>
              <TouchableHighlight style={styles.buttonContainer}>
                  <Button title="รายงานพื้นที่สีเขียว" color="#00c910" />
                  </TouchableHighlight>
      </View>
    );
  }
}
const styles = StyleSheet.create({

  buttonContainer: {
  height: 45,
  marginBottom: 10,
  width: "100%",
  borderRadius: 20
}
});
