import { Colors } from '@/constants/Colors';
import { useSession } from '@/provides';
import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SignIn() {
  const router = useRouter();
  const { session, signUp } = useSession();
  const goToSignIp = () => {
    router.push('/signin');
  };
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSignup = () => {
    signUp(phone, password, name);
  };
  if (session) return <Redirect href="/" />;
  return (
    <KeyboardAvoidingView style={styles.conatainer} behavior="height">
      <TextInput
        placeholder="Name"
        style={styles.input}
        autoComplete="name"
        placeholderTextColor={Colors['dark'].text2}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Phone number"
        inputMode="numeric"
        dataDetectorTypes={'phoneNumber'}
        autoComplete="cc-number"
        style={styles.input}
        placeholderTextColor={Colors['dark'].text2}
        keyboardType="number-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        secureTextEntry
        placeholder="Password"
        style={styles.input}
        autoComplete="password"
        placeholderTextColor={Colors['dark'].text2}
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.btn} onPress={handleSignup}>
        <Text style={styles.text}>Sign Up</Text>
      </TouchableOpacity>
      <View style={styles.center}>
        <Text style={styles.text}>Already have an account? </Text>
        <TouchableOpacity style={styles.center} onPress={goToSignIp}>
          <Text style={{ ...styles.text, color: Colors['dark'].tint }}>
            Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  conatainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors['dark'].background,
  },
  input: {
    width: '80%',
    color: Colors['dark'].text,
    padding: 15,
    fontSize: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors['dark'].text2,
    margin: 5,
  },
  btn: {
    width: '80%',
    backgroundColor: Colors['dark'].tint,
    padding: 15,
    borderRadius: 10,
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: Colors['dark'].text,
    fontSize: 16,
    fontWeight: '500',
  },
});
