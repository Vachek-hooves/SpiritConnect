import appsFlyer from 'react-native-appsflyer';

export const handleCustomerUserId = async deviceUniqId => {
  console.log('Setting customer user id', deviceUniqId);
  appsFlyer.setCustomerUserId(
    deviceUniqId,
    res => {
      console.log('AppsFlyer SDK setCustomerUserId:', res);
    },
    error => {
      console.error('AppsFlyer SDK failed to setCustomerUserId:', error);
    },
  );
};
