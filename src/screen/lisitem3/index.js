import React from 'react'; 
import Listitem from './lisitem3'; 

export default class App extends React.Component {
  
    static navigationOptions = ({ navigation }) => {
        return {
          headerTitle: 'รายงานข้อมูลต้นไม้',
          headerStyle: {
            backgroundColor: '#83c336',
          },
          
          
         headerTintColor: 'white'
        };
      };

  render() {  
    return (          
      <Listitem  />
    );
  }
}