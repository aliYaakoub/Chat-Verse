import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {Ionicons, AntDesign} from '@expo/vector-icons'

import HomeScreen from '../../screens/HomeScreen';
import colors from '../../config/colors';
import ContactsScreen from '../../screens/ContactsScreen';
import SettingsScreen from '../../screens/SettingsScreen';
import { LoadingScreen } from '../generalComponents';
import { useAppContext } from './../../config/Context';

const Tab = createBottomTabNavigator();

const MainScreen = () => {

    const { currentUser } = useAppContext()

    if(currentUser){
        return (
            <Tab.Navigator
                screenOptions={{
                    keyboardHidesTabBar: true,
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        backgroundColor: '#000000',
                        height: 50,
                    }
                }}
            >
                <Tab.Screen name='Home' component={HomeScreen} options={{
                        headerShown: false,
                        tabBarHideOnKeyboard: true,
                        tabBarIcon: ({focused}) => (
                            <View style={styles.container}>
                                <AntDesign
                                    name='home' 
                                    size={40}
                                    color={focused ? colors.accent : 'white'} 
                                />
                            </View>
                        )
                }}/>
                <Tab.Screen name='Contacts' component={ContactsScreen} options={{
                        headerShown: false,
                        tabBarHideOnKeyboard: true,
                        tabBarIcon: ({focused}) => (
                            <View style={styles.container}>
                                <AntDesign
                                    name='contacts' 
                                    size={40}
                                    color={focused ? colors.accent : 'white'} 
                                />
                            </View>
                        )
                }}/>
                <Tab.Screen name='Settings' component={SettingsScreen} options={{
                        headerShown: false,
                        tabBarHideOnKeyboard: true,
                        tabBarIcon: ({focused}) => (
                            <View style={styles.container}>
                                <Ionicons
                                    name='settings-outline' 
                                    size={40}
                                    color={focused ? colors.accent : 'white'} 
                                />
                            </View>
                        )
                }}/>
            </Tab.Navigator>
        );
    }
    else{
        return <LoadingScreen />
    }
};

export default MainScreen;

const styles = StyleSheet.create({
    container: {
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    }
});
