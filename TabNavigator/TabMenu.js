import {StyleSheet, Text, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {TabMainScreeen} from '../screen/tab';
const Tab = createBottomTabNavigator();

const TabMenu = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      
      }}>
      <Tab.Screen name="TabMainScreen" component={TabMainScreeen} />
    </Tab.Navigator>
  );
};

export default TabMenu;

const styles = StyleSheet.create({});
