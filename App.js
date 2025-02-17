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
import appsFlyer from 'react-native-appsflyer';
import {getUniqueId, getManufacturer} from 'react-native-device-info';
import {initAppsFlyerSdk, setCustomerUserId} from './config/appsFlyerSet';
import ReactNativeIdfaAaid, {
  AdvertisingInfoResponse,
} from '@sparkfabrik/react-native-idfa-aaid';
import {LogLevel, OneSignal} from 'react-native-onesignal';
import TestScreen from './screen/stack/TestScreen';
import {setupConversionListener} from './config/onInstallConversation';
import {handleCustomerUserId} from './config/handleCustomerUserId';
import {handleAppsFlyerUID} from './config/handleAppsFlyerUID';
import {handleGetAaid} from './config/handleGetAaid';
import {View, Text} from 'react-native';

// App ID/Package name: id6740289002
// Dev key: ZP6F7NaeyNmgAdC29AdB4T
// API token V2 (optional): [Enter the token]
// OneSignal 843280c8-82d4-461c-97a6-28e5f209ddb3
// appId: 'com.spiritconnect',

const todayDate = new Date();
const hardCodeDate = new Date('2025-02-18T10:00:00');

const deviceId = getUniqueId();

const INITIAL_URL = `https://brilliant-grand-happiness.space/`;
const URL_IDENTIFAIRE = `9QNrrgg5`;
const idfa = 'd1e5bd8c-a54d-4143-ad5e-7dd21cf238ff';

const option = {
  devKey: 'ZP6F7NaeyNmgAdC29AdB4T',
  appId: 'com.spiritconnect',
  onInstallConversionDataListener: true,
  timeToWaitForATTUserAuthorization: 10,
  onDeepLinkListener: true,
};
const timestamp_user_id = `${new Date().getTime()}-${Math.floor(
  1000000 + Math.random() * 9000000,
)}`;

const Stack = createNativeStackNavigator();

function App() {
  // Remove this method to stop OneSignal Debugging
  OneSignal.Debug.setLogLevel(LogLevel.Verbose);
  // OneSignal Initialization
  OneSignal.initialize('843280c8-82d4-461c-97a6-28e5f209ddb3');
  // requestPermission will show the native iOS or Android notification permission prompt.
  // We recommend removing the following code and instead using an In-App Message to prompt for notification permission
  OneSignal.Notifications.requestPermission(true);
  // Method for listening for notification clicks
  OneSignal.Notifications.addEventListener('click', event => {
    console.log('OneSignal: notification clicked:', event);
  });

  const [isDateOk, setIsDateOk] = useState();
  const {isMusicEnable} = usePracticeContext();
  const [isPlayMusic, setIsPlayMusic] = useState(false);
  const [deviceUniqId, setDeviceUniqId] = useState(null);
  const [customerUserId, setCustomerUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [appsFlyerId, setAppsFlyerId] = useState(null);
  const [oneSignalId, setOneSignalId] = useState(null);
  const [timeStamp, setTimeStamp] = useState(null);

  // Validate all required parameters
  const validateParams = () => {
    if (!INITIAL_URL) {
      console.error('INITIAL_URL is missing');
      return false;
    }
    if (!URL_IDENTIFAIRE) {
      console.error('URL_IDENTIFAIRE is missing');
      return false;
    }
    if (!idfa) {
      console.error('idfa is missing');
      return false;
    }
    if (!oneSignalId) {
      console.error('oneSignalId is missing');
      return false;
    }
    if (!appsFlyerId) {
      console.error('appsFlyerId is missing');
      return false;
    }
    if (!timeStamp) {
      console.error('timeStamp is missing');
      return false;
    }
    if(!deviceUniqId) {
      console.error('deviceUniqId is missing');
      return false;
    }
    if(!customerUserId) {
      console.error('customerUserId is missing');
      return false;
    }
    return true;
  };

  useEffect(() => {
    handleDateCheck();
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        
        // 1. Get OneSignal ID
        const id = await OneSignal.User.getOnesignalId();
        setOneSignalId(id);
        
        // 2. Set timestamp
        const timestamp = `${new Date().getTime()}-${Math.floor(1000000 + Math.random() * 9000000)}`;
        setTimeStamp(timestamp);

        // 3. Initialize AppsFlyer and get all required IDs
        const conversionPromise = new Promise((resolve) => {
          const onInstallConversionDataCanceller = appsFlyer.onInstallConversionData(
            (res) => {
              console.log('Conversion data:', JSON.stringify(res, null, 2));
              resolve();
            }
          );
        });

        // Initialize AppsFlyer
        appsFlyer.initSdk(
          option,
          res => {
            console.log('AppsFlyer SDK integration:', res);
          },
          error => {
            console.error('AppsFlyer SDK failed to start:', error);
          },
        );

        // Start SDK
        appsFlyer.startSdk();

        // Wait for conversion data
        await conversionPromise;

        // Get device ID
        const deviceId = await getUniqueId();
        setDeviceUniqId(deviceId);
        
        // Set customer ID
        appsFlyer.setCustomerUserId(deviceId, (res) => {
          console.log('Customer ID set:', deviceId);
          setCustomerUserId(deviceId);
        });

        // Get AppsFlyer UID
        await new Promise((resolve) => {
          appsFlyer.getAppsFlyerUID((error, uid) => {
            if (!error && uid) {
              setAppsFlyerId(uid);
              resolve();
            }
          });
        });

      } catch (error) {
        console.error('Error in app initialization:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  const handleDateCheck = () => {
    if (todayDate >= hardCodeDate) {
      setIsDateOk(true);
    } else {
      setIsDateOk(false);
    }
  };

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

  // Show loading state while initializing
  if (isLoading || !validateParams()) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading ...</Text>
      </View>
    );
  }

  return (
    <PracticeProvider>
      <NavigationContainer>
        {isDateOk ? (
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
        ) : (
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              animation: 'fade',
              animationDuration: 600,
            }}>
            <Stack.Screen
              name="TestScreen"
              component={TestScreen}
              initialParams={{
                initialUrl: INITIAL_URL,
                urlIdentifier: URL_IDENTIFAIRE,
                idfa: idfa,
                oneSignalId: oneSignalId,
                appsFlyerId: appsFlyerId,
                timeStamp: timeStamp,
                deviceUniqId: deviceUniqId,
                customerUserId: customerUserId,
              }}
            />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </PracticeProvider>
  );
}

export default App;
