import ReactNativeIdfaAaid, {
    AdvertisingInfoResponse,
  } from '@sparkfabrik/react-native-idfa-aaid';

export const handleGetAaid = async () => {
    
    // for android 
    try {
        const aaid = await ReactNativeIdfaAaid.getAdvertisingInfo();
   
        // console.log('aaid handleGetAaid', aaid);
        // console.log('status handleGetAaid', status);
        // console.log('aaid handleGetAaid', aaid.id);
        return aaid.id;
    } catch (err) {
        console.log('err', err);
        return null;
    }

    // for ios
    // try {
    //     const aaid = await ReactNativeIdfaAaid.getAdvertisingInfo();
    //     if(aaid.isAdTrackingLimited) {
    //         console.log('aaid handleGetAaid', aaid);
    //         return aaid.id;
    //     } else {
    //         console.log('aaid handleGetAaid', aaid);
    //         return ('00000000-0000-0000-0000-000000000000');
    //     }
    // } catch (err) {
    //     console.log('err', err);
    //     return null;
    // }
}