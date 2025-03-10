import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Vibration,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {usePracticeContext} from '../../store/context';

const PracticeDetail = ({route, navigation}) => {
  const {practiceType, item} = route.params;
  const {completePractice} = usePracticeContext();
  const [timeLeft, setTimeLeft] = useState(item.duration * 60);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const timerRef = useRef(null);
  // console.log(practiceType)

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isCompleted) {
      // Only complete and update states if not already completed
      clearInterval(timerRef.current);
      setIsActive(false);
      setIsCompleted(true);
      completePractice(practiceType, item.id);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, timeLeft, isCompleted, practiceType, item.id, completePractice]);

  const handleStart = () => {
    if (isCompleted) {
      // Reset timer when starting again after completion
      setTimeLeft(item.duration * 60);
      setIsCompleted(false);
    }
    setIsActive(true);
  };

  const handleFinish = () => {
    setIsActive(false);
    setTimeLeft(item.duration * 60);
    setIsCompleted(false);
  };
  const renderImage = (imageSource) => {
    if (typeof imageSource === 'number') {
      // Handle static images (from require)
      return imageSource;
    } else if (typeof imageSource === 'string' && imageSource.startsWith('file://')) {
      // Handle local file URLs
      return { uri: imageSource };
    }
    return null; // Return null or a default image source
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      <ScrollView>
        <Text style={styles.title}>{item.name}</Text>

        <View style={styles.imageContainer}>
          <Image source={renderImage(item.image)} style={styles.image} />
        </View>

        <Text style={styles.timer}>
          {`${Math.floor(timeLeft / 60)
            .toString()
            .padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`}
        </Text>

        <Text style={styles.description}>{item.text}</Text>
      </ScrollView>
      {!isActive ? (
        <TouchableOpacity 
          style={styles.startButton} 
          onPress={handleStart}
        >
          <Text style={styles.startButtonText}>
            {isCompleted ? 'Start Practice Again' : 'Start'}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
          <Text style={styles.finishButtonText}>Finish</Text>
        </TouchableOpacity>
      )}

      {/* <TouchableOpacity style={styles.createButton}>
        <Text style={styles.createButtonText}>Create new practice</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default PracticeDetail;

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
    marginBottom: 50,
  },
  finishButton: {
    backgroundColor: '#EC4899',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 50,
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
    marginVertical: 20,
  },
  createButtonText: {
    color: '#EC4899',
    fontSize: 16,
    textAlign: 'center',
  },
});
