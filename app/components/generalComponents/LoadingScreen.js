import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import AnimatedLottieView from 'lottie-react-native'
import colors from '../../config/colors'

const LoadingScreen = ({transparent=false}) => {
    return (
        <View style={[
            StyleSheet.absoluteFillObject, 
            {
                justifyContent: 'center', 
                alignItems: 'center', 
                backgroundColor: transparent ? '#00000000' : colors.primary
            }
        ]}>
            <AnimatedLottieView 
                loop
                autoPlay
                source={require('../../../assets/loading-bubbles.json')} 
            />
        </View>
    )
}

export default LoadingScreen
