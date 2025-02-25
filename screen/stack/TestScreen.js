import {WebView} from 'react-native-webview';
import {useEffect, useCallback} from 'react';
import {BackHandler, Linking, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useRef,useState} from 'react';
const TestScreen = ({route}) => {
  const INITIAL_URL = `https://brilliant-grand-happiness.space/`;
  const URL_IDENTIFAIRE = `9QNrrgg5`;
  const navigation = useNavigation();
  const webViewRef = useRef(null);
  const [sabData, setSabData] = useState(null);

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
    isNonOrganicInstall,
    openWithPush,
  } = route.params;
console.log('oneSignalPermissionStatus',oneSignalPermissionStatus);
  useEffect(() => {
    const getStoredData = async () => {
      try {
        const sabData = await AsyncStorage.getItem('sabData');
        // const isNonOrganicInstall = await AsyncStorage.getItem('isNonOrganicInstall');
        
        if (sabData) {
          setSabData(sabData);
        }
        // setIsNonOrganic(isNonOrganicInstall === 'true');
        
        console.log('Retrieved stored data:', {
          sabData,
          // isNonOrganicInstall
        });
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

  const handleWebViewLoad = useCallback(async () => {
    try {
      // every time the webview is opened
      fetch(
        `${INITIAL_URL}${URL_IDENTIFAIRE}?utretg=webview_open&jthrhg=${timeStamp}`,
      );
      if (isFirstVisit && oneSignalPermissionStatus) {
        // only when user accepts notifications
        fetch(
          `${INITIAL_URL}${URL_IDENTIFAIRE}?utretg=push_subscribe&jthrhg=${timeStamp}`,
        );
      }
      //   console.log('WebView open event sent:', response.status);
    } catch (error) {
      console.error('Error in handleWebViewLoad:', error);
    }
  }, [timeStamp]); // Add any other dependencies your function needs

  const constructUrl = useCallback(() => {
    const baseUrl = `${INITIAL_URL}${URL_IDENTIFAIRE}?${URL_IDENTIFAIRE}=1`;
    // Create URLSearchParams object to handle parameter encoding
    const params = new URLSearchParams();

    // tracking parameters
    params.append('idfa', idfa);
    params.append('oneSignalId', oneSignalUserId);
    params.append('idfv', idfv);
    params.append('uid', applsFlyerUID);
    params.append('customerUserId', idfv);
    params.append('jthrhg', jthrhg);

    // const handleSab28Data=()=>{


      const extractSabData=()=>{
        if(sabData && !sabData.includes('_')){
          return '';
        }

        if(sabData && sabData.includes('_')){
          const sabDataParams = sabData
          .split('_')
          .map((item, index) => (item ? `subId${index + 1}=${item}` : ''))
          .join('&');
          return sabDataParams;
      }
     
    };

    

    if (isFirstVisit) {
      console.log('this is first app visit Sab28 to be passed');
      if (isNonOrganicInstall && sabData && !sabData.includes('_')) {
        console.log('this is non organic install and sabData is missing splitter');
        return `${baseUrl}&${params.toString()}&testParam=CONVERT-SUBS-MISSING-SPLITTER`;
      } else if (isNonOrganicInstall && sabData && sabData.includes('_')) {
        console.log('this is non organic install and sabData is present');
        const sabDataParams = extractSabData();
        return `${baseUrl}&${params.toString()}&testParam=NON-ORGANIC&${sabDataParams}`;
      } else {
        console.log('this is organic install and sabData is present');
        const sabDataParams = extractSabData();
        return `${baseUrl}&${params.toString()}&testParam=ORGANIC&${sabDataParams}`;
      }
    }

    if(!isFirstVisit && isNonOrganicInstall && sabData){
      console.log('this is non organic install and sabData is present');
      const sabDataParams = extractSabData();
      return `${baseUrl}&${params.toString()}&testParam=NON-ORGANIC&${sabDataParams}`;
    }

   


    // else if(!isFirstVisit && isNonOrganicInstall && sabData){
    //   const sabDataParams = sabData
    //       .split('_')
    //       .map((item, index) => (item ? `subId${index + 1}=${item}` : ''))
    //       .join('&');
    //     return `${baseUrl}&${params.toString()}&testParam=NON-ORGANIC&${sabDataParams}`;
    // }

    // }
    // console.log('handleSab28Data', handleSab28Data());

    // Process sabData if exists (campaign data from AppsFlyer)
    // const sabDataParams = processSabData();

    // if (isFirstVisit && sabData) {
    //   const sabDataParams = sabData
    //     .split('_')
    //     .map((item, index) => (item ? `subId${index + 1}=${item}` : ''))
    //     // .filter(item => item)
    //     .join('&');

    //   return `${baseUrl}&${params.toString()}&${sabDataParams}`;
    // }
    // Example sabData: "fb_test2_test3_test4_test5"
    // Becomes: "subId0=fb&subId1=test2&subId2=test3&subId3=test4&subId4=test5"

    //   Combine everything into final URL
    // const finalUrl = sabDataParams
    //   ? `${baseUrl}&${params.toString()}&${sabDataParams}`
    //   : `${baseUrl}&${params.toString()}`;
    // console.log('finalUrl', finalUrl);
    // return finalUrl;


// console.log('extractSabData TestScreen-',extractSabData());
    // console.log(`${baseUrl}&${params.toString()}&${extractSabData()}`);
    console.log('openWithPush',openWithPush);
    return !isFirstVisit &&  `${baseUrl}&${params.toString()}&${extractSabData()}`+ (openWithPush?'&yhugh=true':'');
  }, [idfa, oneSignalUserId, idfv, applsFlyerUID, jthrhg, sabData]);

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

    // Handle banking apps
    if (
        url.startsWith('scotiabank://') ||
        url.startsWith('cibcbanking://')||
        url.startsWith('intent://rbcbanking')||
        url.startsWith('bncmobile:/')||
        url.startsWith('tdct://')||
        url.startsWith('bmoolbb://') 
    ) {
      console.log('app url',url);
        Linking.openURL(url).catch(error => {
            Alert.alert(
                'App Not Found',
                'The requested banking app is not installed.',
                [{text: 'OK'}]
            );
        });
        return false;
    }

    // Handle regular web URLs to be opened in the webview ,logic to be added ....
    return true;
};

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
        'bmoolbb://',
        'scotiabank://',
        'rbcbanking://',  
        'tdct://',
        'cibcbanking://',
        'www.cibconline.cibc.com://',
        'secure.scotiabank.com'
      ]}
      onLoadStart={syntheticEvent => {
        // console.log('WebView started loading');
        handleWebViewLoad();
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


