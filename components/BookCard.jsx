import { View, Text, Image, TouchableOpacity, Modal, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { icons } from '../constants';
import { useRouter } from 'expo-router';
import { useGlobalContext } from '../context/GlobalProvider'; 
import { getCurrentUserR } from '../lib/appwrite';

const BookCard = ({ books: { title, thumbnail, author, ebook, audiobook, genre, synopsis, publsihdate, publisher: { username, avatar } } }) => {
  const router = useRouter();
  const [readerId, setReaderId] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { savedBooks, setSavedBooks } = useGlobalContext(false); 
  const [forceFetch, setForceFetch] = useState(false); // Initialize forceFetch state
  const [modalVisible, setModalVisible] = useState(false); // For showing the menu


  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const currentUser = await getCurrentUserR();
        setReaderId(currentUser.readerId);
        const status = currentUser?.subscriptionStatus ?? false;
        setIsSubscribed(status);
        console.log("Subscription status in component:", status);
    } catch (error) {
        console.error("Error fetching current user or subscription status:", error.message);
        setIsSubscribed(false); // Default to false on error
    }
  };

    checkSubscription();
}, [forceFetch]);

  const handleOpenBook = () => {
    console.log("Subscription status at handleOpenBook:", isSubscribed);
    if (isSubscribed) {
      router.push({ pathname: "pdf-viewer", params: { ebook } });
    } else {
       Alert.alert(
          "Subscription Required",
          "You need to subscribe to access this book.",
          [{ text: "Subscribe Now", onPress: () => router.push("subscribe") }]
      );
    }
  };

  const handleSubscriptionUpdate = async () => {
    try {
      // Simulating backend subscription update, then refresh the subscription status
      // Assuming backend updates subscription status, now we just need to refresh the user data.
      
      // Trigger force fetch to re-fetch user data
      setForceFetch(prev => !prev); // Toggle to re-trigger useEffect

      Alert.alert("Success", "Subscription updated successfully!");
    } catch (error) {
      console.error("Error updating subscription:", error.message);
      Alert.alert("Error", "Failed to update subscription status.");
    }
  };


  // Save book function
  const saveBook = () => {
    setSavedBooks((prevBooks) => [...prevBooks, { title, thumbnail, author, ebook, audiobook, genre, synopsis, publsihdate, username, avatar }]);
    Alert.alert("Success", `${title} has been saved!`);
    setModalVisible(false); // Close the modal after saving
  };

  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image source={{ uri: avatar }} className="w-full h-full rounded-lg" resizeMode="cover" />
          </View>

          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text className="text-white fon-psemibold text-sm" numberOfLines={1}>
              {title}
            </Text>
            <Text className="text-xs text-gray-100 font-pregular" numberOfLines={1}>
              {username}
            </Text>
          </View>
        </View>

        {/* Menu button */}
        <TouchableOpacity className="pt-2" onPress={() => setModalVisible(true)}>
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </TouchableOpacity>
      </View>

      {/* Navigate to the PDF Viewer */}
      <TouchableOpacity
        onPress={handleOpenBook} 
        className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
      >
        <Image
          source={{ uri: thumbnail }}
          className="w-full h-full rounded-xl mt-3"
          resizeMode="cover"
        />
        <Image
          source={icons.read}
          className="w-12 h-12 absolute"
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Modal for menu options */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="w-[90%] bg-white p-5 rounded-lg">
            <Text className="text-lg font-psemibold mb-4">Options</Text>
            
            {/* Save option */}
            <TouchableOpacity onPress={saveBook} className="py-3">
              <Text className="text-primary text-lg">Save Book</Text>
            </TouchableOpacity>

             {/* Subscription update option */}
             <TouchableOpacity onPress={handleSubscriptionUpdate} className="py-3">
              <Text className="text-primary text-lg">Update Subscription</Text>
            </TouchableOpacity>

            {/* Close modal button */}
            <TouchableOpacity onPress={() => setModalVisible(false)} className="py-3">
              <Text className="text-gray-600 text-lg">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BookCard;
