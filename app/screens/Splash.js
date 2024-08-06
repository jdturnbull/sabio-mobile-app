import React from 'react';
import LottieView from 'lottie-react-native';
import { View } from 'react-native';
import splash_animation from '../assets/splash.json';

const Splash = () => {
    return (
        <View style={{ flex: 1, backgroundColor: '#16171B' }}>
            <LottieView style={{ width: '100%', height: '100%' }} source={splash_animation} autoPlay />
        </View>
    )
};

export default Splash;