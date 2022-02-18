import React, { useEffect } from 'react'
import { Alert, View } from 'react-native';

import useStorage from '../../hooks/useStorage';
import { useAppContext } from '../../config/Context';
import colors from '../../config/colors';

const ProgressBar = ({file, setImage, extension, setFile, path, senderNumber, receiverNumber, chatId, userId = false, setContent = false, content=false, type=false}) => {

    const { url, progress } = useStorage(file, extension, path, senderNumber, receiverNumber, chatId, content, type, userId);
    console.log(progress, url);
    const { setChanges } = useAppContext()
    
    useEffect(()=>{
        if(url){
            setFile(null);
            if(path === 'chat-messages'){
                // Alert.alert('post uploaded successfully');
            }
            else{
                Alert.alert('Alert', 'picture uploaded');
                setChanges(old => old + 1);
            }
            setImage(null)
            if(setContent){
                setContent('')
            }
        }
    },[url, setFile])

    return (
        <View style={[{paddingVertical: 15}, {width: '100%', borderRadius: 10}]}>
            <View
                style={{width: `${progress}%`, height: 5, backgroundColor: colors.accent }}
            />
        </View>
    )
}

export default ProgressBar
