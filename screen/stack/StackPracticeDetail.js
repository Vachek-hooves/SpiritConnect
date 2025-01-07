import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {usePracticeContext} from '../../store/context';

const StackPracticeDetail = ({route, navigation}) => {
  const {practiceType, item} = route.params;

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

      <Text style={styles.description}>{item.text}</Text>

      <TouchableOpacity style={styles.startButton}>
        <Text style={styles.startButtonText}>Start</Text>
      </TouchableOpacity>

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
    height: 260,
    resizeMode: 'cover',
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
  startButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  createButton: {
    marginTop: 'auto',
  },
  createButtonText: {
    color: '#EC4899',
    fontSize: 16,
    textAlign: 'center',
  },
});
