import FAB from '@/components/UI/fab';
import { StatusView, Feed } from '@/components/UI/home';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, StatusBar } from 'react-native';

export default function Home() {

  return (
    <ScrollView style={styles.container}>
      {/* <StatusView /> */}
      <Feed />
      <FAB Icon={Ionicons} name={'add'} size={30} color={Colors['dark'].text} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors['dark'].background,
    flex: 1,
    paddingTop: Number(StatusBar?.currentHeight) - 30,
  },
  text: {
    color: '#fff',
  },
});
