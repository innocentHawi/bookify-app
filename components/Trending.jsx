import { useState } from 'react'
import { Text, FlatList, TouchableOpacity, ImageBackground, Image, View} from 'react-native'
import * as Animatable from 'react-native-animatable'

import { icons } from '../constants';
import { useRouter } from 'expo-router'; // Using expo-router for navigation

const zoomIn = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1,
  }
};

const zoomOut = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.9,
  }
};

const TrendingItem = ( {activeItem, item}) => {
  const [play, setPlay] = useState(false);
  const router = useRouter(); // Hook for navigation

  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {play ? (
        <View style={{ flex: 1 }}>
    <Text className="text-white">PDF Viewer Loaded</Text>  
  </View>
      ) : (
        <TouchableOpacity className="relative flex justify-center items-center" 
        activeOpacity={0.7} 
        onPress={() => router.push({ pathname: 'pdf-viewer', params: item.ebook  })}>
          <ImageBackground 
            source={{
              uri: item.thumbnail
            }}
            className="w-52 h-72 rounded-[33px] my-5 overflow-hidden shadow-lg shadow-black/40" 
            resizeMode='cover'
          />
          <Image 
            source={icons.read}
            className="w-12 h-12 absolute"
            resizeMode='contain'
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  )
}


const Trending = ({ posts }) => {
  const [activeItem, setActiveItem] = useState(posts[1]);

  const viewableItemsChanged = ({ viewableItems }) => {
    if(viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key)
    }
  }

  return (
      <FlatList 
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <TrendingItem activeItem={activeItem} item={item} />
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={{ 
          itemVisiblePercentThreshold: 70
        }}
        contentOffset={{ x: 170}}
        horizontal
      />
  )
}

export default Trending