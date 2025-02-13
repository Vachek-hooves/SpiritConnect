import {WebView} from 'react-native-webview';
const idfa = 'd1e5bd8c-a54d-4143-ad5e-7dd21cf238ff'
const TestScreen = () => {
  return (
    <WebView
      source={{
        uri: `https://brilliant-grand-happiness.space/9QNrrgg5?9QNrrgg5=1&idfa=${idfa}`,
      }}
      style={{flex: 1}}
    />
  );
};

export default TestScreen;
