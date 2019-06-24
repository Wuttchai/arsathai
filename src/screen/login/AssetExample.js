import * as React from 'react';
import { Text, View, StyleSheet, Image, Button, TouchableOpacity } from 'react-native';

export default class AssetExample extends React.Component {
  render() {
    return (
      <View style={styles.container}>

        <Image style={styles.logo} source={require('../../../assets/icons/deqp_logo.png')} />

        <Text style={styles.paragraph}>
        กรมส่งเสริมคุณภาพสิ่งแวดล้อม
        </Text>
        <Text style={styles.paragraph2}>
        ระบบรายงานสถานการณ์สิ่งแวดล้อม
        </Text>


      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  paragraph: {
    margin: 10,
    marginTop: 0,
    paddingTop: "10%",
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#5a6650',
    
  },
  paragraph2: {
    margin: 10,
    marginTop: 0,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#5a6650',
  },
  logo: {
    height: 128,
    width: 128,
  },

});
