import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Colors } from '@/constants/Colors';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useSession } from '@/provides';
import { Redirect, useRouter } from 'expo-router';

const ProfileDetails = () => {
  const { signOut } = useSession();
  const router = useRouter()
  const handleLogout = async () => {
    await signOut();
    router.replace("/");
    
  };

  return (
    <View style={styles.container}>
      <View style={styles.detail}>
        <Ionicons name="person-outline" style={styles.icon2} />
        <View style={styles.textWrapper}>
          <Text style={styles.textPrimary}>Soumo Das</Text>
          <Text style={styles.textSecondary}>Name</Text>
        </View>
      </View>
      <View style={{ ...styles.detail, borderBottomWidth: 0 }}>
        <Feather name="phone" style={styles.icon2} />
        <View style={styles.textWrapper}>
          <Text style={styles.textPrimary}>+917478XXXXX8</Text>
          <Text style={styles.textSecondary}>Phone</Text>
        </View>
      </View>
      <TouchableOpacity onPress={handleLogout}>
        <View style={{ ...styles.detail, borderBottomWidth: 0 }}>
          <Feather name="log-out" style={styles.icon2} />
          <View style={styles.textWrapper}>
            <Text style={styles.textPrimary}>Logout</Text>
            <Text style={styles.textSecondary}>
              You will be logouted from this device only.
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.iconWrapper}>
        <Feather name="edit-3" style={styles.icon} />
      </View>
    </View>
  );
};

export default ProfileDetails;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: Colors['dark'].secondary,
    marginHorizontal: 25,
    borderRadius: 20,
    top: '-6%',
  },
  textPrimary: {
    fontSize: 16,
    color: Colors['dark'].text,
  },
  textSecondary: {
    fontSize: 14,
    color: Colors['dark'].text2,
  },
  detail: {
    borderBottomColor: Colors['dark'].background,
    borderBottomWidth: 1,
    padding: 10,
    alignItems: 'center',
    paddingHorizontal: 30,
    flexDirection: 'row',
  },
  iconWrapper: {
    position: 'absolute',
    alignSelf: 'flex-end',
    right: 20,
    padding: 15,
    borderRadius: 30,
    backgroundColor: `${Colors['dark'].tint}aa`,
  },
  icon: {
    fontSize: 22,
    color: Colors['dark'].icon,
    position: 'relative',
  },
  icon2: {
    fontSize: 24,
    color: Colors['dark'].tint,
    position: 'relative',
  },
  textWrapper: {
    paddingLeft: 20,
  },
});
