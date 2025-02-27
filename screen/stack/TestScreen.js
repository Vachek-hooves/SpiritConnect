import {WebView} from 'react-native-webview';
import {useEffect, useCallback,useRef, useState} from 'react';
import {BackHandler, Linking, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TestScreen = ({route}) => {
  const INITIAL_URL = `https://brilliant-grand-happiness.space/`;
  const URL_IDENTIFAIRE = `9QNrrgg5`;
  const navigation = useNavigation();
  const webViewRef = useRef(null);
  const [sabData, setSabData] = useState(null);
  // const [isNonOrganic, setIsNonOrganic] = useState(false);
  const [isNonOrganicInstall, setIsNonOrganicInstall] = useState(false);
  const [hasSentPushOpenRequest, setHasSentPushOpenRequest] = useState(false);
  const [localOpenWithPush, setLocalOpenWithPush] = useState(route.params.openWithPush);
  const hasHandledPush = useRef(false);
  
  console.log('Initial openWithPush from route params:', route.params.openWithPush);
  console.log('Initial localOpenWithPush state:', localOpenWithPush);
  
  
  const {
    idfa,
    oneSignalUserId,
    idfv,
    applsFlyerUID,
    jthrhg,
    isFirstVisit,
    timeStamp,
    naming,
    oneSignalPermissionStatus,
    // sabData,
    // isNonOrganicInstall,
    // openWithPush,
  } = route.params;

  useEffect(() => {
    const initPushState = async () => {
        try {
            const storedPushState = await AsyncStorage.getItem('openedWithPush');
            console.log('Checking push state:', {
                storedPushState,
                routeOpenWithPush: route.params.openWithPush
            });

            if ((storedPushState === 'true' || route.params.openWithPush) && !hasHandledPush.current) {
                console.log('Setting localOpenWithPush to true');
                setLocalOpenWithPush(true);
                hasHandledPush.current = true;
                
                // Clear the push state after handling it
                await AsyncStorage.removeItem('openedWithPush');
            }
        } catch (error) {
            console.error('Error checking push state:', error);
        }
    };

    initPushState();
}, []); // Run only on mount
 

  useEffect(() => {
    const getStoredData = async () => {
      try {
        const sabData = await AsyncStorage.getItem('sabData');
        const isNonOrganicInstall = await AsyncStorage.getItem(
          'isNonOrganicInstall',
        );

        if (sabData) {
          setSabData(sabData);
        }
        setIsNonOrganicInstall(isNonOrganicInstall === 'true');

        // console.log('Retrieved stored data:', {
        //   sabData,
        //   isNonOrganicInstall,
        // });
      } catch (error) {
        console.error('Error retrieving stored data:', error);
      }
    };

    getStoredData();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        // First check if WebView can go back
        if (webViewRef.current && webViewRef.current.canGoBack) {
          console.log(
            'webViewRef.current.canGoBack',
            webViewRef.current.canGoBack,
          );
          webViewRef.current.goBack();
          return true;
        }

        // Then check if we can navigate back
        if (navigation.canGoBack()) {
          console.log('navigation.canGoBack()', navigation.canGoBack());
          navigation.goBack();
          return true;
        }

        // If we can't go back anywhere, minimize the app
        return false;
      },
    );

    return () => backHandler.remove();
  }, [navigation]);

  // const processSabData = useCallback(() => {
  //   if (!sabData) return '';

  //   try {
  //     const sabDataArray = sabData.split('_');
  //     if (!sabDataArray.length) return '';

  //     const sabDataLink = sabDataArray
  //       .map((item, index) => (item ? `subId${index + 1}=${item}` : ''))
  //       // .filter(item => item) // Remove empty strings
  //       .join('&');

  //     console.log('Processed sab data:', sabDataLink);
  //     return sabDataLink;
  //   } catch (error) {
  //     console.error('Error processing sabData:', error);
  //     return '';
  //   }
  // }, [sabData]);

  // WORKING FINE FOR REGULAR WEBVIEW OPEN CASE
  // const doNotRepeatPushOpen=useRef(false);

  useEffect(() => {
    console.log(
      'regular webview open case',
      `${INITIAL_URL}${URL_IDENTIFAIRE}?utretg=webview_open&jthrhg=${timeStamp}`,
    );

    // if(doNotRepeatPushOpen.current){
    //   doNotRepeatPushOpen.current=true
    // }
    fetch(
      `${INITIAL_URL}${URL_IDENTIFAIRE}?utretg=webview_open&jthrhg=${timeStamp}`,
    );
  }, []);

  useEffect(() => {
    if (isFirstVisit && oneSignalPermissionStatus) {
      console.log(
        'Only when user accepts notifications',
        `${INITIAL_URL}${URL_IDENTIFAIRE}?utretg=push_subscribe&jthrhg=${timeStamp}`,
      );
      fetch(
        `${INITIAL_URL}${URL_IDENTIFAIRE}?utretg=push_subscribe&jthrhg=${timeStamp}`,
      );
    }
  }, [isFirstVisit, oneSignalPermissionStatus]);

  // const handleWebViewLoad = useCallback(async () => {
  //   try {
  //     // every time the webview is opened
  //     // console.log('Every time the webview is opened',`${INITIAL_URL}${URL_IDENTIFAIRE}?utretg=webview_open&jthrhg=${timeStamp}`)
  //     // fetch(
  //     //   `${INITIAL_URL}${URL_IDENTIFAIRE}?utretg=webview_open&jthrhg=${timeStamp}`,
  //     // );
  //     if (isFirstVisit && oneSignalPermissionStatus) {
  //       // only when user accepts notifications
  //       console.log('Only when user accepts notifications',`${INITIAL_URL}${URL_IDENTIFAIRE}?utretg=push_subscribe&jthrhg=${timeStamp}`)
  //       fetch(
  //         `${INITIAL_URL}${URL_IDENTIFAIRE}?utretg=push_subscribe&jthrhg=${timeStamp}`,
  //       );
  //     }
  //     //   console.log('WebView open event sent:', response.status);
  //   } catch (error) {
  //     console.error('Error in handleWebViewLoad:', error);
  //   }
  // }, [timeStamp]);

  const constructUrl = useCallback(() => {
    const baseUrl = `${INITIAL_URL}${URL_IDENTIFAIRE}?${URL_IDENTIFAIRE}=1`;
    const params = new URLSearchParams();
    
    // Add tracking parameters
    params.append('idfa', idfa);
    params.append('oneSignalId', oneSignalUserId);
    params.append('idfv', idfv);
    params.append('uid', applsFlyerUID);
    params.append('customerUserId', idfv);
    params.append('jthrhg', jthrhg);

    let finalUrl = `${baseUrl}&${params.toString()}`;

    console.log('constructUrl - localOpenWithPush:', localOpenWithPush);
    console.log('constructUrl - isFirstVisit:', isFirstVisit);

    // First Visit
    if (isFirstVisit) {
      console.log('First app visit - determining URL type');

      // Non-organic install with sabData
      if (isNonOrganicInstall && sabData) {
        // Check if sabData has proper format with underscore
        if (sabData.includes('_')) {
          const sabParams = sabData
            .split('_')
            .map((item, index) => (item ? `subId${index + 1}=${item}` : ''))
            .join('&');
          finalUrl += `&testParam=NON-ORGANIC&${sabParams}`;
        } else {
          // Handle missing splitter case
          console.log('Non-organic install with missing splitter in sabData');
          finalUrl += '&testParam=CONVERT-SUBS-MISSING-SPLITTER';
        }
      }
      // Organic install
      else {
        // Handle organic install
        console.log('Organic install first visit');
        finalUrl += '&testParam=ORGANIC';
      }
    }

    // Subsequent Visits
    else {
      // Add sabData parameters for non-organic subsequent visits
      if (isNonOrganicInstall && sabData && sabData.includes('_')) {
        const sabParams = sabData
          .split('_')
          .map((item, index) => (item ? `subId${index + 1}=${item}` : ''))
          .join('&');
        finalUrl += `&${sabParams}`;
      }
      // Add push parameter only for subsequent visits
      if (localOpenWithPush) {
        console.log('Adding yhugh parameter due to push notification');
        finalUrl += '&yhugh=true';
      } else {
        console.log('Regular link, no subData,no push');
        finalUrl;
      }
    }
    console.log('Final URL:', finalUrl);
    return finalUrl;

    //   if (isNonOrganic && sabData && !sabData.includes('_')) {
    //     console.log('this is non organic install and sabData is missing splitter');
    //     return `${baseUrl}&${params.toString()}&testParam=CONVERT-SUBS-MISSING-SPLITTER`;
    //   } else if (isNonOrganic && sabData && sabData.includes('_')) {
    //     console.log('this is non organic install and sabData is present');
    //     const sabDataParams = extractSabData();
    //     return `${baseUrl}&${params.toString()}&testParam=NON-ORGANIC&${sabDataParams}`;
    //   } else {
    //     console.log('this is organic install and sabData is present');
    //     const sabDataParams = extractSabData();
    //     return `${baseUrl}&${params.toString()}&testParam=ORGANIC&${sabDataParams}`;
    //   }
    // }

    //   Combine everything into final URL
    // const finalUrl = sabDataParams
    //   ? `${baseUrl}&${params.toString()}&${sabDataParams}`
    //   : `${baseUrl}&${params.toString()}`;
    // console.log('finalUrl', finalUrl);
    // return finalUrl;

    // console.log('extractSabData TestScreen-',extractSabData());
    // console.log(`${baseUrl}&${params.toString()}&${extractSabData()}`);
    // console.log('openWithPush',openWithPush);
    // return !isFirstVisit &&  `${baseUrl}&${params.toString()}&${extractSabData()}`+ (openWithPush?'&yhugh=true':'');
  }, [
    idfa,
    oneSignalUserId,
    idfv,
    applsFlyerUID,
    jthrhg,
    isFirstVisit,
    isNonOrganicInstall,
    sabData,
    localOpenWithPush
  ]);

  //   const handleCustomUrl = async request => {
  //     const url = request.url;

  //     // Handle regular web URLs
  //     if (url.startsWith('http://') || url.startsWith('https://')) {
  //         return true; // Let WebView handle these
  //     }

  //     // Handle custom schemes (deep links)
  //     try {
  //         const canOpen = await Linking.canOpenURL(url);
  //         if (canOpen) {
  //             await Linking.openURL(url);
  //         } else {
  //             Alert.alert(
  //                 'App Not Found',
  //                 'The requested app is not installed.',
  //                 [{text: 'OK'}]
  //             );
  //         }
  //         return false; // Prevent WebView from trying to load the URL
  //     } catch (error) {
  //         console.error('Error handling URL:', error);
  //         return false;
  //     }
  // };
  // Wrapper function to handle the async nature of handleCustomUrl
  const onShouldStartLoadWithRequest = event => {
    const {url} = event;
    // console.log('Intercepted URL:', url);

    //   // Handle BMO app (bmoolbb://)
    //   if (url.startsWith('bmoolbb://')) {
    //     console.log('BMO URL detected:', url);
    //     Linking.openURL(url).catch(error => {
    //         console.error('Error opening BMO app:', error);
    //         Alert.alert(
    //             'App Not Found',
    //             'The BMO banking app is not installed.',
    //             [{text: 'OK'}]
    //         );
    //     });
    //     return false;
    // }

    // Handle RBC intent URL
    if (url.startsWith('intent://rbcbanking')) {
      console.log('RBC URL detected:', url);
      // Extract the scheme and package from the intent URL
      const scheme = 'rbcbanking';
      const packageName = 'com.rbc.mobile.android';

      try {
        // Try to open with custom scheme first
        console.log('scheme', `${scheme}://${url.split('?')[1].split('#')[0]}`);
        Linking.openURL(`${scheme}://${url.split('?')[1].split('#')[0]}`).catch(
          () => {
            // If custom scheme fails, try using intent
            Linking.sendIntent('android.intent.action.VIEW', [
              {key: 'package_name', value: packageName},
            ]).catch(error => {
              console.error('Error opening RBC app:', error);
              Alert.alert(
                'App Not Found',
                'The RBC banking app is not installed.',
                [{text: 'OK'}],
              );
            });
          },
        );
      } catch (error) {
        console.error('Error parsing RBC URL:', error);
      }
      return false;
    }

    // Handle banking apps
    if (
      url.startsWith('intent://') ||
      url.startsWith('scotiabank://') ||
      url.startsWith('cibcbanking://') ||
      url.startsWith('intent://rbcbanking') ||
      url.startsWith('bncmobile:/') ||
      url.startsWith('tdct://') ||
      url.startsWith('bmoolbb://') ||
      url.startsWith('bmo://') ||
      url.startsWith('rbc://')
    ) {
      console.log('app url', url);

      Linking.openURL(url).catch(error => {
        Alert.alert(
          'App Not Found',
          'The requested banking app is not installed.',
          [{text: 'OK'}],
        );
      });
      return false;
    }

    // Handle regular web URLs to be opened in the webview ,logic to be added ....
    return true;
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
        AsyncStorage.removeItem('openedWithPush');
        setLocalOpenWithPush(false);
        hasHandledPush.current = false;
    };
}, []);

  return (
    <WebView
      ref={webViewRef}
      //   source={{
      //     uri: `${INITIAL_URL}${URL_IDENTIFAIRE}?${URL_IDENTIFAIRE}=1&idfa=${idfa}&oneSignalId=${oneSignalUserId}&idfv=${idfv}&uid=${applsFlyerUID}&customerUserId=${idfv}&jthrhg=${jthrhg}`,
      //   }}
      source={{uri: constructUrl()}}
      style={{flex: 1}}
      originWhitelist={[
        '*',
        'http://*',
        'https://*',
        'intent://*',
        'tel:*',
        'mailto:*',
        'scotiabank://',
        'bmo://',
        'td://',
        'nbc://',
        'cibc://',
        'bmoolbb://*',
        'scotiabank://',
        'rbcbanking://',
        'tdct://',
        'cibcbanking://',
        'www.cibconline.cibc.com://',
        'secure.scotiabank.com',
        'rbc://*',
      ]}
      onLoadStart={syntheticEvent => {
        // console.log('WebView started loading');
        // handleWebViewLoad();
      }}
      // OR use onLoad if want to wait until the page is fully loaded
      onLoad={() => {
        // console.log('WebView fully loaded');
        // handleWebViewLoad(); // Uncomment if prefer onLoad over onLoadStart
      }}
      onError={syntheticEvent => {
        const {nativeEvent} = syntheticEvent;
        console.warn('WebView error:', nativeEvent);
      }}
      thirdPartyCookiesEnabled={true}
      allowsBackForwardNavigationGestures={true}
      domStorageEnabled={true}
      javaScriptEnabled={true}
      allowsInlineMediaPlayback={true}
      mediaPlaybackRequiresUserAction={false}
      allowFileAccess={true}
      javaScriptCanOpenWindowsAutomatically={true}
      setSupportMultipleWindows={false} // prevent opening external browser
      onMessage={event => {
        console.log('WebView Message:', event.nativeEvent.data);
      }}
      onNavigationStateChange={navState => {
        // Updates webview's canGoBack state
        if (webViewRef.current) {
          webViewRef.current.canGoBack = navState.canGoBack;
        }
      }}
      onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
    />
  );
};

export default TestScreen;
