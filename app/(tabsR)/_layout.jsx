import { View, Text, Image } from 'react-native'
import { Tabs, Redirect } from 'expo-router'

import { icons } from '../../constants';

const TabIcon = ({ icon, color, name, focused}) => {
  return (
    //<View className="items-center justify-center gap">
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Image 
        source={icon}
        resizeMode='contain'
        tintColor={color}
        style={{
          width: 24, // Ensure consistent icon size
          height: 24,
          tintColor: color,
        }}
      />
      <Text
        style={{
          color: color,
          fontSize: 11, // Smaller font size
          marginTop: 4, // Add a small gap between the icon and text
          fontFamily: focused ? 'font-psemibold' : 'font-pregular', // Apply dynamic font
        }}
        //numberOfLines={1} // Prevent wrapping
      >
        {name}
      </Text>
    </View>
  )
}

const TabsLayout = () => {
  return (
    <>
     <Tabs
      screenOptions={{
      tabBarShowLabel: false,
      tabBarActiveTintColor: '#FFA001',
      tabBarInactiveTintColor: '#CDCDE0',
      tabBarStyle: {
        backgroundColor: '#161622',
        borderTopWidth: 1,
        borderTopColor: '#232533',
        height: 84, 
        },
      }}
    >
        <Tabs.Screen
          name='homeR'
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon 
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen
          name='library'
          options={{
            title: 'Library',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon 
                icon={icons.bookmark}
                color={color}
                name="Library"
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen
          name='subscribe'
          options={{
            title: 'Subscribe',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon 
                icon={icons.premium}
                color={color}
                name="Subscribe"
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen
          name='profileR'
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon 
                icon={icons.profile}
                color={color}
                name="Profile"
                focused={focused}
              />
            )
          }}
        />
      </Tabs>
    </>
  )
}

export default TabsLayout