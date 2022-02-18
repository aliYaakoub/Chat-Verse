import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const AppText = ({style, children}) => {
  return (
    <Text style={[styles.text, style]}>{children}</Text>
  );
};

export default AppText;

const styles = StyleSheet.create({
    text: {
        fontSize: 18
    }
});
