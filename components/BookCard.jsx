import { View, Text, Image, TouchableOpacity, Dimensions, Modal, Alert } from 'react-native';
import React, { useState } from 'react';
import { icons } from '../constants';
import { useRouter } from 'expo-router';
import { useGlobalContext } from '../context/GlobalProvider'; // Assuming you have a global context

const BookCard = ({ books: { title, thumbnail, author, ebook, audiobook, genre, synopsis, publsihdate, publisher: { username, avatar } } }) => {
  const router = useRouter();
  const { savedBooks, setSavedBooks } = useGlobalContext(); // Assuming savedBooks is in global context
  const [modalVisible, setModalVisible] = useState(false); // For showing the menu

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
        onPress={() => router.push({ pathname: 'pdf-viewer', params: { ebook } })} 
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
