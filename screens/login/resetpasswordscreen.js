import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ResetPasswordScreen = () => {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();

  const handleSendOtp = () => setStep(2);
  const handleVerifyOtp = () => setStep(3);

  const handleResetPassword = () => {
    if (isResetting) return; // Avoid duplicate calls
    setIsResetting(true);

    console.log('Password reset successful...');
    try {
      setTimeout(() => {
        setIsResetting(false);
        setResetComplete(true); // Show success message

        // Delay navigation for a smoother transition
        setTimeout(() => {
          navigation.replace('LoginScreen'); // Navigate to login screen
        }, 1000); // 2-second delay

      }, 500);
    } catch (error) {
      console.error('Password reset error:', error);
      setIsResetting(false);
    }
  };

  const handleMobileChange = (text) => {
    const cleanedText = text.replace(/[^0-9]/g, '');
    if (cleanedText.length <= 10) {
      setMobile(cleanedText);
    }
  };

  const handleOtpChange = (text) => {
    const cleanedText = text.replace(/[^0-9]/g, '');
    if (cleanedText.length <= 4) {
      setOtp(cleanedText);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={[styles.innerContainer, { minHeight: height * 0.9 }]}> 

          {resetComplete ? (
           <>
           <Text style={styles.successMessage}>Password reset successful...</Text>
           <Text style={styles.successMessage}>Please login to your Account</Text>
         </>
          ) : (
            <>
              {step === 1 && (
                <>
                  <Text style={styles.title}>Reset Password</Text>
                  <Text style={styles.label}>Mobile Number</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Mobile Number"
                    keyboardType="phone-pad"
                    value={mobile}
                    onChangeText={handleMobileChange}
                    maxLength={10}
                  />
                  <TouchableOpacity 
                    style={[styles.button, mobile.length !== 10 && styles.disabledButton]} 
                    disabled={mobile.length !== 10}
                    onPress={handleSendOtp}
                  >
                    <Text style={styles.buttonText}>SEND OTP</Text>
                  </TouchableOpacity>
                </>
              )}

              {step === 2 && (
                <>
                  <Text style={styles.title}>Verify OTP</Text>
                  <Text style={styles.label}>Enter OTP</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter OTP"
                    keyboardType="numeric"
                    value={otp}
                    onChangeText={handleOtpChange}
                    maxLength={4}
                  />
                  <TouchableOpacity 
                    style={[styles.button, otp.length !== 4 && styles.disabledButton]} 
                    disabled={otp.length !== 4}
                    onPress={handleVerifyOtp}
                  >
                    <Text style={styles.buttonText}>VERIFY OTP</Text>
                  </TouchableOpacity>
                </>
              )}

              {step === 3 && (
                <>
                  <Text style={styles.title}>Set New Password</Text>
                  <Text style={styles.label}>New Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter New Password"
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                  />
                  <Text style={styles.label}>Confirm Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                  <TouchableOpacity 
                    style={[styles.button, (!newPassword || newPassword !== confirmPassword) && styles.disabledButton]} 
                    disabled={!newPassword || newPassword !== confirmPassword}
                    onPress={handleResetPassword}
                  >
                    <Text style={styles.buttonText}>
                      {isResetting ? 'RESETTING...' : 'RESET PASSWORD'}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  innerContainer: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successMessage: {
    fontSize: 20,
    color: '#28a745',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default ResetPasswordScreen;
