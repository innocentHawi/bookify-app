import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, TextInput, Alert } from 'react-native';
import axios from 'axios';
import { account } from 'react-native-appwrite';  // Import Appwrite's account object
import { getCurrentUserR } from '../lib/appwrite';

const PLAN_PRICES = {
  Basic: 1,
  Premium: 1999,
  Family: 2999,
};

const SubscriptionDetails = ({ plan, goBack }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [readerId, setReaderId] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState(false);
  const planPrice = PLAN_PRICES[plan];

  useEffect(() => {
    // Get the current user's details (including readerId) when the component mounts
    const getCurrentUser = async () => {
      try {
        const currentUser = await getCurrentUserR();
        setReaderId(currentUser.readerId);
        // Set the subscription status
      const status = currentUser?.subscriptionStatus ?? false;
      setSubscriptionStatus(status);
      //console.log("Fetched Subscription:", status);
      } catch (error) {
        console.error('Error fetching user details:', error.message);
      }
    };

    getCurrentUser();
  }, []);

  const initiatePayment = async () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }
    if (!readerId) {
      Alert.alert('Error', 'User not authenticated or readerId not found');
      return;
    }
  
    console.log('Current Subscription Status:', subscriptionStatus);
    try {
      const response = await axios.post('https://39a6-102-217-172-58.ngrok-free.app/initiate-payment', {
        phoneNumber,
        plan,
        planPrice,
        readerId, 
        subscriptionStatus,
      });

      if (response.status === 200) {
        // Successfully initiated payment, notify user or proceed with next steps
        Alert.alert('Success', 'Check your phone to complete the payment');
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
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
