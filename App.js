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
  // console.log('aaid App.js', aaid);

  useEffect(() => {
    const initAppsFlyer = async () => {
      try {
        console.log('Starting AppsFlyer setup...');
        
        // 1. Create a Promise that will timeout after 10 seconds
        const getConversionData = () => {
          return new Promise((resolve) => {
            console.log('Setting up conversion listener');
            
            // Set a timeout to resolve after 10 seconds
            const timeoutId = setTimeout(() => {
              console.log('⚠️ Conversion data timeout - no response received');
              resolve({ response: null, canceller: null });
            }, 10000);

            const onInstallConversionDataCanceller = appsFlyer.onInstallConversionData(
              (res) => {
                console.log('🎯 Conversion callback received!');
                clearTimeout(timeoutId); // Clear the timeout as we got a response
                
                if (res && res.data) {
                  console.log('📦 Conversion data:', {
                    is_first_launch: res.data.is_first_launch,
                    af_status: res.data.af_status,
                    type: res.type,
                    status: res.status
                  });
                  console.log('af_status - ', res.data.af_status);
                } else {
                  console.log('⚠️ No data in conversion response');
                }
                
                resolve({ 
                  response: res, 
                  canceller: onInstallConversionDataCanceller 
                });
              }
            );
            
            // Log the listener setup completion
            console.log('✅ Conversion listener setup complete');
          });
        };

        // 2. Start the conversion data listener
        const conversionPromise = getConversionData();
        
        // 3. Initialize SDK with debug options
        const options = {
          devKey: 'ZP6F7NaeyNmgAdC29AdB4T',
          appId: 'com.spiritconnect',
          onInstallConversionDataListener: true,
          isDebug: true,
          debug: true // Additional debug flag
        };

        // 4. Initialize SDK
        console.log('🚀 Initializing AppsFlyer SDK');
        appsFlyer.initSdk(
          options,
          (result) => {
            console.log('✨ SDK Init success:', result);
            console.log('🔄 Starting SDK explicitly');
            appsFlyer.startSdk();
          },
          (error) => {
            console.error('❌ SDK Init failed:', error);
          }
        );

        // 5. Wait for conversion data with timeout
        console.log('⏳ Waiting for conversion data...');
        const { response, canceller } = await conversionPromise;
        
        if (response) {
          console.log('🎉 Conversion data received!');
          try {
            const isFirstLaunch = JSON.parse(response?.data?.is_first_launch);
            console.log('📱 First launch?', isFirstLaunch);
            
            if (isFirstLaunch === true) {
              if (response.data.af_status === 'Non-organic') {
                console.log('🔥 Non-organic install:', {
                  media_source: response.data.media_source,
                  campaign: response.data.campaign
                });
              } else if (response.data.af_status === 'Organic') {
                console.log('🌱 Organic install');
                console.log('🔥 Organic install:', {
                  media_source: response.data.media_source,
                  campaign: response.data.campaign
                });
              }
            } else {
              console.log('🔄 Not first launch');
            }
          } catch (error) {
            console.error('❌ Error processing data:', error);
          }
        }

        // 6. Get UID for verification
        appsFlyer.getAppsFlyerUID((error, uid) => {
          if (uid) {
            console.log('🔑 AppsFlyer UID:', uid);
          } else {
            console.error('❌ Error getting UID:', error);
          }
        });

        return () => {
          if (canceller) {
            console.log('🧹 Cleaning up conversion listener');
            canceller();
          }
        };
      } catch (error) {
        console.error('❌ Error in AppsFlyer setup:', error);
      }
    };

    initAppsFlyer();
  }, []);

  const initAppsFlyer = async () => {
    // launch before appsflyer init. First install registration
    // const onInstallConversionDataCanceller = appsFlyer.onInstallConversionData(
    //   res => {
    //     if (JSON.parse(res.data.is_first_launch) == true) {
    //       if (res.data.af_status === 'Non-organic') {
    //         var media_source = res.data.media_source;
    //         var campaign = res.data.campaign;
    //         console.log(
    //           'This is first launch and a Non-Organic install. Media source: ' +
    //             media_source +
    //             ' Campaign: ' +
    //             campaign,
    //         );
    //       } else if (res.data.af_status === 'Organic') {
    //         console.log('This is first launch and a Organic Install');
    //       }
    //     } else {
    //       console.log('This is not first launch');
    //     }
    //   },
    // );
    // onInstallConversionDataCanceller();

    // Set up conversion listener BEFORE initializing SDK
    // const conversionCanceller = setupConversionListener();

    const aaid = await handleGetAaid();
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

    // console.log('uniq id from getUniqueId', getDiviceUniqId);
    setDeviceUniqId(getDiviceUniqId);
    // console.log('AppsFlyer SDK integration:', appsFlyer);
    handleCustomerUserId(getDiviceUniqId);
    // appsFlyer.setCustomerUserId(
    //   deviceUniqId,
    //   res => {
    //     console.log('AppsFlyer SDK setCustomerUserId:', res);
    //   },
    //   error => {
    //     console.error('AppsFlyer SDK failed to setCustomerUserId:', error);
    //   },
    // );
    handleAppsFlyerUID();
    // appsFlyer.getAppsFlyerUID((err, appsFlyerUID) => {
    //   if (err) {
    //     console.error(err);
    //   } else {
    //     console.log('on getAppsFlyerUID: ', appsFlyerUID);
    //   }
    // });
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
          <Stack.Screen name="TestScreen" component={TestScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PracticeProvider>
  );
}

export default App;
