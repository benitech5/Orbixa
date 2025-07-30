import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Animated
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import { useAppDispatch } from '../../store/store';
import { login } from '../../store/authSlice';
import { verifyOtp } from '../../api/AuthService';
import { Ionicons } from '@expo/vector-icons';

type OtpScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Otp'>;
type OtpScreenRouteProp = RouteProp<AuthStackParamList, 'Otp'>;

const OtpScreen = () => {
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const inputRefs = useRef<Array<TextInput | null>>([]);
    const navigation = useNavigation<OtpScreenNavigationProp>();
    const route = useRoute<OtpScreenRouteProp>();
    const { phoneNumber } = route.params;
    const dispatch = useAppDispatch();

    const handleChange = (text: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);
        if (text && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleBackspace = (index: number) => {
        if (index > 0 && !otp[index]) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const setInputRef = (index: number) => (el: TextInput | null) => {
        inputRefs.current[index] = el;
    };

    const handleVerify = () => {
        const otpValue = otp.join('');
        if (otpValue.length !== 6) {
            setError('Please enter the 6-digit OTP.');
            return;
        }
        setError('');
        setIsVerifying(true);

        // Simulate verification process
        setTimeout(() => {
            setIsVerifying(false);
            // @ts-ignore
            navigation.getParent()?.reset({
                index: 0,
                routes: [{ name: 'Main', params: { screen: 'Home' } }],
            });
        }, 1500);
    };

    const isOtpComplete = otp.every(digit => digit !== '');

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Pressable
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </Pressable>
                    <View style={styles.placeholder} />
                </View>

                {/* Main Content */}
                <View style={styles.content}>
                    {/* Icon Section */}
                    <View style={styles.iconSection}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="shield-checkmark" size={60} color="#DC143C" />
                        </View>
                    </View>

                    {/* Title Section */}
                    <View style={styles.titleSection}>
                        <Text style={styles.title}>Verify Your Phone</Text>
                        <Text style={styles.subtitle}>
                            We've sent a 6-digit code to
                        </Text>
                        <Text style={styles.phoneNumber}>{phoneNumber}</Text>
                    </View>

                    {/* OTP Input Section */}
                    <View style={styles.otpSection}>
                        <Text style={styles.otpLabel}>Enter the code</Text>
                        <View style={styles.otpContainer}>
                            {otp.map((digit, index) => (
                                <TextInput
                                    key={index}
                                    ref={setInputRef(index)}
                                    style={[
                                        styles.otpInput,
                                        digit && styles.otpInputFilled,
                                        error && styles.otpInputError
                                    ]}
                                    keyboardType="number-pad"
                                    maxLength={1}
                                    value={digit}
                                    onChangeText={(text) => handleChange(text, index)}
                                    onKeyPress={({ nativeEvent }) => {
                                        if (nativeEvent.key === 'Backspace') {
                                            handleBackspace(index);
                                        }
                                    }}
                                    autoFocus={index === 0}
                                />
                            ))}
                        </View>

                        {error ? (
                            <View style={styles.errorContainer}>
                                <Ionicons name="alert-circle" size={16} color="#DC143C" />
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : null}
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionSection}>
                        <Pressable
                            style={[
                                styles.verifyButton,
                                !isOtpComplete && styles.verifyButtonDisabled
                            ]}
                            onPress={handleVerify}
                            disabled={!isOtpComplete || isVerifying}
                        >
                            {isVerifying ? (
                                <View style={styles.loadingContainer}>
                                    <Text style={styles.verifyButtonText}>Verifying...</Text>
                                </View>
                            ) : (
                                <>
                                    <Text style={styles.verifyButtonText}>Verify Code</Text>
                                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                                </>
                            )}
                        </Pressable>

                        <Pressable
                            style={styles.resendButton}
                            onPress={() => {
                                // TODO: Implement resend logic
                                Alert.alert('Resend Code', 'Code resent successfully!');
                            }}
                        >
                            <Text style={styles.resendText}>Didn't receive code? </Text>
                            <Text style={styles.resendLink}>Resend</Text>
                        </Pressable>
                    </View>
                </View>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 16,
        marginTop: 20,
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
    },
    placeholder: {
        width: 40,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
    },
    iconSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    titleSection: {
        alignItems: 'center',
        marginBottom: 40,
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
        marginBottom: 8,
    },
    phoneNumber: {
        fontSize: 18,
        fontWeight: '600',
        color: '#DC143C',
        textAlign: 'center',
    },
    otpSection: {
        marginBottom: 40,
    },
    otpLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
        textAlign: 'center',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    otpInput: {
        width: 50,
        height: 60,
        borderWidth: 2,
        borderColor: '#e9ecef',
        borderRadius: 12,
        textAlign: 'center',
        fontSize: 24,
        fontWeight: '600',
        marginHorizontal: 6,
        backgroundColor: '#f8f9fa',
        color: '#333',
    },
    otpInputFilled: {
        borderColor: '#DC143C',
        backgroundColor: '#fff',
        shadowColor: '#DC143C',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    otpInputError: {
        borderColor: '#DC143C',
        backgroundColor: '#fef2f2',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fef2f2',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    errorText: {
        color: '#DC143C',
        fontSize: 14,
        marginLeft: 8,
    },
    actionSection: {
        alignItems: 'center',
    },
    verifyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DC143C',
        height: 56,
        borderRadius: 12,
        paddingHorizontal: 32,
        marginBottom: 20,
        shadowColor: '#DC143C',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        minWidth: 200,
    },
    verifyButtonDisabled: {
        backgroundColor: '#ccc',
        shadowOpacity: 0,
        elevation: 0,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    verifyButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginRight: 8,
    },
    resendButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    resendText: {
        fontSize: 14,
        color: '#666',
    },
    resendLink: {
        fontSize: 14,
        color: '#DC143C',
        fontWeight: '600',
    },
});

export default OtpScreen;
