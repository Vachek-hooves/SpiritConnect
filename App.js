import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {
  MoodState,
  // StackBreath,
  StackCreateMood,
  CreatePractice,
  StackMeditation,
  StackNotification,
  StackPracticeDetail,
  StackPracticeScreen,
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
          <Stack.Screen name="StackMeditation" component={StackMeditation} />
          {/* <Stack.Screen name="StackBreath" component={StackBreath} /> */}
          <Stack.Screen
            name="StackNotification"
            component={StackNotification}
          />
          <Stack.Screen
            name="StackPracticeScreen"
            component={StackPracticeScreen}
          />
          <Stack.Screen
            name="StackPracticeDetail"
            component={StackPracticeDetail}
          />
          <Stack.Screen
            name="CreatePractice"
            component={CreatePractice}
          />
          <Stack.Screen name="StackCreateMood" component={StackCreateMood} />
          <Stack.Screen name="MoodState" component={MoodState} />
        </Stack.Navigator>
      </NavigationContainer>
    </PracticeProvider>
  );
}

export default App;
