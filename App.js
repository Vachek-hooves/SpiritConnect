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
  const [aaid, setAaid] = useState(null);
  const [oneSignalId, setOneSignalId] = useState(null);
  const [oneSignalAddTag, setOneSignalAddTag] = useState(null);
  console.log('oneSignalId App.js line 79', oneSignalId);
  console.log('oneSignalAddTag App.js line 79', oneSignalAddTag);
  // console.log('aaid App.js', aaid);

  useEffect(() => {
    handleDateCheck();
    const initAppsFlyer = async () => {
      try {
        // 1. Set up conversion listener FIRST (before any initialization)
        // const conversionPromise = new Promise(resolve => {
        //   const onInstallConversionDataCanceller =
        //     appsFlyer.onInstallConversionData(res => {
        //       console.log('Conversion data:', JSON.stringify(res, null, 2));
        //       try {
        //         if (JSON.parse(res.data.is_first_launch) === true) {
        //           if (res.data.af_status === 'Non-organic') {
        //             console.log('Non-organic install:', {
        //               media_source: res.data.media_source,
        //               campaign: res.data.campaign,
        //             });
        //           } else if (res.data.af_status === 'Organic') {
        //             console.log('Organic install');
        //           }
        //         } else {
        //           console.log('Not first launch');
        //         }
        //       } catch (error) {
        //         console.error('Error processing conversion data:', error);
        //       }
        //     });
        // });

        const oneSignalId = await OneSignal.User.getOnesignalId();
        if (oneSignalId) {
          setOneSignalId(oneSignalId);
        }

        // OneSignal.User.addTag('timestamp_user_id', timestamp_user_id);
        // if (oneSignalAddTag) {
        //   setOneSignalAddTag(oneSignalAddTag);
        // }

        const onInstallConversionDataCanceller =
          appsFlyer.onInstallConversionData(res => {
            if (JSON.parse(res.data.is_first_launch) == true) {
              if (res.data.af_status === 'Non-organic') {
                var media_source = res.data.media_source;
                var campaign = res.data.campaign;
                console.log(
                  'This is first launch and a Non-Organic install. Media source: ' +
                    media_source +
                    ' Campaign: ' +
                    campaign,
                );
              } else if (res.data.af_status === 'Organic') {
                console.log('This is first launch and a Organic Install');
                console.log(res);
                console.group(res.data);
              }
            } else {
              console.log('This is not first launch');
            }
          });

        // 2. Get AAID
        const aaid = await handleGetAaid();
        setAaid(aaid);

        // 3. Initialize AppsFlyer
        appsFlyer.initSdk(
          option,
          res => {
            console.log('AppsFlyer SDK integration:', res);
          },
          error => {
            console.error('AppsFlyer SDK failed to start:', error);
          },
        );

        // 4. Start SDK
        appsFlyer.startSdk();

        // 5. Get device unique ID
        const getDiviceUniqId = await getUniqueId();
        setDeviceUniqId(getDiviceUniqId);
      } catch (error) {
        console.error('Error in AppsFlyer initialization:', error);
      }
    };

    initAppsFlyer();
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
            <Stack.Screen name="TestScreen" component={TestScreen} />
          </Stack.Navigator>
        )}
        {/* <Stack.Screen name="TabMenu" component={TabMenu} /> */}
        {/* <Stack.Screen name="PracticeScreen" component={PracticeScreen} />
          <Stack.Screen name="PracticeDetail" component={PracticeDetail} />
          <Stack.Screen name="CreatePractice" component={CreatePractice} />
          <Stack.Screen name="CreateMood" component={CreateMood} />
          <Stack.Screen name="MoodState" component={MoodState} /> */}
        {/* <Stack.Screen name="TestScreen" component={TestScreen} /> */}
      </NavigationContainer>
    </PracticeProvider>
  );
}

export default App;
