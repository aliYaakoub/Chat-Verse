import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import {Screen, ListItemSeparator, LoadingScreen} from '../components/generalComponents'
import colors from '../config/colors';
import { useAppContext } from '../config/Context'
import UserListItem from '../components/appComponents/UserListItem';
import useFirestore from './../hooks/useFirestore';

const HomeScreen = () => {
    
    const navigation = useNavigation();
    const { currentUser } = useAppContext();
    const { docs: chats, loading } = useFirestore('chat', 'users', 'array-contains', currentUser.phoneNumber);

    function handleSelect(item){
        navigation.navigate('Chat', {
            data: item,
            isNew: false
        })
    }

    return (
        <Screen style={styles.screen}>
            {loading ? 
                <LoadingScreen />
                :
                <>
                    <FlatList 
                        data={chats.sort((a, b)=>b.timeStamp - a.timeStamp)}
                        keyExtractor={item => item.id}
                        style={{width: '100%'}}
                        renderItem={({item})=>(
                            <UserListItem data={item} onPress={()=>handleSelect(item)} />
                        )}
                    />
                </>
                }
        </Screen>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    screen: {
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: colors.primary
    }
});
