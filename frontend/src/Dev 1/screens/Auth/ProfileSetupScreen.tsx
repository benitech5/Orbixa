import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList, RootStackParamList } from '../../types/navigation';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { login } from '../../store/authSlice';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

type ProfileSetupNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<AuthStackParamList, 'ProfileSetup'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface ProfileSetupScreenProps {
  navigation: ProfileSetupNavigationProp;
  route: {
    params: {
      phoneNumber: string;
    };
  };
}

const ProfileSetupScreen: React.FC<ProfileSetupScreenProps> = ({ navigation, route }) => {
  const { phoneNumber } = route.params;
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [otherName, setOtherName] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photo library');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your camera');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Profile Picture',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const generateUsername = () => {
    const base = firstName.toLowerCase().replace(/[^a-z]/g, '') + 
                 lastName.toLowerCase().replace(/[^a-z]/g, '');
    const randomNum = Math.floor(Math.random() * 1000);
    setUsername(`${base}${randomNum}`);
  };

  const validateName = (name: string) => {
    // Only allow letters, spaces, hyphens, and apostrophes
    return /^[A-Za-z\s\-']{4,}$/.test(name);
  };

  const handleFirstNameChange = (text: string) => {
    setFirstName(text);
    if (!validateName(text)) {
      setFirstNameError('First name must be at least 4 letters and contain only valid characters');
    } else {
      setFirstNameError('');
    }
  };
  const handleLastNameChange = (text: string) => {
    setLastName(text);
    if (!validateName(text)) {
      setLastNameError('Last name must be at least 4 letters and contain only valid characters');
    } else {
      setLastNameError('');
    }
  };

  const handleSave = async () => {
    if (!firstName.trim()) {
      Alert.alert('Error', 'First name is required');
      return;
    }

    if (!lastName.trim()) {
      Alert.alert('Error', 'Last name is required');
      return;
    }

    if (!username.trim()) {
      Alert.alert('Error', 'Username is required');
      return;
    }

    setIsLoading(true);

    try {
      const profileData = {
        firstName: firstName.trim(),
        otherName: otherName.trim() || null,
        username: username.trim(),
        profilePictureUrl: profileImage || null,
        phoneNumber,
      };
      console.log('Profile data being sent:', profileData);
      // Call backend API to create user profile
      const response = await axios.post('http://10.132.219.185:8082/api/user', profileData);
      console.log('Profile save response:', response.data);
      // Optionally, you can use response.data if you want to update Redux with backend data
      dispatch(login(response.data));

      // Navigate to main app
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' as any }],
      });
    } catch (error: any) {
      console.log('Profile save error:', error.response || error);
      Alert.alert('Error', 'Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    firstName.trim().length >= 4 &&
    lastName.trim().length >= 4 &&
    !firstNameError &&
    !lastNameError &&
    username.trim();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Complete Profile</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Profile Image Section */}
          <View style={styles.imageSection}>
            <TouchableOpacity style={styles.imageContainer} onPress={showImagePickerOptions}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.placeholderImage}>
                  <Ionicons name="person" size={50} color="#DC143C" />
                  <Text style={styles.placeholderText}>Add Photo</Text>
                </View>
              )}
              <View style={styles.editButton}>
                <Ionicons name="camera" size={16} color="#fff" />
              </View>
            </TouchableOpacity>
            <Text style={styles.imageHint}>Tap to add profile picture</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Name Fields */}
            <View style={styles.nameRow}>
              <View style={styles.nameField}>
                <Text style={styles.label}>First Name *</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={firstName}
                    onChangeText={handleFirstNameChange}
                    placeholder="First name"
                    placeholderTextColor="#999"
                    autoFocus
                  />
                </View>
                {firstNameError ? (
                  <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={14} color="#DC143C" />
                    <Text style={styles.errorText}>{firstNameError}</Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.nameField}>
                <Text style={styles.label}>Last Name *</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={lastName}
                    onChangeText={handleLastNameChange}
                    placeholder="Last name"
                    placeholderTextColor="#999"
                  />
                </View>
                {lastNameError ? (
                  <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={14} color="#DC143C" />
                    <Text style={styles.errorText}>{lastNameError}</Text>
                  </View>
                ) : null}
              </View>
            </View>

            {/* Other Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Other Name (Optional)</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={otherName}
                  onChangeText={setOtherName}
                  placeholder="Middle name or nickname"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            {/* Username */}
            <View style={styles.inputGroup}>
              <View style={styles.usernameHeader}>
                <Text style={styles.label}>Username *</Text>
                <TouchableOpacity onPress={generateUsername} style={styles.generateButton}>
                  <Ionicons name="refresh" size={16} color="#DC143C" />
                  <Text style={styles.generateText}>Generate</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.inputContainer}>
                <Ionicons name="at" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Choose a username"
                  placeholderTextColor="#999"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Bio */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bio</Text>
              <View style={styles.textAreaContainer}>
                <TextInput
                  style={styles.textArea}
                  value={bio}
                  onChangeText={setBio}
                  placeholder="Tell us about yourself..."
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={3}
                  maxLength={150}
                  textAlignVertical="top"
                />
                <Text style={styles.charCount}>
                  {bio.length}/150
                </Text>
              </View>
            </View>
          </View>

          {/* Save Button */}
          <View style={styles.buttonSection}>
            <TouchableOpacity
              style={[
                styles.saveButton,
                !isFormValid && styles.saveButtonDisabled
              ]}
              onPress={handleSave}
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <Text style={styles.saveButtonText}>Complete Setup</Text>
                  <Ionicons name="checkmark-circle" size={20} color="#fff" />
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    marginTop: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  imageSection: {
    alignItems: 'center',
    marginVertical: 30,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#DC143C',
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DC143C',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  imageHint: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  formSection: {
    marginBottom: 30,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  nameField: {
    flex: 0.48,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  usernameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
  },
  generateText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#DC143C',
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  textAreaContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  textArea: {
    fontSize: 16,
    color: '#333',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 4,
  },
  errorText: {
    color: '#DC143C',
    fontSize: 12,
    marginLeft: 4,
  },
  buttonSection: {
    paddingBottom: 30,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC143C',
    height: 56,
    borderRadius: 12,
    shadowColor: '#DC143C',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default ProfileSetupScreen; 