import {StyleSheet, Text, View, Animated} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
const todayDate = new Date();
const hardCodeDate = new Date('2025-02-18T10:00:00');

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const loadingProgress = useRef(new Animated.Value(0)).current;
  const [percentage, setPercentage] = useState(0);
  const [route, setRoute] = useState(false);


  // const INITIAL_URL = `https://brilliant-grand-happiness.space/`;
  // const URL_IDENTIFAIRE = `9QNrrgg5`;
  // const idfa = 'd1e5bd8c-a54d-4143-ad5e-7dd21cf238ff'
  // useEffect(() => {
  //   const checkUrl = `${INITIAL_URL}${URL_IDENTIFAIRE}`;
  //   //console.log(checkUrl);

  //   const targetData = new Date('2025-01-14T10:00:00'); //дата з якої поч працювати webView
  //   const currentData = new Date(); //текущая дата

  //   if (!route) {
  //     if (currentData <= targetData) {
  //       setRoute(false);
  //     } else {
  //       fetch(checkUrl)
  //         .then(r => {
  //           if (r.status === 200) {
  //             console.log('status по клоаке==>', r.status);

  //             navigation.navigate('TestScreen');
  //             // setRoute(true);
  //           } else {
  //             console.log(r.status);
  //             navigation.replace('TabMenu');
  //             // setRoute(false);
  //           }
  //         })
  //         .catch(e => {
  //           console.log('errar', e);
  //           // setRoute(false);
  //         });
  //     }
  //   }
  // }, []);

  useEffect(() => {

    // Add listener to update percentage display
    loadingProgress.addListener(({value}) => {
      setPercentage(Math.floor(value));
    });

    Animated.timing(loadingProgress, {
      toValue: 100,
      duration: 3000,
      useNativeDriver: false,
    }).start(() => {
      if (todayDate <= hardCodeDate) {
        navigation.replace('TabMenu');
      } else {
        navigation.replace('TestScreen');
      }
    });

    // Cleanup listener
    return () => {
      loadingProgress.removeAllListeners();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spirit Connect</Text>

      {/* Progress Bar Container */}
      <View style={styles.progressBar}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.progressFill,
            {
              transform: [
                {
                  scaleX: loadingProgress.interpolate({
                    inputRange: [0, 100],
                    outputRange: [0, 1],
                  }),
                },
              ],
            },
          ]}>
          <LinearGradient
            colors={['#FD365C', '#D504DB']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>

      <Text style={styles.percentageText}>{percentage}%</Text>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    color: 'white',
    marginBottom: 50,
    fontWeight: 'bold',
  },
  progressBar: {
    width: '70%',
    height: 22,
    backgroundColor: '#333',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressFill: {
    transform: [{translateX: 0}],
    transformOrigin: 'left',
  },
  percentageText: {
    color: 'white',
    fontSize: 22,
    marginTop: 10,
  },
});
