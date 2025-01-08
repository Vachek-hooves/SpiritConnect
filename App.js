import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {
  MoodState,
  // StackBreath,
  CreateMood,
  CreatePractice,
  // Meditation,

  PracticeDetail,
  PracticeScreen,
  // StackYoga,
  WelcomeScreen,
} from './screen/stack';
import {PracticeProvider} from './store/context';
import TabMenu from './TabNavigator/TabMenu';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <PracticeProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            animationDuration: 600,
          }}>
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
          <Stack.Screen name="TabMenu" component={TabMenu} />
          {/* <Stack.Screen name="StackYoga" component={StackYoga} /> */}
          {/* <Stack.Screen name="Meditation" component={Meditation} /> */}
          {/* <Stack.Screen name="StackBreath" component={StackBreath} /> */}
       
          <Stack.Screen
            name="PracticeScreen"
            component={PracticeScreen}
          />
          <Stack.Screen
            name="PracticeDetail"
            component={PracticeDetail}
          />
          <Stack.Screen
            name="CreatePractice"
            component={CreatePractice}
          />
          <Stack.Screen name="CreateMood" component={CreateMood} />
          <Stack.Screen name="MoodState" component={MoodState} />
        </Stack.Navigator>
      </NavigationContainer>
    </PracticeProvider>
  );
}

export default App;
