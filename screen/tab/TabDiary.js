import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React from 'react';
import {usePracticeContext} from '../../store/context';
import LinearGradient from 'react-native-linear-gradient';
import {Image} from 'react-native';

const TabDiary = ({navigation}) => {
  const {moodNotes} = usePracticeContext();
  console.log(moodNotes.mood);

  // Function to format the date to "D Month"
  const formatDate = dateString => {
    const [day, month, year] = dateString.split('.'); // Split the date string
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return `${parseInt(day)} ${monthNames[parseInt(month) - 1]}`; // Format to "D Month"
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mood tracker</Text>
      {moodNotes.length === 0 ? (
        <View style={styles.placeholderContainer}>
          <Image
            source={require('../../assets/images/icons/sadMood.png')}
            style={styles.icon}
          />
          <Text style={styles.message}>
            There aren’t any mood notes yet, please add something
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          {moodNotes.map((note, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardDate}>{formatDate(note.date)}</Text>
              <Text style={styles.cardHeading}>{note.heading}</Text>
              <Text style={styles.cardDescription}>{note.description}</Text>
              <LinearGradient
                colors={['#8B5CF6', '#00FF7F']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={[styles.gradient, {width: `${note.mood * 100}%`}]}
              />
              <View style={styles.moodTextContainer}>
                <Text style={styles.moodText}>Sadness</Text>
                <Text style={styles.moodText}>Happiness</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('StackCreateMood')}>
        <Text style={styles.addButtonText}>Add a mood note</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#100E1B',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  message: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  cardDate: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardHeading: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 5,
  },
  cardDescription: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 10,
  },
  gradient: {
    height: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  moodTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodText: {
    color: '#fff',
    fontSize: 12,
  },
  addButton: {
    backgroundColor: '#00FF7F',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TabDiary;
