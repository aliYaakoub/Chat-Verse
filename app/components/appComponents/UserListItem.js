import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons'
import moment from 'moment';

import { AppText } from '../generalComponents';
import colors from '../../config/colors';
import { useAppContext } from '../../config/Context';

const UserListItem = ({data: item, onPress}) => {

    const [user, setUser] = useState(null);

    const { currentUser, getUserData, getChat } = useAppContext();

    useEffect(()=>{
        const getUser = async () => {
            const user = await getUserData(item.users.filter(item => item !== currentUser.phoneNumber))
            setUser(user);
        }
        getUser()
    }, [])

    return (
        <TouchableOpacity onPress={onPress}>
            <View style={{paddingHorizontal: 15, paddingVertical: 5, flexDirection: 'row', alignItems: 'center'}}>
                {user && user.attachment ?
                    <View style={styles.imgView}>
                        <Image style={{width: 50, height: 50, borderRadius: 25}} source={{uri: user.attachment.file}} />
                    </View>
                    :
                    <View style={styles.imgView}>
                        <FontAwesome name="user" size={30} color="white" />
                    </View>
                }
                <View style={{justifyContent: 'center'}}>
                    <AppText
                        style={{color: colors.accent}}
                    >
                        {user ?
                            user.username
                            :
                            item.users.filter(item => item !== currentUser.phoneNumber)
                        }
                    </AppText>
                </View>
                <AppText style={styles.date}>{moment(item.timeStamp.toDate()).startOf('minute').fromNow()}</AppText>
            </View>
        </TouchableOpacity>
    );
};

export default UserListItem;

const styles = StyleSheet.create({
    imgView: {
        width: 50, 
        height: 50, 
        backgroundColor: 'black', 
        borderRadius: 25,
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    date: {
        flex: 1,
        textAlign: 'right',
        color: colors.secondary,
        fontSize: 15
    }
});
