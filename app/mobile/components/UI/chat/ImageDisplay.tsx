import {
  Image,
  Modal,
  StyleSheet,
  View,
  BackHandler,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';

const MAX_ZOOM = 2;
const MIN_ZOOM = 1;

export const ImageDisplay = ({ url }: { url: string }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  const toggleFullScreen = () => {
    setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    Image.getSize(url, (width, height) => {
      const screenWidth = Dimensions.get('window').width;
      const screenHeight = Dimensions.get('window').height;

      const aspectRatio = width / height;
      let adjustedWidth = screenWidth;
      let adjustedHeight = screenHeight;

      if (width > height) {
        adjustedHeight = screenWidth / aspectRatio;
      } else {
        adjustedWidth = screenHeight * aspectRatio;
      }

      setImageDimensions({
        width: adjustedWidth,
        height: adjustedHeight,
      });
    });
  }, [url]);

  useEffect(() => {
    const onBackPress = () => {
      if (isFullScreen) {
        setIsFullScreen(false);
        return true;
      }
      return false;
    };

    if (isFullScreen) {
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
    }

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, [isFullScreen]);

  return (
    <>
      <TouchableWithoutFeedback onPress={toggleFullScreen}>
        <Image source={{ uri: url }} style={styles.image} />
      </TouchableWithoutFeedback>
      <Modal
        visible={isFullScreen}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleFullScreen}
      >
        <View style={styles.fullScreenContainer}>
          {imageDimensions.width > 0 && (
            <ReactNativeZoomableView
              maxZoom={MAX_ZOOM}
              minZoom={MIN_ZOOM}
              zoomStep={MIN_ZOOM / 2}
              initialZoom={1}
              bindToBorders={true}
              contentWidth={imageDimensions.width}
              contentHeight={imageDimensions.height}
              style={styles.zoomableView}
            >
              <Image
                source={{ uri: url }}
                style={{
                  width: imageDimensions.width,
                  height: imageDimensions.height,
                }}
                resizeMode="contain"
              />
            </ReactNativeZoomableView>
          )}
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 300,
    height: 300,
    resizeMode: 'cover',
    marginBottom: 5,
    borderRadius: 15,
  },
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  zoomableView: {
    width: '100%',
    height: '100%',
  },
});
