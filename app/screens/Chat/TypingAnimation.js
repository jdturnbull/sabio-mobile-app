import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';

const TypingIndicator = () => {
    const animatedValues = useRef([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]).current;
    let animation;

    const animate = () => {
        const animationsIn = animatedValues.map((animatedValue) => {
            return Animated.timing(animatedValue, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
                easing: Easing.linear,
            });
        });

        const animationsOut = animatedValues.map((animatedValue) => {
            return Animated.timing(animatedValue, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
                easing: Easing.linear,
            });
        });

        animation = Animated.sequence([
            Animated.stagger(100, animationsIn),
            Animated.delay(400),
            Animated.stagger(100, animationsOut),
        ]);

        animation.start(() => {
            // Callback to reset the animation
            animatedValues.forEach((value) => value.setValue(0));
            animate(); // restart the animation
        });
    };

    useEffect(() => {
        animate();

        // Cleanup function to stop animation on unmount
        return () => {
            if (animation) {
                animation.stop(); // This stops the entire sequence
            }
            animatedValues.forEach((value) => value.setValue(0)); // Reset values
        };
    }, []);

    return (
        <View style={styles.dotsContainer}>
            {animatedValues.map((value, index) => (
                <Animated.View
                    key={index}
                    style={[
                        styles.dot,
                        {
                            backgroundColor: '#A1AAD3',
                        },
                        {
                            opacity: value,
                            transform: [
                                {
                                    scale: value.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.5, 1],
                                    }),
                                },
                            ],
                        },
                    ]}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    dotsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#00000090',
        marginHorizontal: 3,
    },
});

export default TypingIndicator;