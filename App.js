import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {
  MoodState,
  CreateMood,
  CreatePractice,
  PracticeDetail,
  PracticeScreen,
  WelcomeScreen,
} from './screen/stack';
import {PracticeProvider} from './store/context';
import TabMenu from './TabNavigator/TabMenu';
import {useState, useEffect} from 'react';
import {AppState} from 'react-native';
import {
  pauseBackgroundMusic,
  playBackgroundMusic,
  setupPlayer,
} from './components/Music/SoundConfig';
import {usePracticeContext} from './store/context';

const Stack = createNativeStackNavigator();
function App() {
  const {isMusicEnable} = usePracticeContext();
  const [isPlayMusic, setIsPlayMusic] = useState(false);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active' && isPlayMusic && isMusicEnable) {
        playBackgroundMusic();
      } else if (nextAppState === 'inactive' || nextAppState === 'background') {
        pauseBackgroundMusic();
      }
    });

    const initMusic = async () => {
      await setupPlayer();
      if (isMusicEnable) {
        await playBackgroundMusic();
        setIsPlayMusic(true);
      }
    };
    initMusic();

    return () => {
      subscription.remove();
      pauseBackgroundMusic();
    };
  }, [isMusicEnable]);

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
          <Stack.Screen name="PracticeScreen" component={PracticeScreen} />
          <Stack.Screen name="PracticeDetail" component={PracticeDetail} />
          <Stack.Screen name="CreatePractice" component={CreatePractice} />
          <Stack.Screen name="CreateMood" component={CreateMood} />
          <Stack.Screen name="MoodState" component={MoodState} />
        </Stack.Navigator>
      </NavigationContainer>
    </PracticeProvider>
  );
}

export default App;
