import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import NoItems from '../../components/ui/NoItems';

const TabPractices = () => {
  return (
    <View style={styles.container}>
      <NoItems />
    </View>
  );
};

export default TabPractices;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#100E1B',
    padding: 10,
    paddingTop: 100,
  },
});
