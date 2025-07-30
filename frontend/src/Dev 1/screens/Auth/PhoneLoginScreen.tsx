import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Pressable, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  TextInput,
  SafeAreaView,
  ScrollView,
  Animated,
  Dimensions
} from 'react-native';
import { CountryPicker } from 'react-native-country-codes-picker';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const PhoneLoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');
    const [countryCode, setCountryCode] = useState('GH');
    const [callingCode, setCallingCode] = useState('233');
    const [countryName, setCountryName] = useState('Ghana');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [countryFlag, setCountryFlag] = useState('');

    // Step 1: Name input
    const handleNameChange = (text: string) => {
        setName(text);
        if (text.length < 5) {
            setNameError('Name must be at least 5 characters');
        } else {
            setNameError('');
        }
    };
    const handleNameNext = () => {
        if (name.length >= 5) {
            setStep(2);
        } else {
            setNameError('Name must be at least 5 characters');
        }
    };

    // Step 2: Phone input
    const handleSelectCountry = (country: any) => {
        console.log('Selected country:', country);
        setCountryCode(country.code || countryCode);
        setCallingCode((country.dial_code && country.dial_code.replace('+', '')) || callingCode);
        setCountryName(
            typeof country.name === 'string'
                ? country.name
                : (country.name && country.name.en) || countryName
        );
        setCountryFlag(country.flag || '');
        setShowCountryPicker(false);
    };
    const handlePhoneChange = (text: string) => {
        // Remove non-numeric characters
        const filtered = text.replace(/[^0-9]/g, '');
        setPhoneNumber(filtered);
        // Validate phone number (excluding country code)
        if (filtered.length >= 7 && filtered.length <= 12) {
            setIsValid(true);
        } else {
            setIsValid(false);
        }
    };

    const handleSubmit = () => {
        if (isValid) {
            const fullPhone = `+${callingCode}${phoneNumber}`;
            navigation.navigate('Auth', { screen: 'Otp', params: { phoneNumber: fullPhone, name } });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Pressable 
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="arrow-back" size={24} color="#333" />
                        </Pressable>
                        <View style={styles.stepIndicator}>
                            <View style={[styles.stepDot, step >= 1 && styles.activeStepDot]} />
                            <View style={[styles.stepDot, step >= 2 && styles.activeStepDot]} />
                        </View>
                        <View style={styles.placeholder} />
                    </View>

                    {/* Brand Section */}
                    <View style={styles.brandSection}>
                        <View style={styles.logoContainer}>
                            <Ionicons name="person-circle" size={80} color="#DC143C" />
                        </View>
                        <Text style={styles.brandText}>Welcome to Orbixa</Text>
                        <Text style={styles.brandSubtext}>Let's get you started</Text>
                    </View>

                    {/* Form Section */}
                    <View style={styles.formSection}>
                        {step === 1 && (
                            <>
                                <Text style={styles.title}>What's your name?</Text>
                                <Text style={styles.subtitle}>
                                    Please enter your full name to continue
                                </Text>
                                
                                <View style={styles.inputContainer}>
                                    <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter your full name"
                                        placeholderTextColor="#999"
                                        value={name}
                                        onChangeText={handleNameChange}
                                        autoFocus
                                        autoCapitalize="words"
                                        autoCorrect={false}
                                    />
                                </View>
                                
                                {nameError !== '' && (
                                    <View style={styles.errorContainer}>
                                        <Ionicons name="alert-circle" size={16} color="#DC143C" />
                                        <Text style={styles.errorText}>{nameError}</Text>
                                    </View>
                                )}
                                
                                <Pressable
                                    style={[
                                        styles.primaryButton,
                                        name.length < 5 && styles.disabledButton
                                    ]}
                                    onPress={handleNameNext}
                                    disabled={name.length < 5}
                                >
                                    <Text style={styles.primaryButtonText}>Continue</Text>
                                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                                </Pressable>
                            </>
                        )}
                        
                        {step === 2 && (
                            <>
                                <Text style={styles.title}>Phone Number</Text>
                                <Text style={styles.subtitle}>
                                    We'll send you a verification code
                                </Text>
                                
                                {/* Country Selection */}
                                <View style={styles.countrySection}>
                                    <Text style={styles.sectionLabel}>Country</Text>
                                    <Pressable 
                                        style={styles.countrySelector}
                                        onPress={() => setShowCountryPicker(true)}
                                    >
                                        <View style={styles.countryInfo}>
                                            <Text style={styles.countryFlag}>{countryFlag}</Text>
                                            <Text style={styles.countryName}>{countryName}</Text>
                                        </View>
                                        <Ionicons name="chevron-down" size={20} color="#666" />
                                    </Pressable>
                                </View>
                                
                                {/* Phone Input */}
                                <View style={styles.phoneSection}>
                                    <Text style={styles.sectionLabel}>Phone Number</Text>
                                    <View style={styles.phoneInputContainer}>
                                        <View style={styles.countryCodeContainer}>
                                            <Text style={styles.countryCode}>+{callingCode}</Text>
                                        </View>
                                        <TextInput
                                            style={styles.phoneInput}
                                            placeholder="Enter phone number"
                                            placeholderTextColor="#999"
                                            keyboardType="number-pad"
                                            value={phoneNumber}
                                            onChangeText={handlePhoneChange}
                                            maxLength={15}
                                            autoFocus
                                        />
                                    </View>
                                </View>
                                
                                <Pressable
                                    style={[
                                        styles.primaryButton,
                                        !isValid && styles.disabledButton
                                    ]}
                                    onPress={handleSubmit}
                                    disabled={!isValid}
                                >
                                    <Text style={styles.primaryButtonText}>Send Code</Text>
                                    <Ionicons name="send" size={20} color="#fff" />
                                </Pressable>
                            </>
                        )}
                    </View>
                </ScrollView>
                
                {/* Country Picker Modal */}
                <CountryPicker
                    show={showCountryPicker}
                    lang="en"
                    pickerButtonOnPress={(item) => {
                        handleSelectCountry(item);
                    }}
                    style={{ 
                        modal: { 
                            height: 400,
                            backgroundColor: '#fff',
                            borderRadius: 20,
                        } 
                    }}
                />
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
    stepIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stepDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 4,
    },
    activeStepDot: {
        backgroundColor: '#DC143C',
        width: 24,
    },
    placeholder: {
        width: 40,
    },
    brandSection: {
        alignItems: 'center',
        marginVertical: 40,
    },
    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    brandText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 8,
    },
    brandSubtext: {
        fontSize: 16,
        color: '#666',
    },
    formSection: {
        flex: 1,
        paddingHorizontal: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1a1a1a',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 24,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        marginBottom: 20,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        height: 56,
        fontSize: 16,
        color: '#333',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fef2f2',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginBottom: 20,
    },
    errorText: {
        color: '#DC143C',
        fontSize: 14,
        marginLeft: 8,
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    countrySection: {
        marginBottom: 24,
    },
    countrySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    countryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    countryFlag: {
        fontSize: 24,
        marginRight: 12,
    },
    countryName: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    phoneSection: {
        marginBottom: 40,
    },
    phoneInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e9ecef',
        overflow: 'hidden',
    },
    countryCodeContainer: {
        backgroundColor: '#e9ecef',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderRightWidth: 1,
        borderRightColor: '#dee2e6',
    },
    countryCode: {
        fontSize: 16,
        color: '#333',
        fontWeight: '600',
    },
    phoneInput: {
        flex: 1,
        height: 56,
        fontSize: 16,
        color: '#333',
        paddingHorizontal: 16,
    },
    primaryButton: {
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
    disabledButton: {
        backgroundColor: '#ccc',
        shadowOpacity: 0,
        elevation: 0,
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginRight: 8,
    },
});

export default PhoneLoginScreen;