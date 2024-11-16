import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import { useGlobalContext } from '../../context/GlobalProvider';
import SubscriptionDetails from '../../components/SubscriptionDetails'; 

const Subscribe = () => {
  const { userR } = useGlobalContext();
  const [selectedPlan, setSelectedPlan] = useState(null); // Track selected plan

  // If a plan is selected, show the SubscriptionDetails page
  if (selectedPlan) {
    return (
      <SubscriptionDetails 
        plan={selectedPlan} 
        goBack={() => setSelectedPlan(null)} // Pass goBack function
      />
    );
  }

  return (
    <SafeAreaView className="bg-primary h-full px-4">
      {/* Header */}
      <View className="justify-between items-center flex-row my-6">
        <Text className="font-psemibold text-2xl text-white">Subscribe</Text>
        <Image 
          source={images.bookifySmall}
          className="w-9 h-10"
          resizeMode="contain"
        />
      </View>

      {/* Welcome Message */}
      <View className="my-6">
        <Text className="text-xl font-pregular text-gray-100">
          Welcome, {userR?.username}!
        </Text>
        <Text className="text-lg text-gray-200 mt-2">
          Choose a subscription plan that best suits you.
        </Text>
      </View>

      {/* Subscription Options */}
      <View className="mt-8 space-y-4">
        <TouchableOpacity 
          className="bg-secondary p-4 rounded-lg" 
          onPress={() => setSelectedPlan('Basic')}
        >
          <Text className="text-xl text-white font-psemibold">Basic Plan</Text>
          <Text className="text-gray-100 mt-2">Ksh1/month</Text>
          <Text className="text-gray-200">Access to all audiobooks</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="bg-secondary p-4 rounded-lg" 
          onPress={() => setSelectedPlan('Premium')}
        >
          <Text className="text-xl text-white font-psemibold">Premium Plan</Text>
          <Text className="text-gray-100 mt-2">Ksh1,999/month</Text>
          <Text className="text-gray-200">Access to audiobooks and exclusive content</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="bg-secondary p-4 rounded-lg" 
          onPress={() => setSelectedPlan('Family')}
        >
          <Text className="text-xl text-white font-psemibold">Family Plan</Text>
          <Text className="text-gray-100 mt-2">Ksh2,999/month</Text>
          <Text className="text-gray-200">Share with up to 5 family members</Text>
        </TouchableOpacity>
      </View>

      {/* Subscribe Button */}
      <TouchableOpacity className="bg-tertiary p-4 rounded-lg mt-12 justify-center items-center">
        <Text className="text-white text-lg font-psemibold">Subscribe Now</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Subscribe;
