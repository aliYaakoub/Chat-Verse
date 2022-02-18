import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

import colors from '../../config/colors';
import AppText from './AppText';

const Message = ({bgColor, containerStyle, textStyle, msg}) => {
  return (
    <View style={[styles.container, containerStyle, {backgroundColor: bgColor}]}>
      <AppText style={[textStyle, {textAlign: 'center'}]}>{msg}</AppText>
    </View>
  );
};

export default Message;

const styles = StyleSheet.create({
    container: {
        width: '85%',
        minHeight: 50,
        borderRadius: 5,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: 10,
        elevation: 10
    },
});
