import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { COLOR, LoadFont } from './utils/Theme';
import { Navigation } from './navigation';
import { BottomNavbar, Header, Home } from './components';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {

  let isFontLoaded = LoadFont()
  if (isFontLoaded) return (
    <>
      <StatusBar style='inverted' backgroundColor={COLOR.baseBlack} />
      <SafeAreaView style={styles.container}>
        {/* <Navigation /> */}
        <Header />
        <Home />
        <BottomNavbar />
      </SafeAreaView>
    </>
  );

  return <></>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
