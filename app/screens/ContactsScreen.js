import { Alert, FlatList, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as Contacts from 'expo-contacts';
import { useNavigation } from '@react-navigation/native';

import { AppButton, AppTextInput, Screen, Message } from '../components/generalComponents'
import ContactsListItem from '../components/appComponents/ContactsListItem';
import colors from '../config/colors';
import ListItemSeparator from './../components/generalComponents/ListItemSeparator';
import AppText from './../components/generalComponents/AppText';

const ContactsScreen = () => {

    const [contacts, setContacts] = useState([]);
    const [number, setNumber] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        (async () => {
            const { status } = await Contacts.requestPermissionsAsync();
            if (status === 'granted') {
                const { data } = await Contacts.getContactsAsync();
        
                if (data.length > 0) {
                    setContacts(data);
                }
            }
        })();
    }, []);

    function handleSelect(item) {
        navigation.navigate('Chat', {
            data: item,
            isNew: true
        })
    }

    return (
        <Screen style={styles.screen}>
            <View style={{alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
                <AppTextInput 
                    containerStyle={{width: '70%'}}
                    placeholder={'PhoneNumber ...'}
                    value={number}
                    onChangeText={(val)=>setNumber(val)}
                />
                <AppButton 
                    title={'Add'}
                    style={{width: '25%'}}
                    disabled={!number}
                    onPress={()=>{
                        let numberTemp = number;
                        setNumber('');
                        handleSelect(numberTemp)
                    }}
                />
            </View>
            <Message 
                containerStyle={{width: '100%', marginVertical: 25, paddingVertical: 10}}
                textStyle={{color: 'white'}}
                bgColor={colors.accent}
                msg='if a number does contain a country code please type it manually without it in the input above.'
            />
            {contacts.length > 0 ?
                <>
                    <FlatList
                        data={contacts}
                        keyExtractor={(item)=>item.id}
                        ItemSeparatorComponent={ListItemSeparator}
                        renderItem={({item})=>(
                            <ContactsListItem data={item} onPress={()=>handleSelect(item.phoneNumbers[0].number)} />
                        )}
                        />
                </>
                :
                <AppText style={{color: colors.accent}}>you have no contacts</AppText>
            }   
        </Screen>
    );
};

export default ContactsScreen;

const styles = StyleSheet.create({
    screen: {
        backgroundColor: colors.primary,
        flex: 1
    }
});
