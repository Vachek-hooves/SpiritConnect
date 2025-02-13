import ReactNativeIdfaAaid, {
    AdvertisingInfoResponse,
  } from '@sparkfabrik/react-native-idfa-aaid';

export const handleGetAaid = async () => {
    
    // return ReactNativeIdfaAaid.getAdvertisingInfo().then(res => {
    //     console.log('res', res.id);
    //     return res.id;
    // }).catch(err => {
    //     console.log('err', err);
    //     return null;
    // });
    try {
        const aaid = await ReactNativeIdfaAaid.getAdvertisingInfo();
        // console.log('aaid handleGetAaid', aaid.id);
        return aaid.id;
    } catch (err) {
        console.log('err', err);
        return null;
    }
}