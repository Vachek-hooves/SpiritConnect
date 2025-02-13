import appsFlyer from 'react-native-appsflyer';


const option = {
    devKey: 'ZP6F7NaeyNmgAdC29AdB4T',
    appId: 'com.spiritconnect',
    onInstallConversionDataListener: true,
    onDeepLinkListener: true,
    manualStart: true,
  };

console.log('option', option);

export const handleInitSdk = async () => {
    appsFlyer.initSdk(
        option,
        res => {
          console.log('AppsFlyer SDK integration:', res);
        },
        error => {
          console.error('AppsFlyer SDK failed to start:', error);
        },
      );
      appsFlyer.startSdk();
}