import appsFlyer from 'react-native-appsflyer';

export const setupConversionListener = async () => {
  console.log('Setting up conversion listener');
  console.log('AppsFlyer instance:', appsFlyer);

  return new Promise(resolve => {
    const onInstallConversionDataCanceller = appsFlyer.onInstallConversionData(
      res => {
        console.log(
          'Attempting to process conversion data, callback is called',
        );
        console.log('Raw conversion data:', res); // Shows all data from AppsFlyer

        try {
          // Add more granular logging
          console.log('Is first launch check:', res.data.is_first_launch);
          // Checks if this is the first time the app is launched
          if (JSON.parse(res.data.is_first_launch) === true) {
            console.log('This is first launch, checking status');
            // Non-organic: User installed the app through a marketing campaign
            if (res.data.af_status === 'Non-organic') {
              var media_source = res.data.media_source; // Where the install came from (Facebook, Google Ads, etc.)
              var campaign = res.data.campaign; // Which specific campaign drove the install
              console.log(
                'This is first launch and a Non-Organic install. Media source: ' +
                  media_source +
                  ' Campaign: ' +
                  campaign,
              );
              // Organic: User installed the app naturally (from App Store/Play Store)
            } else if (res.data.af_status === 'Organic') {
              console.log('This is first launch and a Organic Install');
            }
          } else {
            console.log('This is not first launch');
          }
        } catch (error) {
          console.error('Error processing conversion data:', error);
        }
      },
    );

    console.log('Function completed');
    resolve(onInstallConversionDataCanceller);
  });

  //   const onInstallConversionDataCanceller = appsFlyer.onInstallConversionData(
  //     res => {
  //       console.log(
  //         'Attempting to process conversion data,is callback is called',
  //       );
  //       console.log('Raw conversion data:', res); // Shows all data from AppsFlyer

  //       try {
  //          // Add more granular logging
  //          console.log('Is first launch check:', res.data.is_first_launch);
  //         // Checks if this is the first time the app is launched
  //         if (JSON.parse(res.data.is_first_launch) === true) {
  //             console.log('This is first launch, checking status');
  //           // Non-organic: User installed the app through a marketing campaign
  //           if (res.data.af_status === 'Non-organic') {
  //             var media_source = res.data.media_source; // Where the install came from (Facebook, Google Ads, etc.)
  //             var campaign = res.data.campaign; // Which specific campaign drove the install
  //             console.log(
  //               'This is first launch and a Non-Organic install. Media source: ' +
  //                 media_source +
  //                 ' Campaign: ' +
  //                 campaign,
  //             );
  //             // Organic: User installed the app naturally (from App Store/Play Store)
  //           } else if (res.data.af_status === 'Organic') {
  //             console.log('This is first launch and a Organic Install');
  //           }
  //         } else {
  //           console.log('This is not first launch');
  //         }
  //       } catch (error) {
  //         console.error('Error processing conversion data:', error);
  //       }
  //     },
  //   );
  //   console.log('Function completed');

  //   return onInstallConversionDataCanceller; // Function to remove the listener when needed
};
