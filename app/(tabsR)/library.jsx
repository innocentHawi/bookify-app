import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '../../context/GlobalProvider'
import { useRouter } from 'expo-router'; // For navigation
import { icons } from '../../constants'
import { images } from '../../constants'

const Library = () => {
  const { savedBooks } = useGlobalContext(); // Access saved books
  const router = useRouter(); // Hook for navigation

  return (
    <SafeAreaView className="bg-primary h-full">
        <View className="px-4 py-6 justify-between items-center flex-row ">
        <Text className="font-psemibold text-2xl text-white">Library</Text>
        <Image 
          source={images.bookifySmall}
          className="w-9 h-10"
          resizeMode='contain'
        />
      </View>
      <FlatList
        data={savedBooks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View className="px-4 py-6">
            {/* Book Information */}
            <Text className="text-white font-psemibold text-lg">{item.title}</Text>
            <Text className="text-gray-200 text-sm">by {item.author}</Text>

            {/* Book Thumbnail */}
            <TouchableOpacity
              onPress={() => router.push({ pathname: 'pdf-viewer', params: { ebook: item.ebook } })}
              className="w-full h-60 rounded-lg mt-3 relative justify-center items-center"
            >
              <Image
                source={{ uri: item.thumbnail }}
                className="w-full h-full rounded-lg"
                resizeMode="cover"
              />
              <Image
                source={icons.read}
                className="w-12 h-12 absolute"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={() => (
          <Text className="text-gray-200 text-lg px-4">No books saved yet.</Text>
        )}
      />
    </SafeAreaView>
  );
};

export default Library;
