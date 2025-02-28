import {WebView} from 'react-native-webview';
import {useEffect, useCallback, useRef, useState} from 'react';
import {BackHandler, Linking, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TestScreen = ({route}) => {
  const INITIAL_URL = `https://brilliant-grand-happiness.space/`;
  const URL_IDENTIFAIRE = `9QNrrgg5`;
  const navigation = useNavigation();
  const webViewRef = useRef(null);
  const [sabData, setSabData] = useState(null);
  const [isNonOrganicInstall, setIsNonOrganicInstall] = useState(false);
  // const [localOpenWithPush, setLocalOpenWithPush] = useState(
  //   route.params.openWithPush,
  // );
  const hasHandledPush = useRef(false);
  const [isUrlReady, setIsUrlReady] = useState(false);
  const [localOpenWithPush, setLocalOpenWithPush] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState('about:blank'); // Initial blank page
  const isFirstLoad = useRef(true);

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
    openWithPush,
  } = route.params;
  // console.log(
  //   'oneSignalPermissionStatus TestScreen',
  //   oneSignalPermissionStatus,
  // );

  useEffect(() => {
    const getStoredData = async () => {
      console.log('getStoredData started');
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
      console.log('getStoredData finished');
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
      if (isNonOrganicInstall && sabData) {
        if (sabData.includes('_')) {
          const sabParams = sabData
            .split('_')
            .map((item, index) => (item ? `subId${index + 1}=${item}` : ''))
            .join('&');
          finalUrl += `&testParam=NON-ORGANIC&${sabParams}`;
        } else if (!sabData.includes('_')) {
          console.log('Non-organic install with missing splitter in sabData');
          finalUrl += '&testParam=CONVERT-SUBS-MISSING-SPLITTER';
          Alert.alert(
            `&testParam=CONVERT-SUBS-MISSING-SPLITTER`,
            '-sabData-',
            String(sabData),
          );
        }
      } else {
        console.log('Organic install first visit');
        finalUrl += '&testParam=ORGANIC';
      }
    } else {
      if (isNonOrganicInstall && sabData && sabData.includes('_')) {
        const sabParams = sabData
          .split('_')
          .map((item, index) => (item ? `subId${index + 1}=${item}` : ''))
          .join('&');
        finalUrl += `&${sabParams}`;
      }
      if (localOpenWithPush) {
        console.log('Adding yhugh parameter due to push notification');
        finalUrl += '&yhugh=true';
        // Alert.alert('app open with push',String( localOpenWithPush));
      } else {
        console.log('Regular link, no subData,no push');
      }
    }
    console.log('Final URL:', finalUrl);
    return finalUrl;
  }, [
    idfa,
    oneSignalUserId,
    idfv,
    applsFlyerUID,
    jthrhg,
    isFirstVisit,
    isNonOrganicInstall,
    sabData,
    localOpenWithPush,
  ]);

  // Initialize push state
  useEffect(() => {
    const initPushState = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const storedPushState = await AsyncStorage.getItem('openedWithPush');
        console.log('Initial push state check:', {
          storedPushState,
          routeOpenWithPush: route.params.openWithPush
        });
        
        const shouldEnablePush = storedPushState === 'true' || route.params.openWithPush;
        if (shouldEnablePush) {
          console.log('Setting localOpenWithPush to true');
          setLocalOpenWithPush(true);
        }
        setIsUrlReady(true);
      } catch (error) {
        console.error('Error checking push state:', error);
        setIsUrlReady(true);
      }
    };

    initPushState();
  }, [route.params.openWithPush]);

  const handleLoadStart = useCallback(() => {
    if (isFirstLoad.current && isUrlReady) {
      console.log('Generating URL in onLoadStart');
      const generatedUrl = constructUrl();
      setWebViewUrl(generatedUrl);
      isFirstLoad.current = false;

      // Clean up push state after URL is generated
      if (localOpenWithPush) {
        setTimeout(() => {
          console.log('Clearing push state');
          setLocalOpenWithPush(false);
          AsyncStorage.removeItem('openedWithPush');
        }, 1000);
      }
    }
  }, [isUrlReady, constructUrl, localOpenWithPush]);

  const renderContent = () => {
    if (!isUrlReady) {
      return null;
    }

    // Wrapper function to handle the async nature of handleCustomUrl
    const onShouldStartLoadWithRequest = event => {
      console.log('onShouldStartLoadWithRequest started');
      const {url} = event;
      // console.log('Intercepted URL:', url);
      // Handle RBC intent URL
      if (url.startsWith('intent://rbcbanking')) {
        console.log('RBC URL detected:', url);
        // Extract the scheme and package from the intent URL
        const scheme = 'rbcbanking';
        const packageName = 'com.rbc.mobile.android';

        try {
          // Try to open with custom scheme first
          console.log(
            'scheme',
            `${scheme}://${url.split('?')[1].split('#')[0]}`,
          );
          Linking.openURL(
            `${scheme}://${url.split('?')[1].split('#')[0]}`,
          ).catch(() => {
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
          });
        } catch (error) {
          console.error('Error parsing RBC URL:', error);
        }
        return false;
      }

      // Handle banking apps
      if (
        url.startsWith('mailto:') ||
        url.startsWith('intent://') ||
        url.startsWith('scotiabank://') ||
        url.startsWith('cibcbanking://') ||
        url.startsWith('intent://rbcbanking') ||
        url.startsWith('bncmobile:/') ||
        url.startsWith('tdct://') ||
        url.startsWith('bmoolbb://') ||
        url.startsWith('bmo://') ||
        url.startsWith('rbc://') ||
        url.startsWith('https://m.facebook.com/') ||
        url.startsWith('https://www.facebook.com/') ||
        url.startsWith('https://www.instagram.com/') ||
        url.startsWith('https://twitter.com/') ||
        url.startsWith('https://www.whatsapp.com/') ||
        url.startsWith('fb://') ||
        url.startsWith('googlepay://')
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
      console.log('onShouldStartLoadWithRequest finished');
      // Handle regular web URLs to be opened in the webview ,logic to be added ....
      return true;
    };

    return (
      <WebView
        ref={webViewRef}
        source={{uri: webViewUrl}}
        onLoadStart={handleLoadStart}
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

  return renderContent();
};

export default TestScreen;
