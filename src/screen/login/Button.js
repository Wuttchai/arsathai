import * as React from 'react';
import { Text, View, StyleSheet, Image, Button, TouchableHighlight, Linking, AsyncStorage } from 'react-native';  
import NavigationService from '../../NavigationService';  
export default class AssetExample extends React.Component {
  constructor(props) {
    super(props);
   
 }
 
  render() {
    return (
      <View style={styles.container}>
        
        <TouchableHighlight style={styles.buttonContainer}> 
          <Button title="สร้างรายงาน" color="#83c336" onPress={() =>  NavigationService.navigate('listitem') }/>
          </TouchableHighlight>
        <TouchableHighlight style={styles.buttonContainer}>
              <Button title="ติดตาม" color="#83c336" onPress={() => Linking.openURL("http://www.nevt.deqp.go.th/DEQP_NEVT/nevt_v2/index.php?page=1")} />
              </TouchableHighlight>
              <TouchableHighlight style={styles.buttonContainer}>
                  <Button title="รายงานพื้นที่สีเขียว" color="#83c336" onPress={() =>  Linking.openURL("http://www.greenarea.deqp.go.th/")  } />
                  </TouchableHighlight>
                  <TouchableHighlight style={styles.buttonContainer}>
                  <Button title="สร้างข้อมูลต้นไม้" color="#83c336" onPress={() =>  NavigationService.navigate('listitem2')  } />
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
