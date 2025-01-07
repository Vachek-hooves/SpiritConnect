import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {usePracticeContext} from '../../store/context';
import Slider from '@react-native-community/slider';

const StackCreateMood = ({navigation}) => {
  const {addMoodNote} = usePracticeContext(); // Get the function to add mood notes
  const [heading, setHeading] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [mood, setMood] = useState(0); // Mood slider value
  console.log(mood)

  const handleSave = () => {
    const moodText = getMoodText(mood); // Get mood text based on slider value
    const newMoodNote = {
      id: Date.now(),
      heading,
      description,
      date,
      mood: moodText,
    };
    console.log(newMoodNote)
    addMoodNote(newMoodNote);
    navigation.goBack();
  };

  const getMoodText = (value) => {
    if (value <= 0.2) return 'Very Sad';
    if (value <= 0.4) return 'Sad';
    if (value <= 0.6) return 'Neutral';
    if (value <= 0.8) return 'Happy';
    return 'Very Happy';
  };

  return (
    <ScrollView  style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>{'<'} Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Mood of the day</Text>

      <Text style={styles.moodLabel}>Heading</Text>
      <TextInput
        style={styles.input}
        placeholder="Task name"
        value={heading}
        onChangeText={setHeading}
        placeholderTextColor={'#FFFFFF' + 90}
      />

      <Text style={styles.moodLabel}>Description</Text>
      <TextInput
        style={styles.input}
        placeholder="Task name"
        value={description}
        onChangeText={setDescription}
        placeholderTextColor={'#FFFFFF' + 90}
      />

      <Text style={styles.dateLabel}>Date</Text>
      <TextInput
        style={styles.input}
        placeholder="DD.MM.YYYY"
        value={date}
        onChangeText={setDate}
        placeholderTextColor={'#FFFFFF' + 90}
      />

      <Text style={styles.moodLabel}>Mood</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        minimumTrackTintColor="#8B5CF6"
        maximumTrackTintColor="#393158"
        value={mood}
        onValueChange={setMood}
        thumbTintColor="#4D81F9"
        // trackThickness={5}
        // thumbSize={52}
      />
      
      <Text style={styles.moodText}>{getMoodText(mood)}</Text>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default StackCreateMood;

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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#231D37',
    color: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  dateLabel: {
    color: '#fff',
    marginBottom: 5,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  moodLabel: {
    color: '#fff',
    marginTop: 20,
    marginBottom: 5,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  slider: {
    width: '100%',
    height: 60,
    marginTop: 20,
    marginBottom: 20,
  },
  moodText: {
    color: '#fff',
    textAlign: 'center',
    marginVertical: 10,
  },
  saveButton: {
    backgroundColor: '#00FF7F',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: '10%',
  },
  saveButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
