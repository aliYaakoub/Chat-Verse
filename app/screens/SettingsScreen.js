import { ScrollView, StyleSheet, Image, View, Alert } from 'react-native';
import React, { useState } from 'react';
import { Feather } from '@expo/vector-icons'

import { AppButton, AppText, AppTextInput, Message } from '../components/generalComponents';
import { useAppContext } from './../config/Context';
import { useNavigation } from '@react-navigation/native';
import colors from '../config/colors';
import ImagePickerBtn from '../components/appComponents/ImagePickerBtn';
import ProgressBar from '../components/appComponents/ProgressBar'

const SettingsScreen = () => {


    const [file, setFile] = useState(null);
    const [image, setImage] = useState(null)
    const [extension, setExtension] = useState('');
    const [loading, setLoading] = useState(false);

    const [newUsername, setNewUsername] = useState('');
    const [newPhoneNumber, setNewPhoneNumber] = useState('');
    const [usernameInfo, setUsernameInfo] = useState(null);
    const [phoneInfo, setPhoneInfo] = useState(null);

    const { logout, currentUser, changeUsername, changePhoneNumber, setChanges } = useAppContext();
    const navigation = useNavigation();

    async function handleLogout(){
        await logout();
        navigation.navigate('Login');
    }

    async function handleUpload(){
        const response = await fetch(image.uri)
        const blob = await response.blob();
        setFile(blob);
    }

    async function handleUsernameChange(){
        setUsernameInfo(null);
        if(newUsername.trim() === ''){
            return setUsernameInfo({
                msg: 'Username should not be empty.',
                bg: colors.danger
            })
        }
        else if(newUsername.trim().length > 20){
            return setUsernameInfo({
                msg: 'Username is too long',
                bg: colors.danger
            })
        }
        else if(newUsername.trim().length < 5){
            return setUsernameInfo({
                msg: 'Username is too short, must be at least 5 characters long',
                bg: colors.danger
            })
        }
        setLoading(true);
        try{
            await changeUsername(currentUser.id, newUsername.trim());
            setNewUsername('');
            setChanges(old => old + 1);
            setUsernameInfo({
                msg: 'Username changed successfully',
                bg: colors.success
            })
            setTimeout(()=>{
                setUsernameInfo(null)
            }, 3000)
        }
        catch(err){
            return setUsernameInfo({
                msg: 'an error occured, please try again later',
                bg: colors.danger
            })
        }
        setLoading(false);
    }

    async function handlePhoneNumberChange(){
        setPhoneInfo(null);
        if(newPhoneNumber.trim() === ''){
            return setPhoneInfo({
                msg: 'PhoneNumber should not be empty.',
                bg: colors.danger
            })
        }
        else if(newPhoneNumber.trim().length > 30){
            return setPhoneInfo({
                msg: 'PhoneNumber is too long.',
                bg: colors.danger
            })
        }
        setLoading(true);
        try{
            await changePhoneNumber(currentUser.id, newPhoneNumber.trim());
            setNewPhoneNumber('');
            setChanges(old => old + 1);
            setPhoneInfo({
                msg: 'PhoneNumber changed successfully',
                bg: colors.success
            })
            setTimeout(()=>{
                setPhoneInfo(null)
            }, 3000)
        }
        catch(err){
            return setPhoneInfo({
                msg: 'an error occured, please try again later',
                bg: colors.danger
            })
        }
        setLoading(false);
    }

    return (
        <ScrollView style={styles.fullscreen}>
            {currentUser && currentUser.attachment ? 
                <View>
                    <Image style={{width: '100%', height: 350}} source={{uri: currentUser.attachment.file}} />
                </View>
                : 
                <View style={{backgroundColor: 'black', height: 350, justifyContent: 'center', alignItems: 'center'}}>
                    <AppText style={{color: 'white'}}>You dont have a profile picture</AppText>
                </View>
            }
            <View style={styles.screen}>
                <AppText style={styles.username}>{currentUser.username}</AppText>
                <View style={styles.view}>
                    <AppText style={{color: 'white'}}>Change your username</AppText>
                    {usernameInfo && <Message bgColor={usernameInfo.bg} textStyle={{color: 'white'}} msg={usernameInfo.msg} />}
                    <AppTextInput
                        placeholder='New Username ...'
                        value={newUsername}
                        containerStyle={usernameInfo && {borderWidth: 1, borderColor: usernameInfo.bg}}
                        onChangeText={(val)=>setNewUsername(val)}
                        inputStyle={{color: 'white'}}
                    >
                        <Feather name="user" style={{paddingHorizontal: 10}} size={24} color={colors.primary} />
                    </AppTextInput>
                    <AppButton
                        title='Change username'
                        disabled={loading}
                        onPress={handleUsernameChange}
                    />
                </View>
                <View style={styles.view}>
                    <AppText style={{color: 'white'}}>Change your phoneNumber</AppText>
                    {phoneInfo && <Message bgColor={phoneInfo.bg} textStyle={{color: 'white'}} msg={phoneInfo.msg} />}
                    <AppTextInput
                        placeholder='New PhoneNumber ...'
                        value={newPhoneNumber}
                        onChangeText={(val)=>setNewPhoneNumber(val)}
                        containerStyle={phoneInfo && {borderWidth: 1, borderColor: phoneInfo.bg}}
                        inputStyle={{color: 'white'}}
                        hint="please don't include your country code"
                    >
                        <Feather name='phone' style={{paddingHorizontal: 10}} size={24} color={colors.primary}  />
                    </AppTextInput>
                    <AppButton
                        title='Change phoneNumber'
                        disabled={loading}
                        onPress={handlePhoneNumberChange}
                    />
                </View>
                <View style={styles.view}>
                    <AppText style={{color: 'white'}}>{currentUser && currentUser.attachment ? 'Change your profile picture' : 'choose a profile picture'}</AppText>
                    {image && <View>
                        <Image source={{ uri: image.uri }} style={{ width: 150, height: 150, marginVertical: 20 }} />
                    </View>}
                    <View style={{width: '85%', alignItems: 'center'}}>
                        {file && extension && <ProgressBar
                            path={'profile-pictures'}
                            file={file}
                            extension={extension}
                            setFile={setFile}
                            setImage={setImage}
                            posterId={currentUser.id}
                            type={file.type}
                            userId={currentUser.id}
                        />}
                    </View>
                        <ImagePickerBtn
                            title={image ? 'Change Picture' : 'Pick a profile picture'}
                            image={image}
                            disabled={file}
                            setExtension={setExtension}
                            setImage={setImage}
                            aspect={[4, 4]}
                            pickerType='Images'
                            style={{backgroundColor: colors.accent}}
                        />
                        {image && <AppButton
                            title='cancel'
                            disabled={file}
                            onPress={()=>setImage(null)}
                            style={{backgroundColor: colors.danger}}
                            textStyle={{color: 'white'}}
                        />}
                    {image && <AppButton
                        title='Upload Picture'
                        disabled={file}
                        onPress={()=>handleUpload()}
                        style={{backgroundColor: colors.secondary}}
                        textStyle={{color: 'white'}}
                    />}
                </View>
                <AppButton style={{backgroundColor: colors.danger, marginVertical: 15}} title={'logout'} onPress={handleLogout} />
            </View>
        </ScrollView>
    );
};

export default SettingsScreen;

const styles = StyleSheet.create({
    fullscreen: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    screen: {
        backgroundColor: colors.primary,
        flex: 1,
        padding: 15,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        transform: [
            {
                translateY: -35
            }
        ], 
        alignItems: 'center',
    },
    view: {
        paddingVertical: 15,
        width: '100%',
        alignItems: 'center'
    },
    username: {
        fontSize: 25,
        color: 'white',
        padding: 10,
        borderRadius: 15,
        textAlign: 'center'
    },
});
