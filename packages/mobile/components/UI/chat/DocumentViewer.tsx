import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
  Linking,
  StyleSheet,
  Platform,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { calcSize } from '@/utils/file';
import { formateFileName } from '@/utils/text';

const DocumentViewer = ({ url }: { url: string }) => {
  const [loading, setLoading] = useState(false);
  const [fileSize, setFileSize] = useState<string>('');
  const fileName = url.split('/').pop();

  const getFileSize = async () => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const contentLength = response.headers.get('Content-Length');
      if (contentLength) {
        setFileSize(calcSize(parseInt(contentLength)));
      } else {
        setFileSize('Unknown');
      }
    } catch (error) {
      Alert.alert('Error', 'Error fetching file size:');
      setFileSize('Unknown');
    }
  };

  useEffect(() => {
    getFileSize();
  }, []);

  const downloadAndOpenDocument = async () => {
    try {
      setLoading(true);
      const localUri = `${FileSystem.documentDirectory}${fileName}`;
      const { uri } = await FileSystem.downloadAsync(url, localUri);
      setLoading(false);

      if (Platform.OS === 'android') {
        const contentUri = await FileSystem.getContentUriAsync(uri);
        IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: contentUri,
          flags: 1,
        });
      } else {
        const supported = await Linking.canOpenURL(uri);
        if (supported) {
          await Linking.openURL(uri);
        } else {
          Alert.alert('Error', 'No application found to open this file.');
        }
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to download or open the document.');
    }
  };

  return (
    <TouchableOpacity onPress={downloadAndOpenDocument} style={styles.card}>
      <View style={styles.document}>
        {loading ? (
          <ActivityIndicator size="small" color={Colors['dark'].text} />
        ) : (
          <Ionicons
            name="document-outline"
            size={24}
            color={Colors['dark'].text}
          />
        )}
        <Text style={styles.documentTitle}>
          {formateFileName(fileName as string)}
        </Text>
        <Text style={styles.fileSize}>{fileSize}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default DocumentViewer;
const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  document: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  documentTitle: {
    marginLeft: 10,
    fontSize: 16,
    color: Colors['dark'].text,
    fontWeight: '400',
  },
  icon: {
    marginRight: 10,
  },
  fileSize: {
    fontSize: 14,
    padding: 10,
    color: Colors['dark'].text,
  },
});
