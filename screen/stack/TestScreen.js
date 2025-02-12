import { StyleSheet, Text, View } from 'react-native'
import WebView from 'react-native-webview'

const TestScreen = () => {
  return (
    <WebView source={{uri: 'https://www.google.com'}} />
  )
}

export default TestScreen

const styles = StyleSheet.create({})