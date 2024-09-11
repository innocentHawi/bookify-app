import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as DocumentPicker from 'expo-document-picker'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { icons } from '../../constants'
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { createBook } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'


const Create = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    ebook: null,
    thumbnail: null,
    author: '',
    genre: '',
    synopsis: ''
  })

  const [pdfUploaded, setPdfUploaded] = useState(false);
  const openPicker = async (selectType) => {
    let typeOptions;
  
    // Set type based on selectType
    if (selectType === 'image') {
      typeOptions = ['image/png', 'image/jpg', 'image/jpeg'];
    } else if (selectType === 'pdf') {
      typeOptions = ['application/pdf']; // Allow only PDFs
    } else {
      typeOptions = ['*/*']; // Fallback to allow any file type if needed
    }
  
    // Open the document picker
    const result = await DocumentPicker.getDocumentAsync({
      type: typeOptions,
      copyToCacheDirectory: false,
    });
  
    // Check if the user canceled the document picker
    if (!result.canceled) {
      // Update the form based on selected type
      if (selectType === 'image') {
        setForm({
          ...form,
          thumbnail: result.assets[0], // Adjust based on your requirement
        });
      } else if (selectType === 'pdf') {
        setPdfUploaded(true); // Mark PDF as uploaded
        Alert.alert("Success", "PDF uploaded successfully!");
        setForm({
          ...form,
          ebook: result.assets[0],
        });
      }
    }
  };

  const submit = async () => {
    if(!form.title || !form.ebook || !form.thumbnail || !form.author || !form.genre || !form.synopsis) {
      return Alert.alert('Please fill in all the fields')
    }

    setUploading(true)

    try {
      await createBook({
        ...form, userId: user.$id
      })

      Alert.alert('Success', 'Post uploaded successfully')
      router.push('/home')
    } catch (error) {
      Alert.alert('Error', error.message)
    } finally {
      setForm({
        title: '',
        ebook: null,
        thumbnail: null,
        author: '',
        genre: '',
        synopsis: ''
      })

      setUploading(false);
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">
          Upload Book
        </Text>

        <FormField 
          title="Book Title"
          value={form.title}
          placeholder="Give your book a title..."
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-10"
        />

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Book
          </Text>
          <TouchableOpacity onPress={() => openPicker('pdf')}>
      <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
        {pdfUploaded ? (
          <Text className="text-sm text-green-500 font-pmedium">
            PDF Uploaded Successfully
          </Text>
        ) : (
          <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
            <Image source={icons.upload} resizeMode="contain" className="w-1/2 h-1/2" />
          </View>
        )}
      </View>
    </TouchableOpacity>
        </View>

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Thumbnail Image
          </Text>

          <TouchableOpacity onPress={() => openPicker('image')}>
            {form.thumbnail ? (
              <Image 
                source={{ uri: form.thumbnail.uri }}
                resizeMode='cover'
                className="w-full h-64 rounded-2xl"
              />
            ) : (
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2">
                  <Image source={icons.upload} resizeMode='contain' className="w-5 h-5" />
                  <Text className="text-sm text-gray-100 font-pmedium">
                    Choose a file
                  </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <FormField 
          title="Book Author"
          value={form.author}
          placeholder="Author of the book..."
          handleChangeText={(e) => setForm({ ...form, author: e })}
          otherStyles="mt-7"
        />
        <FormField 
          title="Book Genre"
          value={form.genre}
          placeholder="Genre of the book..."
          handleChangeText={(e) => setForm({ ...form, genre: e })}
          otherStyles="mt-7"
        />
        <FormField 
          title="Synopsis"
          value={form.synopsis}
          placeholder="Synopsis of the book..."
          handleChangeText={(e) => setForm({ ...form, synopsis: e })}
          otherStyles="mt-7"
        />

        <CustomButton 
          title="Submit & Publish"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Create