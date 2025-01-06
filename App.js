import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {WelcomeScreen} from './screen/stack';
import TabMenu from './TabNavigator/TabMenu';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          animationDuration: 600,
        }}>
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <Stack.Screen name="TabMenu" component={TabMenu} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
