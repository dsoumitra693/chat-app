import * as SecureStore from 'expo-secure-store';

// Store the data
export const storeData = async <T>(token: string, data: T) => {
  try {
    await SecureStore.setItemAsync(token, JSON.stringify(data));
  } catch (error) {
    console.error('Error while storing data:', error);
  }
};

// Retrieve the data
export const getData = async <T>(token: string): Promise<T> => {
  try {
    const data = await SecureStore.getItemAsync('token');
    return JSON.parse(data!) as T;
  } catch (error) {
    console.error('Error while retrieving data:', error);
    return {} as T;
  }
};

// Retrieve the data
export const deleteData = async (token: string) => {
  try {
    await SecureStore.deleteItemAsync(token);
  } catch (error) {
    console.error('Error while deleting data:', error);
  }
};
