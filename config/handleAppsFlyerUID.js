import appsFlyer from 'react-native-appsflyer';

export const handleAppsFlyerUID = async () => {
  appsFlyer.getAppsFlyerUID((err, appsFlyerUID) => {
    if (err) {
      console.error(err);
    } else {
      console.log('on getAppsFlyerUID: ', appsFlyerUID);
    }
  });
};
