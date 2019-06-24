import { createStackNavigator, createAppContainer } from 'react-navigation';
import listitem from './screen/listitem';
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
    formreport:{ screen:formreport},
    map:{ screen:map}, 
},optsNavigation)

export default createAppContainer(navigationRoot)