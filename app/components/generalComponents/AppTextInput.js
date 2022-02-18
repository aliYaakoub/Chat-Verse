import React from 'react';
import { StyleSheet, TouchableOpacity, TextInput, View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

import colors from '../../config/colors';

const AppTextInput = ({children, hint = '', setShow, show, secure=false, containerStyle, inputStyle, ...otherProps}) => {


    if(secure){
        return (
            <View style={styles.outerContainer}>
                <View style={[styles.container, containerStyle]}>
                    <TextInput
                        style={[styles.input, inputStyle]}
                        placeholderTextColor={colors.primary}
                        secureTextEntry={!show}
                        {...otherProps}
                    />
                    {secure &&
                        <TouchableOpacity onPressOut={()=>setShow(false)} onPressIn={()=>setShow(true)}>
                            <Feather name={!show ? 'eye-off' : "eye"} size={24} color={colors.primary} />
                        </TouchableOpacity>
                    }
                    {children}
                </View>
                {hint ? <Text style={styles.hint}>{hint}</Text> : null}
            </View>
        );
    }
    else if(hint) {
        return (
            <View style={styles.outerContainer}>
                <View style={[styles.container, containerStyle]}>
                    <TextInput
                        style={[styles.input, inputStyle]}
                        placeholderTextColor={colors.primary}
                        {...otherProps}
                    />
                    {children}
                </View>
                {hint ? <Text style={styles.hint}>{hint}</Text> : null}
            </View>
        );
    }
    else{
        return (
            <View style={[styles.container, containerStyle, styles.outerContainer]}>
                <TextInput
                    style={[styles.input, inputStyle]}
                    placeholderTextColor={colors.primary}
                    {...otherProps}
                />
                {children}
            </View>
        );
    }

};

export default AppTextInput;

const styles = StyleSheet.create({
    container: {
        width: '85%',
        height: 50,
        borderRadius: 5,
        backgroundColor: colors.secondary,
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        elevation: 10
    },
    hint: {
        color: 'white',
        paddingHorizontal: 5
    },  
    outerContainer: {
        marginVertical: 10,
    },
    input: {
        flex: 1, 
        height: '100%', 
        paddingHorizontal: 5, 
        fontSize: 18
    }
});
