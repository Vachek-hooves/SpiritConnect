import React from 'react';
import {View, Text} from 'react-native';
import {WebView} from 'react-native-webview';

const TestScreen = ({route}) => {
  const {initialUrl, urlIdentifier, idfa, oneSignalId, appsFlyerId, timeStamp, deviceUniqId, customerUserId} = route.params || {};

  // Validate all required parameters
  React.useEffect(() => {
    if (!initialUrl || !urlIdentifier || !idfa || !oneSignalId || !appsFlyerId || !timeStamp || !deviceUniqId || !customerUserId) {
      console.error('Missing required parameters:', {
        initialUrl: !!initialUrl,
        urlIdentifier: !!urlIdentifier,
        idfa: !!idfa,
        oneSignalId: !!oneSignalId,
        appsFlyerId: !!appsFlyerId,
        timeStamp: !!timeStamp,
        deviceUniqId: !!deviceUniqId,
        customerUserId: !!customerUserId,
      });
    }
  }, [initialUrl, urlIdentifier, idfa, oneSignalId, appsFlyerId, timeStamp, deviceUniqId, customerUserId]);

  // If any required parameter is missing, show error state
//   if (!initialUrl || !urlIdentifier || !idfa || !oneSignalId || !appsFlyerId || !timeStamp || !deviceUniqId || !customerUserId) {
//     return (
//       <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//         <Text>Error: Missing required parameters</Text>
//         <Text>initialUrl: {initialUrl}</Text>
//         <Text>urlIdentifier: {urlIdentifier}</Text>
//         <Text>idfa: {idfa}</Text>
//         <Text>oneSignalId: {oneSignalId}</Text>
//         <Text>appsFlyerId: {appsFlyerId}</Text>
//         <Text>timeStamp: {timeStamp}</Text>
//         <Text>deviceUniqId: {deviceUniqId}</Text>
//         <Text>customerUserId: {customerUserId}</Text>
//       </View>
//     );
//   }

  return (
    <WebView
      source={{
        uri: `https://brilliant-grand-happiness.space/9QNrrgg5?9QNrrgg5=1&idfa=${idfa}&oneSignalId=${oneSignalId}&uid=${appsFlyerId}&jthrhg=${timeStamp}&customerUserId=${customerUserId}&idfv=${deviceUniqId}`,
      }}
      style={{flex: 1}}
    />
  );
};

export default TestScreen;
