import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  TextInput,
  Pressable,
  Animated,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import axios from 'axios';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  retrieveAssistant,
  createThread,
  retrieveMessages,
  run,
  config,
  addUserMessage,
  extractFunctionData,
} from '../../../../utils/openai';
import { useDispatch, useSelector } from 'react-redux';
import { getIconFromLabel } from '../../../../utils/icon';
import AssistantMessage from '../../../../components/chat/AssistantMessage';
import UserMessage from '../../../../components/chat/UserMessage';
import LoadingIndicator from '../../../../components/chat/LoadingIndicator';
import { useNavigation } from '@react-navigation/native';
import { updateState } from '../../../../stores/user/userSlice';

const Chat = () => {
  const scrollRef = useRef();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const width = useWindowDimensions().width;

  const [loading, setLoading] = useState(true);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const state = useSelector((state) => state.user);

  const [animatedWidth] = useState(new Animated.Value(width * 0.9));
  const [scrollOpacity] = useState(new Animated.Value(1));
  const [animatedMargin] = useState(new Animated.Value(120));

  const Send = getIconFromLabel('send');

  // Handles setting up the keyboard listeners to animate the input container & scroll up the scrollview
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
      scrollRef.current.scrollToEnd({ animated: true });
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>
          Chat with <Text style={{ color: '#E66642', fontWeight: '600' }}>Sabio</Text>
        </Text>
      </View>
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    height: 85,
    marginTop: 45,
    backgroundColor: '#0f1013',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 3,
    shadowOpacity: 0.3,
    shadowColor: 'black',
  },
  header: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 25,
    marginHorizontal: 10,
    padding: 20,
  },
});
