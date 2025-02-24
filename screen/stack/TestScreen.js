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

    // Return URL without sabData for subsequent visits
    // return `${baseUrl}&${params.toString()}`;


console.log('extractSabData TestScreen-',extractSabData());
    // console.log(`${baseUrl}&${params.toString()}&${extractSabData()}`);
    return !isFirstVisit &&  `${baseUrl}&${params.toString()}&${extractSabData()}`+ (openWithPush?'&yhugh=true':'');
  }, [idfa, oneSignalUserId, idfv, applsFlyerUID, jthrhg, sabData]);

  const handleCustomUrl = async url => {
    console.log('handleCustomUrl-', url);

    try {
      // Check URL scheme
      if (url.startsWith('mailto:')) {
        await Linking.openURL(url);
        return;
      }

      // Handle different bank apps
      if (url.startsWith('scotiabank:')) {
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
          await Linking.openURL(url);
        } else {
          const browserUrl = `https://www.scotiabank.com/ca/en/personal.html`;
          await Linking.openURL(browserUrl);
          Alert.alert(
            'App Not Found',
            'The Scotiabank app is not installed. Opening website instead.',
            [{text: 'OK'}],
          );
        }
        return;
      }

      if (url.includes('rbcbanking')) {
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
          await Linking.openURL(url);
        } else {
          const browserUrl = `https://www.rbcroyalbank.com/personal.html`;
          await Linking.openURL(browserUrl);
          Alert.alert(
            'App Not Found',
            'The RBC app is not installed. Opening website instead.',
            [{text: 'OK'}],
          );
        }
        return;
      }

      // Handle BMO
      if (url.includes('bmoolbb:')) {
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
          await Linking.openURL(url);
        } else {
          const browserUrl = 'https://www.bmo.com/en-ca/main/personal/';
          await Linking.openURL(browserUrl);
          Alert.alert(
            'App Not Found',
            'The BMO app is not installed. Opening website instead.',
            [{text: 'OK'}],
          );
        }
        return;
      }

      // Handle TD
      if (url.includes('tdct')) {
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
          await Linking.openURL(url);
        } else {
          const browserUrl = 'https://www.td.com/ca/en/personal-banking';
          await Linking.openURL(browserUrl);
          Alert.alert(
            'App Not Found',
            'The TD app is not installed. Opening website instead.',
            [{text: 'OK'}],
          );
        }
        return;
      }

      // Handle NBC
      if (url.startsWith('nbc:') || url.includes('nbc')) {
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
          await Linking.openURL(url);
        } else {
          const browserUrl = 'https://www.nbc.ca/';
          await Linking.openURL(browserUrl);
          Alert.alert(
            'App Not Found',
            'The NBC app is not installed. Opening website instead.',
            [{text: 'OK'}],
          );
        }
        return;
      }

      // Handle CIBC
      if (url.startsWith('cibc:') || url.includes('cibc')) {
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
          await Linking.openURL(url);
        } else {
          const browserUrl = 'https://www.cibc.com/en/personal-banking.html';
          await Linking.openURL(browserUrl);
          Alert.alert(
            'App Not Found',
            'The CIBC app is not installed. Opening website instead.',
            [{text: 'OK'}],
          );
        }
        return;
      }

      // Handle other custom schemes
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        console.warn('Cannot open URL:', url);
        Alert.alert(
          'App Not Found',
          'The requested app is not installed. Opening website instead.',
          [{text: 'OK'}],
        );
      }
    } catch (error) {
      console.error('Error handling URL:', error);
      Alert.alert('Error', 'Unable to open the link. Please try again.', [
        {text: 'OK'},
      ]);
    }
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
        // Update webview's canGoBack state
        if (webViewRef.current) {
          // console.log('navState.canGoBack', navState.canGoBack);
          // console.log(
          //   'webViewRef.current.canGoBack',
          //   webViewRef.current.canGoBack,
          // );
          webViewRef.current.canGoBack = navState.canGoBack;
        }
        // console.log('Navigation State:', {
        //   // url: navState.url,
        //   title: navState.title,
        //   loading: navState.loading,
        //   canGoBack: navState.canGoBack,
        //   canGoForward: navState.canGoForward
        // });
      }}
      onShouldStartLoadWithRequest={request => {
        // console.log('Request:', {
        //   request,
        //   url: request.url,
        //   method: request.method,
        //   headers: request.headers,
        //   mainDocumentURL: request.mainDocumentURL
        // });
        // Check if the URL is a custom scheme
        // console.log('request URL to open', request);
        if (
          !request.url.startsWith('http') &&
          !request.url.startsWith('https')
        ) {
          console.log('request', request);
          // console.log('Open this URL:', request.url);
          handleCustomUrl(request.url);
          return false;
        }
        return true;

        // if (request.url) {
        //   handleCustomUrl(request.url);
        // }
      }}
    />
  );
};

export default TestScreen;

//  Check params before launch
// const TestScreen = ({route}) => {
//     // Destructure with default values to prevent undefined
//     const {
//       idfa = '',
//       oneSignalUserId = '',
//       idfv = '',
//       applsFlyerUID = '',
//       jthrhg = ''
//     } = route.params || {};

//     // Create URL params only with existing values
//     const urlParams = new URLSearchParams();
//     urlParams.append(URL_IDENTIFIER, '1');

//     if (idfa) urlParams.append('idfa', idfa);
//     if (oneSignalUserId) urlParams.append('oneSignalId', oneSignalUserId);
//     if (idfv) {
//       urlParams.append('idfv', idfv);
//       urlParams.append('customerUserId', idfv);
//     }
//     if (applsFlyerUID) urlParams.append('uid', applsFlyerUID);
//     if (jthrhg) urlParams.append('jthrhg', jthrhg);

//     const finalUrl = `${URL}${URL_IDENTIFAIRE}?${urlParams.toString()}`;

//     console.log('Final URL:', finalUrl);

//     return (
//       <WebView
//         source={{
//           uri: finalUrl,
//         }}
//         style={{flex: 1}}
//       />
//     );
//   };
