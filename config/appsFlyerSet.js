// import appsFlyer from 'react-native-appsflyer';

// const options = {
//     devKey: 'ZP6F7NaeyNmgAdC29AdB4T',
//     appId: 'com.spiritconnect',
//     onInstallConversionDataListener: true,
//     onDeepLinkListener: true,
//     isDebug: true, // Set to false in production
// };

// export const initAppsFlyerSdk = () => {
//     return new Promise((resolve, reject) => {
//         try {
//             appsFlyer.initSdk(
//                 options,
//                 (result) => {
//                     console.log('AppsFlyer initialized successfully:', result);
//                     resolve(true);
//                 },
//                 (error) => {
//                     console.error('AppsFlyer initialization failed:', error);
//                     reject(error);
//                 }
//             );
//         } catch (error) {
//             console.error('Error in AppsFlyer initialization:', error);
//             reject(error);
//         }
//     });
// };

// // Helper functions for common AppsFlyer operations
// export const logEvent = async (eventName, eventValues) => {
//     try {
//         await appsFlyer.logEvent(eventName, eventValues);
//         console.log('Event logged successfully:', eventName);
//         return true;
//     } catch (error) {
//         console.error('Error logging event:', error);
//         return false;
//     }
// };

// export const setCustomerUserId = async (userId) => {
//     try {
//         await appsFlyer.setCustomerUserId(userId);
//         console.log('Customer user ID set:', userId);
//         return true;
//     } catch (error) {
//         console.error('Error setting customer user ID:', error);
//         return false;
//     }
// };

// // Get AppsFlyer SDK instance
// export const getAppsFlyerInstance = () => appsFlyer;