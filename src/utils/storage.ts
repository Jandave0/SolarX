import * as SecureStore from 'expo-secure-store';

export const saveSecureItem = async (key: string, value: string) => {
  try {
    await SecureStore.setItemAsync(key, value);
    return true;
  } catch (error) {
    console.error('SecureStore Save Error:', error);
    return false;
  }
};

export const getSecureItem = async (key: string) => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error('SecureStore Get Error:', error);
    return null;
  }
};

export const deleteSecureItem = async (key: string) => {
  try {
    await SecureStore.deleteItemAsync(key);
    return true;
  } catch (error) {
    console.error('SecureStore Delete Error:', error);
    return false;
  }
};
