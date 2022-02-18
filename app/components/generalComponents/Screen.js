import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Constants from 'expo-constants';

const Screen = ({children, style}) => {
  return (
    <View style={[styles.screen, style]}>
      {children}
    </View>
  );
};

export default Screen;

const styles = StyleSheet.create({
    screen: {
        paddingTop: Constants.statusBarHeight,
        paddingHorizontal: 10
    }
});
