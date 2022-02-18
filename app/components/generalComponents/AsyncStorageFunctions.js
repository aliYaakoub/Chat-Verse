import { AsyncStorage } from '@react-native-async-storage/async-storage';

export const storeStringData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value)
    } 
    catch (err) {
        console.error(err.message);
    }
  }

export const storeData = async (key, value) => {  
    try {    
        const jsonValue = JSON.stringify(value)    
        await AsyncStorage.setItem(key, jsonValue)  
    } 
    catch (err) {    
        console.error(err.message);
    }
}


export const getStringData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key)
        if(value !== null) {
            return value
        }
        else return null;
    } 
    catch(err) {
      console.error(err.message);
    }
  }
  

export const getData = async (key) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key)
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(err) {
        console.error(err.message);
    }
}