import {StyleSheet, Text, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  TabDiary,
  TabMainScreeen,
  TabPractices,
  TabProfile,
} from '../screen/tab';
const Tab = createBottomTabNavigator();

const TabMenu = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}>
      <Tab.Screen name="TabMainScreen" component={TabMainScreeen} />
      <Tab.Screen name="TabPractices" component={TabPractices} />
      <Tab.Screen name="TabDiary" component={TabDiary} />
      <Tab.Screen name="TabProfile" component={TabProfile} />
    </Tab.Navigator>
  );
};

export default TabMenu;

const styles = StyleSheet.create({});
