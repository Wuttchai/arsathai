import React from 'react'; 
import Listitem from './lisitem2'; 

export default class App extends React.Component {
  
    static navigationOptions = ({ navigation }) => {
        return {
          headerTitle: 'รายงานข้อมูลแปลง',
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