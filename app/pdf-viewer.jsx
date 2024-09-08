import { View, Text, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRouter, useLocalSearchParams } from 'expo-router'; 

const PdfViewer = () => {
  const router = useRouter();
  const { ebook } = useLocalSearchParams();  // Fetch the PDF URL from parameters

  return (
    <View style={{ flex: 1 }}>
      {/* Back button (if you want a custom one, otherwise it uses the default one) */}
      <TouchableOpacity 
        onPress={() => router.back()}
        style={{ padding: 10, backgroundColor: 'gray' }}
      >
        <Text style={{ color: 'white' }}>Back</Text>
      </TouchableOpacity>

      {/* WebView to display PDF */}
      <WebView
        source={{ uri: ebook }}
        style={{ flex: 1 }}
        startInLoadingState={true}
        renderLoading={() => <Text>Loading PDF...</Text>}
      />
    </View>
  );
};

export default PdfViewer;
