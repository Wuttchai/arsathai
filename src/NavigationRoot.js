import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';
import listitem from './screen/listitem';
import listitem2 from './screen/lisitem2';
import listitem3 from './screen/lisitem3';
import formreport from './screen/listitem/formreport';
import map from './screen/listitem/camera';
import menu from './screen/login/menu';
import login from './screen/login';  
import AuthLoadingScreen from './screen/login/AuthLoadingScreen'; 
import test from './screen/testlogin/index';

const AppStack = createStackNavigator({ 
  
  listitem2:{ screen:listitem2},
    menu:{ screen:menu},   
    listitem:{ screen:listitem},
    
    listitem3:{ screen:listitem3},
    formreport:{ screen:formreport},
    map:{ screen:map},  
});
const AuthStack = createStackNavigator({ 
    login:{ screen:login},
});   



export default createAppContainer(createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'AuthLoading',
    }
  ));