import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Switch,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import {launchImageLibrary} from 'react-native-image-picker';

const TabProfile = () => {
  const [userData, setUserData] = useState({
    name: '',
    about: '',
    notifications: false,
    profileImage: null,
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('userData');
      if (savedData) {
        setUserData(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const saveUserData = async () => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const clearInput = field => {
    setUserData(prev => ({...prev, [field]: ''}));
  };

  const isSaveEnabled = userData.name.length > 2;

  const handleImagePick = async () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
      includeBase64: false,
    };

    try {
      const result = await launchImageLibrary(options);

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        console.error('ImagePicker Error: ', result.errorMessage);
        return;
      }

      if (result.assets && result.assets[0]) {
        setUserData(prev => ({
          ...prev,
          profileImage: result.assets[0].uri,
        }));
        // Save to AsyncStorage immediately when image is picked
        await AsyncStorage.setItem(
          'userData',
          JSON.stringify({
            ...userData,
            profileImage: result.assets[0].uri,
          }),
        );
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleRemoveImage = async () => {
    try {
      setUserData(prev => ({
        ...prev,
        profileImage: null,
      }));
      // Save to AsyncStorage immediately when image is removed
      await AsyncStorage.setItem(
        'userData',
        JSON.stringify({
          ...userData,
          profileImage: null,
        }),
      );
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.container}>
      {/* Profile Image Section */}
      <View style={styles.imageContainer}>
        <TouchableOpacity style={styles.profileImage} onPress={handleImagePick}>
          {userData.profileImage ? (
            <Image
              source={{uri: userData.profileImage}}
              style={styles.profileImageContent}
            />
          ) : (
            <Text style={styles.profileIcon}>👤</Text>
          )}
          {userData.profileImage && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleRemoveImage}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </View>

      {/* Form Section */}
      <View style={styles.formContainer}>
        <Text style={styles.label}>Your name</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={userData.name}
            onChangeText={text => setUserData(prev => ({...prev, name: text}))}
            placeholder="Task name"
            placeholderTextColor="#666"
          />
          {userData.name.length > 0 && (
            <TouchableOpacity
              onPress={() => clearInput('name')}
              style={styles.clearButton}>
              <Text style={styles.clearButtonText}>×</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.label}>About you</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={userData.about}
            onChangeText={text => setUserData(prev => ({...prev, about: text}))}
            placeholder="What you feel"
            placeholderTextColor="#666"
          />
          {userData.about.length > 0 && (
            <TouchableOpacity
              onPress={() => clearInput('about')}
              style={styles.clearButton}>
              <Text style={styles.clearButtonText}>×</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.saveButton,
            !isSaveEnabled && styles.saveButtonDisabled,
          ]}
          onPress={saveUserData}
          disabled={!isSaveEnabled}>
          <Text
            style={[
              styles.saveButtonText,
              !isSaveEnabled && styles.saveButtonTextDisabled,
            ]}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      {/* Common Buttons */}
      <View style={styles.buttonContainer}>
        {/* <TouchableOpacity style={styles.linkButton}>
          <LinearGradient
            colors={['#651BF4', '#2B0960']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.gradientButton}>
            <Text style={styles.linkText}>Developer website</Text>
          </LinearGradient>
        </TouchableOpacity> */}

        {/* <TouchableOpacity style={styles.linkButton}>
          <LinearGradient
            colors={['#E50FE4', '#3493FC']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.gradientButton}>
            <Text style={styles.linkText}>Terms of use</Text>
          </LinearGradient>
        </TouchableOpacity> */}

        {/* <TouchableOpacity style={styles.linkButton}>
          <LinearGradient
            colors={['#FD365C', '#D504DB']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.gradientButton}>
            <Text style={styles.linkText}>Privacy policy</Text>
          </LinearGradient>
        </TouchableOpacity> */}

        <View style={styles.notificationContainer}>
          <Text style={styles.notificationText}>Background Sound</Text>
          <Switch
            value={userData.notifications}
            onValueChange={value =>
              setUserData(prev => ({...prev, notifications: value}))
            }
            trackColor={{false: '#333', true: '#00FF7F'}}
            thumbColor={'#fff'}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#100E1B',
    paddingTop: 50,
    paddingHorizontal: 10,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#00FF7F',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  profileImageContent: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  plusIcon: {
    fontSize: 40,
    color: '#fff',
  },
  profileIcon: {
    fontSize: 40,
  },
  closeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#fff',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  formContainer: {
    marginTop: 20,
  },
  label: {
    color: '#fff',
    marginBottom: 8,
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  input: {
    flex: 1,
    backgroundColor: '#231D37',
    borderRadius: 12,
    paddingVertical: 18,
    color: '#fff',
    fontSize: 16,
    paddingHorizontal: 15,
  },
  clearButton: {
    position: 'absolute',
    right: 18,
    backgroundColor: 'transparent',
  },
  clearButtonText: {
    color: '#666',
    fontSize: 22,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#00F0A3',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonDisabled: {
    backgroundColor: '#2D2B38',
  },
  saveButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButtonTextDisabled: {
    color: '#666',
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: 20,
  },
  userName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  aboutText: {
    color: '#666',
    marginTop: 8,
  },
  buttonContainer: {
    marginTop: 30,
  },
  linkButton: {
    marginBottom: 15,
  },
  gradientButton: {
    borderRadius: 8,
  },
  linkText: {
    // padding: 15,
    color: '#fff',
    fontSize: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
    fontWeight: 'bold',
  },
  notificationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#393158',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  notificationText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default TabProfile;
