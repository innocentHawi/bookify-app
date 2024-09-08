import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import { icons } from '../constants';
import { useRouter } from 'expo-router'; // Using expo-router for navigation


const BookCard = ({ books: { title, thumbnail, author, ebook, audiobook, genre, synopsis, publsihdate, publisher: { username, avatar } } }) => {
  const router = useRouter(); // Hook for navigation

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

        <View className="pt-2">
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </View>
      </View>

      {/* Navigate to the PDF Viewer */}
      <TouchableOpacity
        onPress={() => router.push({ pathname: 'pdf-viewer', params: { ebook } })} // Pass the PDF URL to pdf-viewer screen
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
    </View>
  );
};

export default BookCard;
