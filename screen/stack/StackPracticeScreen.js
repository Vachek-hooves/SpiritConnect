import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const StackPracticeScreen = ({route}) => {
  const {practiceType, practices, title} = route.params;
  console.log(practiceType, practices, title);
  return (
    <View>
      <Text>StackPracticeScreen</Text>
    </View>
  )
}

export default StackPracticeScreen

const styles = StyleSheet.create({})