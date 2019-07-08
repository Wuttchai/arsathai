import React from 'react'; 
import Listitem from './lisitem'; 
export default class App extends React.Component {
  
    static navigationOptions = ({ navigation }) => {
        return {
          headerTitle: 'ระบบรายงาน',
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