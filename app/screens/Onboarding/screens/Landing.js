import React, { useEffect, useRef } from 'react';
import { Text, Animated, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Landing = () => {
  const navigation = useNavigation();
  const width = useWindowDimensions().width;

  const opacity = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    navigation.navigate('Chat');
  };

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={{ ...styles.container, width }}>
      <Animated.View style={{ ...styles.header, width: width * 0.8 }}>
        <Animated.Text style={{ ...styles.headerText, opacity }}>
          Welcome to <Text style={{ color: '#E66642', fontWeight: '600' }}>Sabio</Text>
        </Animated.Text>
        <Animated.View style={{ marginTop: 60, fontWeight: 500 }}>
          <Animated.Text style={{ ...styles.subHeader, opacity }}>
            To get started we need to learn a little about you.
          </Animated.Text>
          <Animated.Text style={{ ...styles.subHeader, opacity, marginTop: 30 }}>
            Set aside <Text style={{ fontWeight: 700 }}>5 minutes</Text> to chat with Sabio about your needs and goals.
          </Animated.Text>
        </Animated.View>
        <Animated.View style={{ ...styles.buttonContainer, opacity }}>
          <Pressable onPress={handlePress} style={{ ...styles.pressable }}>
            <Text style={styles.text}>Get started with Sabio</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1013',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  headerText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 40,
    lineHeight: 55,
  },
  subHeader: {
    lineHeight: 30,
    color: '#fff',
    fontSize: 20,
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 70,
    marginBottom: 30,
  },
  pressable: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#1F2025',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.4,
    shadowRadius: 11,
    elevation: 10,
  },
  text: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 20,
  },
});
export default Landing;
