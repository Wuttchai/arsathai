import { createStackNavigator, createAppContainer } from 'react-navigation';
import listitem from './screen/listitem';
import listitem2 from './screen/lisitem2';
import formreport from './screen/listitem/formreport';
import map from './screen/listitem/camera';
import menu from './screen/login/menu';
import login from './screen/login'; 
const optsNavigation = {
    initialRouteName:"menu" 
}
const navigationRoot = createStackNavigator({
    menu:{ screen:menu},
    login:{ screen:login},
    listitem:{ screen:listitem},
    listitem2:{ screen:listitem2},
    formreport:{ screen:formreport},
    map:{ screen:map}, 
},optsNavigation)

export default createAppContainer(navigationRoot)