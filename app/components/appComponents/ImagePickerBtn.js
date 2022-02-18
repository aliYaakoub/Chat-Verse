import React, { useEffect } from 'react'
import { StyleSheet, Alert, View, Platform } from 'react-native'
import * as ImagePicker from 'expo-image-picker';

import {AppButton} from '../generalComponents'
import colors from '../../config/colors';

const ImagePickerBtn = ({disabled, openCamera=false, style, title, setImage, setExtension, image, aspect=null, pickerType = 'All'}) => {


    useEffect(() => {
        (async () => {
          if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Sorry, we need camera roll permissions to make this work!');
            }
          }
        })();
    }, []);

    const pickImage = async () => {
        try{
          let result;
          if(openCamera){
            result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions[pickerType],
              allowsEditing: true,
              aspect: aspect ,
              quality: 1,
            });
          }
          else{
            result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions[pickerType],
              allowsEditing: true,
              aspect: aspect ,
              quality: 1,
            });
          }
          
          if (!result.cancelled) {
            setImage(result);
            setExtension(result.uri.split('.').pop())
          }
        }
        catch(err){
          console.error(err);
        }
    };

    return (
        <View style={[{ alignItems: 'center', justifyContent: 'center', width: '100%'}]}>
            <AppButton
                title={title}
                disabled={disabled}
                onPress={()=>pickImage()}
                style={[{backgroundColor: colors.secondary}, style]}
                textStyle={{color: 'white'}}
            />
        </View>
    )
}

export default ImagePickerBtn

const styles = StyleSheet.create({
})
