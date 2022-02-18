import { Image, StyleSheet, Text, View } from 'react-native';
import React, {useState} from 'react';

import ProgressBar from '../appComponents/ProgressBar';
import ImagePickerBtn from '../appComponents/ImagePickerBtn';
import { AppButton } from '../generalComponents';
import colors from '../../config/colors';
import { useAppContext } from './../../config/Context';

const SendPictureModal = ({setOpenModal, chat}) => {

    
    const [file, setFile] = useState(null);
    const [image, setImage] = useState(null)
    const [extension, setExtension] = useState('');

    const { currentUser } = useAppContext();

    async function handleUpload(){
        const response = await fetch(image.uri)
        const blob = await response.blob();
        setFile(blob);
    }

    return (
        <View style={{justifyContent: 'flex-end', height: '100%', alignItems: 'center', backgroundColor: '#000000cc'}}>
            {image && <View>
                <Image source={{ uri: image.uri }} style={{ width: 150, height: 150, marginVertical: 20 }} />
            </View>}
            <View style={{width: '85%', alignItems: 'center'}}>
                {file && extension && <ProgressBar
                    path={'chat-messages'}
                    file={file}
                    extension={extension}
                    setFile={setFile}
                    setImage={setImage}
                    type={file.type}
                    userId={currentUser.id}
                    senderNumber={currentUser.phoneNumber}
                    receiverNumber={chat.users.filter(user => user != currentUser.phoneNumber).toString()}
                    chatId={chat.id}
                    setContent={setOpenModal}
                />}
            </View>
                <ImagePickerBtn
                    title={image ? 'Retake picture directly' : 'take a picture'}
                    image={image}
                    openCamera={true}
                    disabled={file}
                    setExtension={setExtension}
                    setImage={setImage}
                    // aspect={[4, 4]}
                    style={{backgroundColor: colors.accent}}
                    pickerType='Images'
                />
                <ImagePickerBtn
                    title={image ? 'Change Image from the gallery' : 'Pick an Image from gallery'}
                    image={image}
                    disabled={file}
                    setExtension={setExtension}
                    setImage={setImage}
                    // aspect={[4, 4]}
                    style={{backgroundColor: colors.accent}}
                    pickerType='Images'
                />
                {image && <AppButton
                    title='cancel'
                    disabled={file}
                    onPress={()=>setImage(null)}
                    style={{backgroundColor: colors.danger}}
                    textStyle={{color: 'white'}}
                />}
            {image && <AppButton
                title='Send'
                disabled={file}
                onPress={()=>handleUpload()}
                style={{backgroundColor: colors.secondary}}
                textStyle={{color: 'white'}}
            />}
            <AppButton  
                title={'Abort'}
                onPress={()=>setOpenModal(false)}
                style={{marginTop: 35}}
            />
        </View>
    );
};

export default SendPictureModal;

const styles = StyleSheet.create({});
