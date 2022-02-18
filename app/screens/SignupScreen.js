import { StyleSheet, Text, ScrollView, Dimensions, Modal, View } from 'react-native';
import React, { useState } from 'react';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import {Screen, AppButton, AppTextInput, Message, LoadingScreen} from '../components/generalComponents';
import colors from '../config/colors';
import { useAppContext } from './../config/Context';

const SignupScreen = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [username, setUsername] = useState('');
    const [show, setShow] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const { signUp } = useAppContext();
    const navigation = useNavigation();
    const { height } = Dimensions.get('screen')

    async function handleSubmit() {
        setErrMsg('')
        if(email.trim() === '' || password.trim() === '' || confirmPassword.trim() === '' || phoneNumber.trim() === ''){
            return setErrMsg('Please fill the required fields.')
        }
        if(password.trim() !== confirmPassword.trim()){
            return setErrMsg('Passwords don\'t match.')
        }
        if(password.trim().length < 6){
            return setErrMsg('password should be at least 6 characters long.')
        }
        setLoading(true);
        try{
            await signUp(email.trim(), password.trim(), phoneNumber.trim(), username.trim());
            // setLoading(false);
            // navigation.navigate('Navigator')
        }
        catch(err){
            if(err.message.includes('invalid-email')){
                setErrMsg('Invalid Email')
            }
            else if(err.message.includes('email-already-in-use')){
                setErrMsg('email already in use');
            }
            else if(err.message === 'username already exists'){
                setErrMsg('Username already exists.')
            }
            else if(err.message === 'phoneNumber already in use'){
                setErrMsg('phoneNumber already in use.')
            }
            else{
                console.error(err.message);
                setErrMsg('Can\'t sign up')
            }
            setLoading(false);
        }
    }

    return (
        <ScrollView style={{backgroundColor: 'black'}} contentContainerStyle={{flexGrow: 1}} >
            <Screen style={styles.screen}>
                {errMsg ? <Message bgColor={colors.danger} msg={errMsg} textStyle={{color: 'white'}} /> : null}
                <AppTextInput
                    placeholder='Email'
                    autoCapitalize='none'
                    maxLength={100}
                    keyboardType='email-address'
                    value={email}
                    onChangeText={(val)=>setEmail(val)}
                    inputStyle={{color: 'white'}}
                >
                    <MaterialIcons name="email" style={{paddingHorizontal: 10}} size={24} color={colors.primary} />
                </AppTextInput>
                <AppTextInput
                    placeholder='Username'
                    maxLength={100}
                    value={username}
                    onChangeText={(val)=>setUsername(val)}
                    inputStyle={{color: 'white'}}
                >
                    <Feather name="user" style={{paddingHorizontal: 10}} size={24} color={colors.primary} />
                </AppTextInput>
                <AppTextInput
                    placeholder='Phone Number'
                    maxLength={50}
                    keyboardType='phone-pad'
                    value={phoneNumber}
                    onChangeText={(val)=>setPhoneNumber(val)}
                    inputStyle={{color: 'white'}}
                    hint="Please don't include you country code."
                >
                    <MaterialIcons name="phone" style={{paddingHorizontal: 10}} size={24} color={colors.primary} />
                </AppTextInput>
                <AppTextInput
                    inputStyle={{color: 'white'}}
                    placeholder='Password'
                    autoCapitalize='none'
                    autoCorrect={false}
                    maxLength={50}
                    secure={true}
                    show={show}
                    setShow={setShow}
                    value={password}
                    onChangeText={(val)=>setPassword(val)}
                >
                    <MaterialIcons name="lock" style={{paddingHorizontal: 10}} size={24} color={colors.primary} />
                </AppTextInput>
                <AppTextInput
                    inputStyle={{color: 'white'}}
                    placeholder='Confirm Password'
                    autoCapitalize='none'
                    autoCorrect={false}
                    maxLength={50}
                    secure={true}
                    show={show}
                    setShow={setShow}
                    value={confirmPassword}
                    onChangeText={(val)=>setConfirmPassword(val)}
                >
                    <MaterialIcons name="lock" style={{paddingHorizontal: 10}} size={24} color={colors.primary} />
                </AppTextInput>
                <AppButton
                    title={'SignUp and LogIn'}
                    style={{marginTop: 30}}
                    onPress={handleSubmit}
                    disabled={loading}
                />
                <Modal
                    transparent
                    statusBarTranslucent
                    visible={loading}
                >
                    <View style={[StyleSheet.absoluteFillObject, {backgroundColor: '#000000cc'}]}>
                        <LoadingScreen transparent/>
                    </View>
                </Modal>
            </Screen>
        </ScrollView>
    );
};

export default SignupScreen;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        flexGrow: 1,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
