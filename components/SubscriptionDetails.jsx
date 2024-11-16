// SubscriptionDetails.jsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, TextInput, Alert } from 'react-native';
import axios from 'axios';

const PLAN_PRICES = {
  Basic: 10,
  Premium: 1999,
  Family: 2999,
};

const SubscriptionDetails = ({ plan, goBack }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const planPrice = PLAN_PRICES[plan];

  const initiatePayment = async () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    try {
      const response = await axios.post('https://9635-102-217-172-58.ngrok-free.app/initiate-payment', {
        phoneNumber,
        plan,
        planPrice,
      });
      if (response.status === 200) {
        //Alert.alert('Success', 'Check your phone to complete the payment');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to initiate payment');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Selected Plan: {plan}</Text>
        <Text style={styles.price}>Amount: Ksh {planPrice}</Text>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            placeholder="Enter Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={styles.input}
            keyboardType="phone-pad"
          />
        </View>

        <TouchableOpacity style={styles.payButton} onPress={initiatePayment}>
          <Text style={styles.buttonText}>Pay</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0f23', justifyContent: 'center', alignItems: 'center' },
  content: { alignItems: 'center', width: '90%' },
  title: { fontSize: 28, color: '#fff', fontWeight: '600', marginBottom: 10 },
  price: { fontSize: 20, color: '#9ca3af', marginBottom: 20 },
  formContainer: { marginBottom: 20, width: '100%' },
  label: { color: '#9ca3af', fontSize: 16, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#444', borderRadius: 8, padding: 12, marginBottom: 10, width: '100%', color: '#fff', backgroundColor: '#1e2139' },
  payButton: { backgroundColor: '#ff7f50', paddingVertical: 15, borderRadius: 10, width: '100%', alignItems: 'center', marginTop: 10 },
  backButton: { backgroundColor: '#ffa500', paddingVertical: 15, borderRadius: 10, width: '100%', alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});

export default SubscriptionDetails;
