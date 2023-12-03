import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Pressable, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const Footer = ({ data }) => {
  const [isFirstRender, setIsFirstRender] = useState(true);

  const screenHeight = Dimensions.get('window').height;

  // Use a shared value for height instead of translateY
  const heightAnim = useSharedValue(155); // Initial height

  useEffect(() => {
    heightAnim.value = withTiming(isFirstRender ? 0 : 155, { duration: 200 });

    if (isFirstRender) {
      setTimeout(() => setIsFirstRender(false), 500);
    }
  }, [data, heightAnim, isFirstRender]);

  const handlePress = () => {
    // Animate height to half the screen height
    heightAnim.value = withTiming(screenHeight / 2, { duration: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: heightAnim.value,
    };
  });

  return (
    <View>
      <Animated.View style={[styles.overlay, animatedStyle]}>
        <View style={styles.container}>
          <Text style={styles.title}>{data?.item.title}</Text>
          <Text numberOfLines={1} style={styles.body}>
            {data?.item.guidance}
          </Text>
          <Pressable style={styles.pressable} onPress={handlePress}>
            <Text style={styles.pressableText}>See more</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: -10,
    left: 0,
    right: 0,
    backgroundColor: '#16171B',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  container: {
    width: '100%',
    height: '100%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: '#8AA1B130',
    padding: 20,
  },
  title: {
    fontFamily: 'Noto Sans',
    fontWeight: '700',
    color: '#8AA1B190',
    fontSize: 16,
  },
  body: {
    fontFamily: 'Noto Sans',
    fontWeight: '400',
    color: '#8AA1B190',
    fontSize: 14,
    marginTop: 5,
  },
  pressable: {
    marginTop: 20,
    backgroundColor: '#8AA1B1',
    borderRadius: 10,
    padding: 12,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressableText: {
    fontFamily: 'Noto Sans',
    fontWeight: '700',
    color: '#f8f8f8',
    fontSize: 16,
  },
});
