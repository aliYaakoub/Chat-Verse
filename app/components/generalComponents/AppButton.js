import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';

import AppText from './AppText';
import colors from '../../config/colors';

const AppButton = ({onPress, style, textStyle, title, disabled}) => {
  return (
    <TouchableOpacity disabled={disabled} onPress={onPress} style={[styles.button, style]}>
      <AppText style={[textStyle, styles.text]}>{title}</AppText>
    </TouchableOpacity>
  );
};

export default AppButton;

const styles = StyleSheet.create({
    button: {
        height: 50,
        marginVertical: 10,
        borderRadius: 5,
        backgroundColor: colors.accent,
        width: '85%',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10
    },
    text: {
        color: 'white'
    }
});
