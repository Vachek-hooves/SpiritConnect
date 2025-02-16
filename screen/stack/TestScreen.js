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
