import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'

const Choose = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Choose Your Role</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/sign-up')}
      >
        <Text style={styles.buttonText}>Publisher</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push( '/sign-upR' )}
      >
        <Text style={styles.buttonText}>Reader</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#161622', // Dark background for contrast
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#FF9C01', // Blue color for buttons
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
    width: '80%', // Make buttons enough to be prominent
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#161622',
    fontWeight: '600',
  },
});

export default Choose