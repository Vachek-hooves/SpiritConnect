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
import {useState, useEffect, useMemo} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppState, BackHandler} from 'react-native';
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
import {Linking} from 'react-native';

// App ID/Package name: id6740289002
// Dev key: ZP6F7NaeyNmgAdC29AdB4T
// API token V2 (optional): [Enter the token]
// OneSignal 843280c8-82d4-461c-97a6-28e5f209ddb3

const option = {
  devKey: 'ZP6F7NaeyNmgAdC29AdB4T',
  appId: 'com.spiritconnect',
  onInstallConversionDataListener: true,
  onDeepLinkListener: true,
  timeToWaitForATTUserAuthorization: 10,
  manualStart: true,
};

const Stack = createNativeStackNavigator();
// const timestamp_user_id = `${new Date().getTime()}-${Math.floor(
//   1000000 + Math.random() * 9000000,
// )}`;
const generateTimestampUserId = () => {
  return `${new Date().getTime()}-${Math.floor(
    1000000 + Math.random() * 9000000,
  )}`;
};
const INITIAL_URL = `https://brilliant-grand-happiness.space/`;
const URL_IDENTIFAIRE = `9QNrrgg5`;
const targetData = new Date('2025-02-18T10:00:00Z');
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
  const [isFirstVisit, setIsFirstVisit] = useState(null);
  const [naming, setNaming] = useState(null);
  const [timeStamp, setTimeStamp] = useState(null);
  const [organicInstall, setOrganicInstall] = useState(null);
  const [sabData, setSabData] = useState(null);
  const [isConversionDataReceived, setIsConversionDataReceived] =
    useState(false);
  const [isNonOrganicInstall, setIsNonOrganicInstall] = useState(false);
  const [openWithPush, setOpenWithPush] = useState(false);
  const [isOneSignalReady, setIsOneSignalReady] = useState(false);
  console.log('Opened with push App.js', openWithPush);

  // // Remove this method to stop OneSignal Debugging
  // OneSignal.Debug.setLogLevel(LogLevel.Verbose);
  // // OneSignal Initialization
  // OneSignal.initialize('843280c8-82d4-461c-97a6-28e5f209ddb3');
  // // requestPermission will show the native iOS or Android notification permission prompt.
  // // We recommend removing the following code and instead using an In-App Message to prompt for notification permission
  // // Method for listening for notification clicks
  // OneSignal.Notifications.addEventListener('click', event => {
  //   // console.log('OneSignal: notification clicked:', event);
  //   // console.log('🔔 Notification:', event.notification);
  // });
  // // OneSignal.Notifications.addEventListener('foregroundWillDisplay', event => {
  // //   console.log('🔔 Notification received in foreground:', event);
  // // });
  // // OneSignal.Notifications.addEventListener('permissionChanged', event => {
  // //   console.log('🔔 Permission changed:', event);
  // // });
  // OneSignal.Notifications.requestPermission(true).then(response => {
  //   // console.log('OneSignal: notification request permission:', response);
  //   OneSignal.User.getOnesignalId().then(userId => {
  //     // console.log('OneSignal: user id:', userId);
  //     setOneSignalUserId(userId);
  //   });
  //   setOneSignalPermissionStatus(response);
  // // });

  // Initialize OneSignal
  useEffect(() => {
    const initOneSignal = async () => {
      // Remove this method to stop OneSignal Debugging
      OneSignal.Debug.setLogLevel(LogLevel.Verbose);
      // OneSignal Initialization
      OneSignal.initialize('843280c8-82d4-461c-97a6-28e5f209ddb3');

      try {
        // Request permission and get user ID
        const permissionResult = await OneSignal.Notifications.requestPermission(true);
        console.log('OneSignal permission result:', permissionResult);
        setOneSignalPermissionStatus(permissionResult)
        

        if (permissionResult) {
          const userId = await OneSignal.User.getOnesignalId();
          console.log('OneSignal: user id:', userId);
          
          if (userId) {
            setOneSignalUserId(userId);
            await AsyncStorage.setItem('oneSignalUserId', userId);
            setIsOneSignalReady(true);
          } else {
            // If no userId, set up a listener for when it becomes available
            const userStateChangedListener = OneSignal.User.addEventListener('change', async (event) => {
              const newUserId = await OneSignal.User.getOnesignalId();
              if (newUserId) {
                console.log('OneSignal: got delayed user id:', newUserId);
                setOneSignalUserId(newUserId);
                await AsyncStorage.setItem('oneSignalUserId', newUserId);
                setIsOneSignalReady(true);
                userStateChangedListener.remove();
              }
            });
          }
        }
      } catch (error) {
        console.error('Error initializing OneSignal:', error);
        // Fallback: try to get stored userId
        const storedUserId = await AsyncStorage.getItem('oneSignalUserId');
        if (storedUserId) {
          setOneSignalUserId(storedUserId);
          setIsOneSignalReady(true);
        }
      }
    };

    initOneSignal();
  }, []);

  useEffect(() => {
    checkFirstVisit();
    isReadyToVisitHandler();
    initAppsFlyer();
    // getOneSignalUserId();

    // If it's not first visit, mark conversion data as received immediately
    if (!isFirstVisit) {
      setIsConversionDataReceived(true);
    }
  }, [isFirstVisit]);

  // const getOneSignalUserId = async () => {
  //   const userId = await OneSignal.User.getOnesignalId();
  //   setOneSignalUserId(userId);
  // };

  const checkFirstVisit = async () => {
    try {
      const hasVisited = await AsyncStorage.getItem('hasVisitedBefore');
      // console.log('hasVisited', hasVisited);

      // Get stored timestamp_user_id first
      let storedTimeStamp = await AsyncStorage.getItem('timeStamp');
      if (!storedTimeStamp) {
        // Generate new timestamp_user_id only if none exists
        storedTimeStamp = generateTimestampUserId();
        await AsyncStorage.setItem('timeStamp', storedTimeStamp);
        // console.log('Generated new timestamp_user_id:', storedTimeStamp);
      } else {
        // console.log('Retrieved stored timestamp_user_id:', storedTimeStamp);
      }

      // Set timestamp for use in app
      setTimeStamp(storedTimeStamp);

      if (!hasVisited) {
        // console.log('First visit');
        setIsFirstVisit(true);

        OneSignal.User.addTag('timestamp_user_id', storedTimeStamp);

        // First visit
        await fetch(
          `${INITIAL_URL}${URL_IDENTIFAIRE}?utretg=uniq_visit&jthrhg=${storedTimeStamp}`,
        );
        await AsyncStorage.setItem('hasVisitedBefore', 'true');
      } else {
        // Returning user

        // const timeStamp = await AsyncStorage.getItem('timeStamp');
        // console.log('timeStamp Returning user', timeStamp);
        // console.log('Returning user, using stored timestamp:', storedTimeStamp);
        setIsFirstVisit(false);
        // setTimeStamp(parsedTimeStamp);
      }
    } catch (error) {
      console.error('Error checking first visit:', error);
    }
  };

  const isReadyToVisitHandler = async () => {
    // console.log('isFirstVisit',isFirstVisit);
    // console.log('isReadyToVisitHandler fn check start');
    // console.log('timeStamp',timeStamp);
    const hasVisited = await AsyncStorage.getItem('hasVisitedBefore');
    const visitUrl = `${INITIAL_URL}${URL_IDENTIFAIRE}`;

    if (currentDate >= targetData) {
      // console.log('Date is after target date');
      // console.log('Today date passed target date');
      if (hasVisited) {
        setIsReadyToVisit(true);
        console.log('App WAS visited before');
      }
      if (!hasVisited) {
        console.log('App WAS NOT visited before');
        fetch(visitUrl)
          .then(res => {
            // console.log('visitUrl',visitUrl);
            // console.log('URL status ', res.status);
            if (res.status === 200) {
              console.log('URL is ok. Status 200');
              // console.log('res.data first launch', res.url);
              // console.log('res.data first launch', res.status);
              setIsReadyToVisit(true);
            } else {
              console.log('URL is not ok');
              setIsReadyToVisit(false);
            }
          })
          .catch(error => {
            console.log('isReadyToVisit fn check error', error);
          });
      }
    } else {
      console.log('Today date did not pass target date');
    }
  };

  const initAppsFlyer = async () => {
    // Set up conversion listener first
    // appsFlyer.onInstallConversionData( async (res) => {
    //   if (JSON.parse(res.data.is_first_launch) == true) {
    //     if (res.data.af_status === 'Non-organic') {
    //       var media_source = res.data.media_source;
    //       var campaign = res.data.campaign;
    //       console.log(
    //         'First launch - Non-Organic install. Campaign:',
    //         campaign,
    //       );
    //       // setSabData(campaign);
    //       setIsNonOrganicInstall(true);
    //       await AsyncStorage.setItem('sabData', campaign);

    //     } else if (res.data.af_status === 'Organic') {
    //       setIsNonOrganicInstall(false);
    //       const sabDataTest = 'organic_first_launch_test';
    //       AsyncStorage.setItem('sabData', sabDataTest);
    //       console.log(
    //         'First launch - Organic install. Setting test data:',
    //         sabDataTest,
    //       );
    //       // setSabData(sabDataTest);
    //     }
    //   }
    //   setIsConversionDataReceived(true);
    // });

    appsFlyer.onInstallConversionData(async res => {
      if (JSON.parse(res.data.is_first_launch) == true) {
        if (res.data.af_status === 'Non-organic') {
          var media_source = res.data.media_source;
          var campaign = res.data.campaign;
          console.log(
            'First launch - Non-Organic install. Campaign:',
            campaign,
          );
          setSabData(campaign);
          // Save campaign data
          try {
            await AsyncStorage.setItem('sabData', campaign);
            setIsNonOrganicInstall(true);
            await AsyncStorage.setItem('isNonOrganicInstall', 'true');
          } catch (error) {
            console.error('Error saving non-organic data:', error);
          }
        } else if (res.data.af_status === 'Organic') {
          
          const sabDataTest = '';
          // setSabData(sabDataTest);
          // Save organic test data
          try {
            await AsyncStorage.setItem('sabData', sabDataTest);
            setIsNonOrganicInstall(false);
            await AsyncStorage.setItem('isNonOrganicInstall', 'false');
          } catch (error) {
            console.error('Error saving organic data:', error);
          }
        }
      } else {
        // Not first launch - try to get stored data
        try {
          const storedSabData = await AsyncStorage.getItem('sabData');
          if (storedSabData) {
            console.log('Retrieved stored sabData:', storedSabData);
            setSabData(storedSabData);
          }
        } catch (error) {
          console.error('Error retrieving stored sabData:', error);
        }
      }
      setIsConversionDataReceived(true);
    });

    // Rest of AppsFlyer initialization
    const aaid = await handleGetAaid();
    setAaid(aaid);

    // handleInitSdk();
    appsFlyer.initSdk(
      option,
      res => {
        // console.log('AppsFlyer SDK integration:', res);
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
        // console.log('AppsFlyer SDK setCustomerUserId:', res);
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
        // console.log('App.js on getAppsFlyerUID: ', appsFlyerUID);
        setApplsFlyerUID(appsFlyerUID);
      }
    });
  };

  // useEffect(() => {
  //   const subscription = AppState.addEventListener('change', nextAppState => {
  //     if (nextAppState === 'active' && isPlayMusic && isMusicEnable) {
  //       playBackgroundMusic();
  //     } else if (nextAppState === 'inactive' || nextAppState === 'background') {
  //       pauseBackgroundMusic();
  //     }
  //   });

  //   const initMusic = async () => {
  //     await setupPlayer();
  //     if (isMusicEnable) {
  //       await playBackgroundMusic();
  //       setIsPlayMusic(true);
  //     }
  //   };
  //   initMusic();

  //   return () => {
  //     subscription.remove();
  //     pauseBackgroundMusic();
  //   };
  // }, [isMusicEnable]);

  const handleNotificationClick = async event => {
    // console.log('🔔 Handling notification click:', event);
    const timeStamp = await AsyncStorage.getItem('timeStamp');
    // console.log('🔔 timeStamp inside handleNotificationClick', timeStamp);

    const baseUrl = `${INITIAL_URL}${URL_IDENTIFAIRE}`;
    let finalUrl;

    // Check if it's first visit
    const hasVisited = await AsyncStorage.getItem('hasVisitedBefore');

    if (!hasVisited) {
      // First time visit case
      // finalUrl = `${baseUrl}?utretg=uniq_visit&jthrhg=${timestamp_user_id}`;
    } else if (event.notification.launchURL) {
      // Has launchURL case
      finalUrl = `${baseUrl}?utretg=push_open_browser&jthrhg=${timeStamp}`;
    } else {
      // Regular webview case
      finalUrl = `${baseUrl}?utretg=push_open_webview&jthrhg=${timeStamp}`;
      setOpenWithPush(true);
    }

    console.log('🔔 Constructed finalUrl:', finalUrl);

    try {
      // Send request to the constructed URL
      const response = await fetch(finalUrl);
      console.log('🔔 timeStamp inside try', timeStamp);
      console.log('🔔 URL fetch response status:', response.status);

      // Handle different cases after fetch
      if (!hasVisited) {
        // First visit - mark as visited after successful fetch
        await AsyncStorage.setItem('hasVisitedBefore', 'true');
      } else if (event.notification.launchURL) {
        // Browser case - open in external browser
        await Linking.openURL(finalUrl);
      } else {
        // WebView case - update app state for navigation
        setIsReadyToVisit(true);
      }
    } catch (error) {
      console.error('🔔 Error fetching URL:', error);
    }

    return finalUrl;
  };

  useEffect(() => {
    const setupNotifications = async () => {
      try {
        // Add notification click listener with the handler
        const clickListener = OneSignal.Notifications.addEventListener(
          'click',
          event => {
            // console.log('🔔 Notification clicked:', event);
            handleNotificationClick(event);
          },
        );
        // ... rest of your notification setup ...

        return () => {
          clickListener.remove();
          // ... other cleanup ...
        };
      } catch (error) {
        console.error('🔔 Error setting up notifications:', error);
      }
    };

    setupNotifications();
  }, []);

  // Update isReadyForTestScreen to include OneSignal check
  const isReadyForTestScreen = useMemo(() => {
    console.log('Ready check:', {
      // isReadyToVisit,
      // aaid,
      // applsFlyerUID,
      // idfv,
      // timeStamp,
      // isConversionDataReceived,
      // oneSignalUserId,
      // isOneSignalReady
    });

    // Basic requirements for all launches
    const baseRequirements =
      isReadyToVisit &&
      aaid &&
      applsFlyerUID &&
      idfv &&
      timeStamp &&
      isConversionDataReceived &&
      isOneSignalReady &&
      oneSignalUserId;

    // For first launch, also require sabData
    if (isFirstVisit) {
      return baseRequirements;
    }

    // For subsequent launches, only need base requirements
    return baseRequirements;
  }, [
    isReadyToVisit,
    aaid,
    applsFlyerUID,
    idfv,
    timeStamp,
    isConversionDataReceived,
    isOneSignalReady,
    oneSignalUserId,
    isFirstVisit
  ]);

  return (
    <PracticeProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            animationDuration: 600,
          }}>
          {isReadyForTestScreen ? (
            <Stack.Screen
              name="TestScreen"
              component={TestScreen}
              initialParams={{
                idfa: aaid,
                oneSignalUserId, // Now guaranteed to have a value
                idfv,
                applsFlyerUID,
                jthrhg: timeStamp,
                isFirstVisit,
                timeStamp,
                naming,
                oneSignalPermissionStatus,
                isNonOrganicInstall,
                openWithPush,
                ...(isFirstVisit && {sabData}),
              }}
            />
          ) : (
            <>
              <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
              <Stack.Screen name="TabMenu" component={TabMenu} />
              <Stack.Screen name="PracticeScreen" component={PracticeScreen} />
              <Stack.Screen name="PracticeDetail" component={PracticeDetail} />
              <Stack.Screen name="CreatePractice" component={CreatePractice} />
              <Stack.Screen name="CreateMood" component={CreateMood} />
              <Stack.Screen name="MoodState" component={MoodState} />
            </>
          )}

          {/* <Stack.Screen name="TestScreen" component={TestScreen} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </PracticeProvider>
  );
}

export default App;

//  Check params before launch if not exist, add to url

// if (isReadyToVisit) {
//   return (
//     <PracticeProvider>
//       <NavigationContainer>
//         <Stack.Navigator
//           screenOptions={{
//             headerShown: false,
//             animation: 'fade',
//             animationDuration: 600,
//           }}>
//           <Stack.Screen
//             name="TestScreen"
//             component={TestScreen}
//             initialParams={{
//               ...(aaid && { idfa: aaid }),
//               ...(oneSignalUserId && { oneSignalUserId }),
//               ...(idfv && { idfv }),
//               ...(applsFlyerUID && { applsFlyerUID }),
//               ...(timestamp_user_id && { jthrhg: timestamp_user_id }),
//             }}
//           />
//         </Stack.Navigator>
//       </NavigationContainer>
//     </PracticeProvider>
//   );
// }
