import {WebView} from 'react-native-webview';
import {useEffect,useCallback} from 'react';
const idfa = 'd1e5bd8c-a54d-4143-ad5e-7dd21cf238ff'
const TestScreen = ({route}) => {
  const {idfa,oneSignalUserId,idfv,applsFlyerUID,jthrhg,isFirstVisit,timeStamp,naming,oneSignalPermissionStatus,sabData} = route.params;

//   console.log('idfa',idfa);
//   console.log('oneSignalUserId',oneSignalUserId);
//   console.log('idfv',idfv);
//   console.log('applsFlyerUID',applsFlyerUID);
//   console.log('jthrhg',jthrhg);
//   console.log('isFirstVisit TestScreen',isFirstVisit);
//   console.log('timeStamp TestScreen',timeStamp);
//   console.log('naming TestScreen',naming);
//   console.log('oneSignalPermissionStatus TestScreen',oneSignalPermissionStatus);
  console.log('sabData TestScreen',sabData);
  const INITIAL_URL=`https://brilliant-grand-happiness.space/`
  const URL_IDENTIFAIRE=`9QNrrgg5`

  const processSabData = useCallback(() => {
    if (!sabData) return '';
    
    try {
      const sabDataArray = sabData.split('_');
      if (!sabDataArray.length) return '';
      
      const sabDataLink = sabDataArray
        .map((item, index) => item ? `subId${index}=${item}` : '')
        .filter(item => item) // Remove empty strings
        .join('&');
      
      console.log('Processed sab data:', sabDataLink);
      return sabDataLink;
    } catch (error) {
      console.error('Error processing sabData:', error);
      return '';
    }
  }, [sabData]);

  const handleWebViewLoad = useCallback(async () => {
    try {
      // Your function logic here
       fetch(`${INITIAL_URL}${URL_IDENTIFAIRE}?utretg=webview_open&jthrhg=${timeStamp}`);
    //   console.log('WebView open event sent:', response.status);
    } catch (error) {
      console.error('Error in handleWebViewLoad:', error);
    }
  }, [timeStamp]); // Add any other dependencies your function needs

  const constructUrl=useCallback(()=>{
    const baseUrl = `${INITIAL_URL}${URL_IDENTIFAIRE}?${URL_IDENTIFAIRE}=1`;
    const params = new URLSearchParams();


     // Add main parameters
     params.append('idfa', idfa);
     params.append('oneSignalId', oneSignalUserId);
     params.append('idfv', idfv);
     params.append('uid', applsFlyerUID);
     params.append('customerUserId', idfv);
     params.append('jthrhg', jthrhg);


    const sabDataParams=processSabData()
    const finalUrl = sabDataParams 
      ? `${baseUrl}&${params.toString()}&${sabDataParams}`
      : `${baseUrl}&${params.toString()}`;
      console.log('finalUrl',finalUrl)
return finalUrl
  },[idfa, oneSignalUserId, idfv, applsFlyerUID, jthrhg, sabData])

  return (
    <WebView
    //   source={{
    //     uri: `${INITIAL_URL}${URL_IDENTIFAIRE}?${URL_IDENTIFAIRE}=1&idfa=${idfa}&oneSignalId=${oneSignalUserId}&idfv=${idfv}&uid=${applsFlyerUID}&customerUserId=${idfv}&jthrhg=${jthrhg}`,
    //   }}
      source={{uri:constructUrl()}}
      style={{flex: 1}}
      onLoadStart={(syntheticEvent) => {
        console.log('WebView started loading');
        handleWebViewLoad();
      }}
      // OR use onLoad if you want to wait until the page is fully loaded
      onLoad={() => {
        console.log('WebView fully loaded');
        // handleWebViewLoad(); // Uncomment if you prefer onLoad over onLoadStart
      }}
      onError={(syntheticEvent) => {
        const {nativeEvent} = syntheticEvent;
        console.warn('WebView error:', nativeEvent);
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