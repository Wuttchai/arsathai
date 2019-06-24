import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Button } from 'react-native';

// You can import from local files
import AssetExample from './components/AssetExample';
import Buttonx from './components/Button';
// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
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
    backgroundColor: '#aef9b4',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
