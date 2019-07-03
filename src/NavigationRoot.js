import { createStackNavigator, createAppContainer } from 'react-navigation';
import listitem from './screen/listitem';
import listitem2 from './screen/lisitem2';
import listitem3 from './screen/lisitem3';
import formreport from './screen/listitem/formreport';
import map from './screen/listitem/camera';
import menu from './screen/login/menu';
import login from './screen/login'; 
import testlogin from './screen/testlogin'; 
const optsNavigation = {
    initialRouteName:"testlogin" 
}
const navigationRoot = createStackNavigator({
    menu:{ screen:menu},
    login:{ screen:login},
    listitem:{ screen:listitem},
    listitem2:{ screen:listitem2},
    listitem3:{ screen:listitem3},
    formreport:{ screen:formreport},
    map:{ screen:map}, 
    testlogin:{ screen:testlogin},
},optsNavigation)

export default createAppContainer(navigationRoot)