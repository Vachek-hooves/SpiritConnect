import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView
} from 'react-native';
import React, {useState} from 'react';
import {usePracticeContext} from '../../store/context';
import NoItems from '../../components/ui/NoItems';
import {Picker} from '@react-native-picker/picker';
import {launchImageLibrary} from 'react-native-image-picker';

const TabPractices = ({navigation}) => {
  const {addPractice} = usePracticeContext();
  const [newPractice, setNewPractice] = useState({
    name: '',
    duration: '',
    text: '',
    type: 'meditation',
    image: null,
    isCompleted: false,
  });

  const handleImagePick = async () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    try {
      const result = await launchImageLibrary(options);
      if (result.assets && result.assets[0]) {
        setNewPractice(prev => ({
          ...prev,
          image: result.assets[0].uri,
        }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleSave = () => {
    if (newPractice.name && newPractice.duration && newPractice.text) {
      addPractice({
        ...newPractice,
        id: Date.now().toString(),
        duration: parseInt(newPractice.duration),
      });
      // Reset form after saving
      setNewPractice({
        name: '',
        duration: '',
        text: '',
        type: 'meditation',
        image: null,
        isCompleted: false,
      });
      // Optionally navigate back or show success message
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Practice</Text>

<ScrollView showsVerticalScrollIndicator={false} style={{flex:1}}>


      <TextInput
        style={styles.input}
        placeholder="Practice name"
        placeholderTextColor="#666"
        value={newPractice.name}
        onChangeText={text => setNewPractice(prev => ({...prev, name: text}))}
      />

      <TextInput
        style={styles.input}
        placeholder="Duration (minutes)"
        placeholderTextColor="#666"
        keyboardType="numeric"
        value={newPractice.duration}
        onChangeText={text =>
          setNewPractice(prev => ({...prev, duration: text}))
        }
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        placeholderTextColor="#666"
        multiline
        value={newPractice.text}
        onChangeText={text => setNewPractice(prev => ({...prev, text: text}))}
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={newPractice.type}
          style={styles.picker}
          dropdownIconColor="#fff"
          onValueChange={itemValue =>
            setNewPractice(prev => ({...prev, type: itemValue}))
          }>
          <Picker.Item label="Meditation" value="meditation"  />
          <Picker.Item label="Yoga" value="yoga" />
          <Picker.Item label="Breath" value="breathing" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.imageButton} onPress={handleImagePick}>
        <Text style={styles.imageButtonText}>
          {newPractice.image ? 'Change Image' : 'Add Image'}
        </Text>
      </TouchableOpacity>

      {newPractice.image && (
        <View style={styles.imageContainer}>
          <Image
            source={{uri: newPractice.image}}
            style={styles.previewImage}
          />
          <TouchableOpacity
            style={styles.removeImageButton}
            onPress={() => setNewPractice(prev => ({...prev, image: null}))}>
            <Text style={styles.removeImageText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Practice</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity> */}
      </View>
      </ScrollView>
      <View style={{height: 100}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#100E1B',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#231D37',
    color: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#231D37',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
  },
  picker: {
    color: '#fff',
  },
  imageButton: {
    backgroundColor: '#231D37',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: '#fff',
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 'auto',
    gap: 10,
  },
  saveButton: {
    backgroundColor: '#00FF7F',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FF0000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TabPractices;
