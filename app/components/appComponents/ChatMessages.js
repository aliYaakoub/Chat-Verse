import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, ScrollView, View, Alert } from 'react-native';
import {
    wrapScrollView,
    useScrollIntoView,
} from 'react-native-scroll-into-view';

import Message from './Message';
import useMessages from './../../hooks/useMessages';
import { useAppContext } from './../../config/Context';

const CustomScrollView = wrapScrollView(ScrollView);

const ChatMessages = ({data, setPreview, setOpenModal}) => {

    return (
        <CustomScrollView style={styles.container}>
            <InnerView data={data} setPreview={setPreview} setOpenModal={setOpenModal} />
        </CustomScrollView>
    );
};

export default ChatMessages;

const InnerView = ({data, setPreview, setOpenModal}) => {

    const [chat, setChat] = useState(null);
    const lastEl = useRef();
    
    const { deleteMessage } = useAppContext();
    const { docs, loading } = useMessages(data.id)
    
    const scrollIntoView = useScrollIntoView();

    useEffect(()=>{
        if(docs){
            setChat(docs.sort((a,b)=>a.timeStamp - b.timeStamp))
            setTimeout(()=>{
                scrollIntoView(lastEl.current)
            }, 100)
        }
    }, [docs])

    async function deleteMessageReq(id, fileName){
        Alert.alert(
            'Confirmation', 
            'Do you want to delete this message', 
            [
                {
                    text: 'Confirm',
                    onPress: async () => {
                        try{
                            await deleteMessage(id, fileName)
                        }
                        catch(err){
                            Alert.alert('failed to delete', 'Could not delete the message, please try again later')
                        }
                    },
                    style: 'destructive'
                },
                {
                    text: 'cancel',
                    style: 'cancel',
                    cancelable: true,
                }
            ]
        )
    }

    return (
        <>
            {!loading && chat && chat.map(item => (
                    <Message setOpenModal={setOpenModal} setPreview={setPreview} deleteMessageReq={deleteMessageReq} data={item} key={item.id} />
                ))
            }
            <View ref={lastEl} style={{borderWidth: 1, transform: [{translateY: 50}]}} />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 5
    }
});
