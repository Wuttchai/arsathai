import  React  from 'react';
import NavigationService from './src/NavigationService';
import NavigationRoot from './src/NavigationRoot';
const App = () =>  ( 
<NavigationRoot   
    ref={navigatorRef => {
      NavigationService.setTopLevelNavigator(navigatorRef);
    }}
/> 

);
 
export default App;
