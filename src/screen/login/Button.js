import * as React from 'react';
import { Text, View, StyleSheet, Image, Button, TouchableHighlight, Linking } from 'react-native';  
import NavigationService from '../../NavigationService';
export default class AssetExample extends React.Component {
 
  render() {   
    return (
      <View style={styles.container}>
        <TouchableHighlight style={styles.buttonContainer}>
          <Button title="สร้างรายงาน" color="#83c336" onPress={() => NavigationService.navigate('login')}/>
          </TouchableHighlight>
        <TouchableHighlight style={styles.buttonContainer}>
              <Button title="ติดตาม" color="#83c336" onPress={() => Linking.openURL("http://www.nevt.deqp.go.th/DEQP_NEVT/nevt_v2/index.php?page=1")} />
              </TouchableHighlight>
              <TouchableHighlight style={styles.buttonContainer}>
                  <Button title="รายงานพื้นที่สีเขียว" color="#83c336" onPress={() => Linking.openURL("http://www.greenarea.deqp.go.th/")} />
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
