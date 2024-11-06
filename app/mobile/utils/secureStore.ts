import * as SecureStore from 'expo-secure-store';


export const storeData = async <T>(token: string, data: T) => {
  try {
    // Ensure data is serializable
    const stringData = JSON.stringify(data);
    
    await SecureStore.setItemAsync(token, stringData);
  } catch (error) {
    console.error('Error while storing data:', error);
  }
};


// Retrieve the data
export const getData = async <T>(token: string): Promise<T> => {
  try {
    const data = await SecureStore.getItemAsync(token);
    if (data) {
      return JSON.parse(data) as T;
    }
    return {} as T;
  } catch (error) {
    console.error('Error while retrieving data:', error);
    return {} as T;
  }
};

// Delete the data
export const deleteData = async (token: string) => {
  try {
    await SecureStore.deleteItemAsync(token);
  } catch (error) {
    console.error('Error while deleting data:', error);
  }
};
