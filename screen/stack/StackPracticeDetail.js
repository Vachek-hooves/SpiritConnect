import {StyleSheet, Text, View, Image, TouchableOpacity, Vibration} from 'react-native';
import React, {useState, useEffect} from 'react';
import {usePracticeContext} from '../../store/context';

const StackPracticeDetail = ({route, navigation}) => {
  const {practiceType, item} = route.params;
  const {completePractice} = usePracticeContext();
  const [timeLeft, setTimeLeft] = useState(item.duration * 60);
  const [isActive, setIsActive] = useState(false);
  // console.log(practiceType)

  useEffect(() => {
    let timer;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      Vibration.vibrate();
      completePractice(practiceType, item.id);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  const handleStart = () => {
    setIsActive(true);
  };

  const handleFinish = () => {
    setIsActive(false);
    // Handle finishing the practice (e.g., navigate back or show a message)
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{item.name}</Text>

      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} />
      </View>

      <Text style={styles.timer}>
        {`${Math.floor(timeLeft / 60).toString().padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`}
      </Text>

      <Text style={styles.description}>{item.text}</Text>

      {!isActive ? (
        <TouchableOpacity style={styles.startButton} onPress={handleStart}>
          <Text style={styles.startButtonText}>Start</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
          <Text style={styles.finishButtonText}>Finish</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.createButton}>
        <Text style={styles.createButtonText}>Create new practice</Text>
      </TouchableOpacity>
    </View>
  );
};

export default StackPracticeDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#100E1B',
    padding: 20,
    paddingTop: 50,
  },
  backButton: {
    marginVertical: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  imageContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#00FF7F',
    textAlign: 'center',
    marginVertical: 20,
  },
  description: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
    marginBottom: 'auto',
  },
  startButton: {
    backgroundColor: '#00FF7F',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  finishButton: {
    backgroundColor: '#EC4899',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  startButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  createButton: {
    marginTop: 'auto',
    marginVertical:20
  },
  createButtonText: {
    color: '#EC4899',
    fontSize: 16,
    textAlign: 'center',
  },
});
