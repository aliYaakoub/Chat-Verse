import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';

import { AppText } from '../generalComponents';
import colors from '../../config/colors';

const ContactsListItem = ({data: item, onPress}) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={{paddingHorizontal: 15, paddingVertical: 5}}>
                <AppText 
                    style={{color: 'white'}}
                >
                    {item.name}
                </AppText>
                <AppText 
                    style={{color: colors.accent}}
                >
                    {item.phoneNumbers && item.phoneNumbers[0].number.replace(/ /g, "")}
                </AppText>
            </View>
        </TouchableOpacity>
    );
};

export default ContactsListItem;

const styles = StyleSheet.create({});
