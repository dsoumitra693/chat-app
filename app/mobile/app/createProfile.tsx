import { Colors } from '@/constants/Colors';
import { useSession } from '@/provides';
import { Redirect } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

export default function SignIn() {
  const { user, createUserProfile } = useSession();

  const [fullname, setFullname] = useState('');
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState('');

  const handleCreateProfile = () => {
    createUserProfile(fullname, bio, profilePic);
  };

  if (user) return <Redirect href="/" />;
  return (
    <KeyboardAvoidingView style={styles.conatainer} behavior="height">
      <TextInput
        placeholder="Fullname"
        style={styles.input}
        placeholderTextColor={Colors['dark'].text2}
        value={fullname}
        onChangeText={setFullname}
      />
      <TextInput
        placeholder="Bio"
        style={styles.input}
        placeholderTextColor={Colors['dark'].text2}
        value={bio}
        onChangeText={setBio}
      />
      <TouchableOpacity style={styles.btn} onPress={handleCreateProfile}>
        <Text style={styles.text}>Create your profile</Text>
      </TouchableOpacity>
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
