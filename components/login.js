import * as React from 'react';
import { Text, View, StyleSheet, Image, Button, TouchableHighlight } from 'react-native';

export default class AssetExample extends React.Component {
 
  render() {  
    return (
      <View >
        <TouchableHighlight style={styles.buttonContainer}>
          <Button title="สร้างรายงาน" color="#00c910" onPress={() => this.props.navigation.navigate('Profile', { name: 'Brent' })}/>
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
 
