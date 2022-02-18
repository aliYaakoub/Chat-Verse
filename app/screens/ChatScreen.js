import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, Alert, Dimensions, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons, MaterialCommunityIcons, Feather, FontAwesome } from '@expo/vector-icons';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView'

import colors from '../config/colors';
import { useAppContext } from '../config/Context';
import { AppText, AppTextInput, Screen } from '../components/generalComponents';
import ChatMessages from './../components/appComponents/ChatMessages';
import SendPictureModal from '../components/modals/SendPictureModal';

const { width, height } = Dimensions.get('screen');

const ChatScreen = ({route}) => {

    const [chat, setChat] = useState(null);
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState('');
    const [preview, setPreview] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const { currentUser, getChat, getUserData, sendMessage } = useAppContext();
    const navigation = useNavigation();

    useEffect(()=>{
        const getChatFunc = async () => {
            if(route.params.isNew){
                if(route.params.data){
                    const chatTest = await getChat(currentUser.phoneNumber, route.params.data);
                    setChat(chatTest)
                }
            }
            else{
                setChat(route.params.data)
            }
        }
        getChatFunc()
    }, [])

    useEffect(()=>{
        const getUser = async () => {
            if(chat){
                const tempUser = await getUserData(chat.users.filter(user => user != currentUser.phoneNumber))
                setUser(tempUser);
            }
        }
        getUser()
    }, [chat])  

    async function handleSend(){
        let currentMsg = message;
        setMessage('')
        if(message.trim() > 500){
            return Alert.alert('Message is too long.')
        }
        await sendMessage(chat.id, currentUser.phoneNumber, chat.users.filter(user => user != currentUser.phoneNumber).toString(), currentMsg.trim())
    }

    return (
        <Screen style={styles.screen} >
            <View style={styles.nav}>
                <Ionicons name="arrow-back" size={30} onPress={()=>navigation.goBack()} color='white' />
                {user && user.attachment ? 
                    <View style={styles.imgView}>
                        <TouchableOpacity onPress={()=>{
                            setPreview(user.attachment.file)
                            console.log(user.attachment.file, preview)
                        }}>
                            <Image style={{width: 50, height: 50, borderRadius: 25}} source={{uri: user.attachment.file}} />
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={styles.imgView}>
                        <FontAwesome name="user" size={30} color="white" />
                    </View>
                }
                <AppText style={styles.user}>
                    {chat && (user ? user.username : chat.users.filter(user => user != currentUser.phoneNumber))}
                </AppText>
            </View>
            {chat ? 
                <ChatMessages setOpenModal={setOpenModal} setPreview={setPreview} data={chat} />
                :
                <View style={{flex: 1}} />
            }
            <View style={styles.input}>
                <TouchableOpacity onPress={()=>setOpenModal(true)} style={{marginRight: 15}}>
                    <MaterialIcons name="perm-media" size={30} color={colors.accent} />
                </TouchableOpacity>
                <AppTextInput 
                    placeholder={'Message'} 
                    containerStyle={styles.inputContainer} 
                    value={message}
                    onChangeText={(val)=>setMessage(val)}
                    inputStyle={{color: 'white'}}
                />
                <TouchableOpacity style={{marginLeft: 15}} disabled={!message.trim()} onPress={handleSend} >
                    <MaterialCommunityIcons name={message.trim() ? 'send' : "send-lock"} size={30} color={colors.accent} />
                </TouchableOpacity>
            </View>
            <Modal
                visible={preview ? true : false}
                animationType='fade'
                onRequestClose={() => {
                    setPreview(false);
                }}
                transparent
                statusBarTranslucent
            >
                <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000cc', zIndex: 50, height: height}}>
                    <ReactNativeZoomableView
                        maxZoom={1.5}
                        minZoom={1}
                        zoomStep={0.5}
                        initialZoom={1}
                        bindToBorder={true}
                        captureEvent={true}
                    >
                        <Image source={{uri: preview}} style={{width: width, height: height, resizeMode: 'contain'}} />
                    </ReactNativeZoomableView>
                </View>
                <Feather onPress={()=>setPreview(null)} style={{position: 'absolute', top: 45, right: 10, zIndex: 50}} name='x' size={30} color={'white'} />
            </Modal>
            <Modal
                visible={openModal}
                animationType='slide'
                onRequestClose={() => {
                    setOpenModal(false);
                }}
                transparent
                statusBarTranslucent
            >
                <SendPictureModal setOpenModal={setOpenModal} chat={chat} />
            </Modal>
        </Screen>
    );
};

export default ChatScreen;

const styles = StyleSheet.create({
    screen: {
        backgroundColor: colors.primary,
        flex: 1,
        paddingHorizontal: 0
    },
    nav: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 15,
        marginVertical: 10
    },
    user: {
        color: 'white',
    },
    input: {
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    inputContainer: {
        flex: 1
    },
    imgView: {
        width: 50, 
        height: 50, 
        backgroundColor: 'black', 
        borderRadius: 25,
        marginHorizontal: 15,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
