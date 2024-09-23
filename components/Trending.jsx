import { useState, useEffect } from 'react';
import { Text, FlatList, TouchableOpacity, ImageBackground, Image, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router'; // For navigation
import { getLatestAudiobooks } from '../lib/appwrite'; // Fetch function to get audiobooks
import { icons } from '../constants'; // Your icons source

// Animation for scaling items in the list
const zoomIn = {
  0: { scale: 0.9 },
  1: { scale: 1 }
};

const zoomOut = {
  0: { scale: 1 },
  1: { scale: 0.9 }
};

// TrendingItem Component - renders each audiobook
const TrendingItem = ({ activeItem, item }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Function to play audio
  const playAudio = async (url) => {
    try {
      
      console.log('Loading Audio');
      const { sound } = await Audio.Sound.createAsync({ uri: url });
      setSound(sound);
  
      // Ensure the volume is set correctly
      await sound.setVolumeAsync(1.0); // Maximum volume (range is from 0.0 to 1.0)
  
      console.log('Playing Audio');
      await sound.playAsync();
      setIsPlaying(true);
  
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };
  // Stop the sound when the component unmounts
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync(); // Unload the sound if component unmounts
        }
      : undefined;
  }, [sound]);

  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      <TouchableOpacity
        className="relative flex justify-center items-center"
        activeOpacity={0.7}
        onPress={() => playAudio(item.audiobook)} // Play audiobook on press
      >
        <ImageBackground
          source={{ uri: item.thumbnail }}
          className="w-52 h-72 rounded-[33px] my-5 overflow-hidden shadow-lg shadow-black/40"
          resizeMode="cover"
        />
        <Image
          source={isPlaying ? icons.pause : icons.play} // Change icon based on playing status
          className="w-12 h-12 absolute"
          resizeMode="contain"
        />
      </TouchableOpacity>
    </Animatable.View>
  );
};

// Trending Component - Renders list of audiobooks
const Trending = ({ posts }) => {
  const [activeItem, setActiveItem] = useState(posts[0]?.$id); // Default to first item

  // Handle viewable item changes in FlatList
  const viewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => <TrendingItem activeItem={activeItem} item={item} />}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
};

// Main Component - Fetches the audiobooks and renders the Trending list
const TrendingAudiobooks = () => {
  const [latestAudiobooks, setLatestAudiobooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch latest audiobooks on mount
  useEffect(() => {
    const fetchAudiobooks = async () => {
      try {
        const audiobooks = await getLatestAudiobooks();
        setLatestAudiobooks(audiobooks);
      } catch (error) {
        console.error('Error fetching audiobooks:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAudiobooks();
  }, []);

  if (loading) {
    return <Text>Loading audiobooks...</Text>;
  }

  return (
    <View className="w-full flex-1 pt-5 pb-8">
      <Text className="text-gray-100 text-lg font-pregular mb-3">Trending Audiobooks</Text>
      {latestAudiobooks.length > 0 ? (
        <Trending posts={latestAudiobooks} />
      ) : (
        <Text className="text-gray-100 text-lg">No audiobooks available</Text>
      )}
    </View>
  );
};

export default Trending;
