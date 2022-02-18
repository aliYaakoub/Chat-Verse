import { Modal, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AnimatedLottieView from 'lottie-react-native'

import {Screen, AppText, AppButton, AppTextInput, Message, LoadingScreen} from '../components/generalComponents';
import colors from '../config/colors';
import { useAppContext } from './../config/Context';

const LoginScreen = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const { signIn, currentUser } = useAppContext();
    const navigation = useNavigation();

    async function handleLogin() {
        setErrMsg('')
        if(email === '' || password === ''){
            return setErrMsg('Please fill the required fields.')
        }
        setLoading(true);
        try{
            await signIn(email, password);
            // setLoading(false);
            // navigation.navigate('Navigator')
        }
        catch(err){
            if(err.message.includes('invalid-email')){
                setErrMsg('Invalid Email')
            }
            else if(err.message.includes('user-not-found')){
                setErrMsg('Wrong Email or Password.')
            }
            else if(err.message.includes('wrong-password')){
                setErrMsg('Wrong Email or Password.')
            }
            else{
                console.error(err.message);
                setErrMsg('Can\'t log in')
            }
            setLoading(false);
        }
    }

    useEffect(()=>{
        if(currentUser){
            navigation.navigate('Navigator');
        }
    }, [currentUser])

    return (
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
            <AppButton
                title={'LogIn'}
                style={{marginTop: 30}}
                onPress={handleLogin}
                disabled={loading}
            />
            <AppText style={{fontSize: 20}}>
                <Text style={{color: colors.secondary}}>Don't have an account ? </Text>
                <Text
                    style={{color: colors.accent, marginHorizontal: 5}}
                    onPress={()=>navigation.navigate('Signup')}
                >
                    Sign up here
                </Text>
            </AppText>
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
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
