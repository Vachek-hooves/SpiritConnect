import {WebView} from 'react-native-webview';
const idfa = 'd1e5bd8c-a54d-4143-ad5e-7dd21cf238ff'
const TestScreen = ({route}) => {
  const {idfa,oneSignalUserId,idfv,applsFlyerUID,jthrhg} = route.params;
  console.log('idfa',idfa);
  console.log('oneSignalUserId',oneSignalUserId);
  console.log('idfv',idfv);
  console.log('applsFlyerUID',applsFlyerUID);
  console.log('jthrhg',jthrhg);
  const URL=`https://brilliant-grand-happiness.space/`
  const URL_IDENTIFAIRE=`9QNrrgg5`
  return (
    <WebView
      source={{
        uri: `${URL}${URL_IDENTIFAIRE}?${URL_IDENTIFAIRE}=1&idfa=${idfa}&oneSignalId=${oneSignalUserId}&idfv=${idfv}&uid=${applsFlyerUID}&customerUserId=${idfv}&jthrhg=${jthrhg}`,
      }}
      style={{flex: 1}}
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
//     urlParams.append(URL_IDENTIFAIRE, '1');
    
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