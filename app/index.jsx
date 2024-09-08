import { StatusBar } from "expo-status-bar";
import { Image, Text, View, ScrollView } from "react-native";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from '../constants';
import CustomButton from "../components/CustomButton";

import { useGlobalContext } from '../context/GlobalProvider'

export default function App() {
    const {isLoading, isLoggedIn } = useGlobalContext();

    if (!isLoading, isLoggedIn) return <Redirect href="/home"/>

    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView contentContainerStyle={{ height: '100%'}}>
                <View className="w-full justify-center items-center min-h-[85vh] px-4">
                    <Image 
                        source={images.bookify}
                        className="w-[130px] h-[84px]"
                        resizeMode="contain"
                    />

                    <Image 
                        source={images.cards2}
                        className="max-w-[380px] w-full h-[300px]"
                        resizeMode="contain"
                    />

                    <View className="relative mt-5">
                        <Text className="text-3xl text-white font-bold text-center">Discover Endless Books with{' '}
                            <Text className="text-secondary-200">Bookify</Text>
                        </Text>

                        <Image
                            source={images.path}
                            className="w-[180px] h-[15px] absolute -bottom-2 right-9"
                            resizeMode="contain"
                        />
                    </View>

                    <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">Fuel your imagination with Bookify. Explore a universe of stories, ideas, and endless possibilities.</Text>

                    <CustomButton 
                        title="Continue"
                        handlePress={() => router.push('/choose')}
                        containerStyles="w-full mt-7"
                    />
                </View>
            </ScrollView>

            <StatusBar backgroundColor="#161622" style="light" />
        </SafeAreaView>
    );
}
