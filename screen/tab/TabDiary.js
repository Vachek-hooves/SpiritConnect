import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';

const TabDiary = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mood tracker</Text>
      <View style={styles.iconContainer}>
        {/* You can replace this with an actual icon or image */}
        <Image
          source={require('../../assets/images/icons/sadMood.png')}
          style={styles.icon}
        />
        {/* <Text style={styles.icon}>😞</Text> */}
      </View>
      <Text style={styles.message}>
        There aren’t any mood notes yet, please add something
      </Text>
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Add a mood note</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TabDiary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#100E1B',
    // justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    marginTop: '15%',
  },
  iconContainer: {
    marginBottom: 20,
    marginTop: '25%',
  },
  icon: {
    // fontSize: 50, // Adjust size as needed
    // color: '#8B5CF6', // Example color
    width: 160,
    height: 170,
  },
  message: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 20,
    fontFamily: 'bold',
    marginHorizontal: 50,
  },
  addButton: {
    backgroundColor: '#00FF7F',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '90%',
    marginTop: '60%',
  },
  addButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
