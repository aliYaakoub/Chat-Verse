import { Image, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import React from 'react';
import moment from 'moment';

import { useAppContext } from './../../config/Context';
import colors from '../../config/colors';
import AppText from './../generalComponents/AppText';

const Message = ({data, deleteMessageReq, setPreview}) => {

    const { currentUser } = useAppContext();

    function handleLongPress(){
    //     if(data.senderNumber === currentUser.phoneNumber){
    //         if(data.attachment){
    //             deleteMessageReq(data.id, data.attachment.fileName)
    //         }
    //         else{
    //             deleteMessageReq(data.id, null)
    //         }
    //     }
    }

    function handlePress(){
        data.attachment ? setPreview(data.attachment.file) : null;
    }

    return (
        <View style={data.senderNumber === currentUser.phoneNumber ? styles.homeContainer : styles.container}>
                {data.message ? 
                    <View>
                        {data.senderNumber === currentUser.phoneNumber ?
                            <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                                <Text style={{paddingRight: 5, color: 'white', fontSize: 12}}>{moment(data.timeStamp.toDate()).format('LT')}</Text>
                                <TouchableOpacity style={data.senderNumber === currentUser.phoneNumber ? styles.homeText : styles.text} onPress={handlePress} onLongPress={handleLongPress}>
                                    <Text style={{color: 'white', fontSize: 15}} ellipsizeMode='clip' >{data.message}</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                                <TouchableOpacity style={data.senderNumber === currentUser.phoneNumber ? styles.homeText : styles.text} onPress={handlePress} onLongPress={handleLongPress}>
                                    <Text style={{color: 'white', fontSize: 15}} ellipsizeMode='clip' >{data.message}</Text>
                                </TouchableOpacity>
                                <Text style={{paddingLeft: 5, color: 'white', fontSize: 12}}>{moment(data.timeStamp.toDate()).format('LT')}</Text>
                            </View>
                        }
                    </View>
                    :
                        <>
                            {data.attachment &&
                                data.senderNumber === currentUser.phoneNumber ?
                                    <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                                        <Text style={{paddingHorizontal: 5, color: 'white', fontSize: 12}}>{moment(data.timeStamp.toDate()).format('LT')}</Text>
                                        <View >
                                            <TouchableHighlight activeOpacity={0.5} underlayColor={data.senderNumber === currentUser.phoneNumber ? colors.accent : colors.secondary} style={data.senderNumber === currentUser.phoneNumber ? styles.homeImage : styles.image} onPress={handlePress} onLongPress={handleLongPress}>
                                                <Image source={{uri: data.attachment.file}} style={{width: 200, height: 200, borderRadius: 5, zIndex: 20}} />
                                            </TouchableHighlight>
                                            <View style={{zIndex: -1, position: 'absolute', width: '100%', height: '100%', left: 0, top: 0, alignItems: 'center', justifyContent: 'center'}}>
                                                <Text  ellipsizeMode='clip' style={{color: 'white'}}>Loading Image</Text>
                                            </View>
                                        </View>
                                    </View>
                                    :
                                    <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                                        <View >
                                            <TouchableHighlight activeOpacity={0.5} underlayColor={data.senderNumber === currentUser.phoneNumber ? colors.accent : colors.secondary} style={data.senderNumber === currentUser.phoneNumber ? styles.homeImage : styles.image} onPress={handlePress} onLongPress={handleLongPress}>
                                                <Image source={{uri: data.attachment.file}} style={{width: 200, height: 200, borderRadius: 5, zIndex: 20}} />
                                            </TouchableHighlight>
                                            <View style={{zIndex: -1, position: 'absolute', width: '100%', height: '100%', left: 0, top: 0, alignItems: 'center', justifyContent: 'center'}}>
                                                <Text  ellipsizeMode='clip' style={{color: 'white'}}>Loading Image</Text>
                                            </View>
                                        </View>
                                        <Text style={{paddingHorizontal: 5, color: 'white', fontSize: 12}}>{moment(data.timeStamp.toDate()).format('LT')}</Text>
                                    </View>
                            }
                        </>
                }
            </View>
    );
};

export default Message;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingBottom: 10,
    },
    homeContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingBottom: 10,
    },
    text: {
        backgroundColor: colors.secondary,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 5,
        maxWidth: '88%',
    },
    homeText: {
        backgroundColor: colors.accent,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 5,
        maxWidth: '88%',
    },
    image: {
        padding: 5,
        backgroundColor: colors.secondary,
        borderRadius: 5,
        position: 'relative'
    },
    homeImage: {
        padding: 5,
        backgroundColor: colors.accent,
        borderRadius: 5,
        position: 'relative'
    }
});
