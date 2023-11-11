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
} from '../../../utils/openai';
import { useDispatch, useSelector } from 'react-redux';
import { setOnboardingState } from '../../../stores/user/userSlice';
import { getIconFromLabel } from '../../../utils/icon';
import AssistantMessage from '../../../components/chat/AssistantMessage';
import UserMessage from '../../../components/chat/UserMessage';
import LoadingIndicator from '../../../components/chat/LoadingIndicator';
import { useNavigation } from '@react-navigation/native';

const GoalChat = () => {
  const scrollRef = useRef();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const width = useWindowDimensions().width;

  const [loading, setLoading] = useState(true);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const state = useSelector((state) => state.user.onboardingState);

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

  // Handles setting up the assistant and thread & retrieving messages
  useEffect(() => {
    const setup = async () => {
      let assistant = state.assistant;
      let thread = state.thread;
      let messages = state.messages;
      let runId = state.runId;

      if (!state.assistant) {
        assistant = await retrieveAssistant('goal');
      }

      if (!state.thread) {
        thread = await createThread('goal');
      }

      messages = await retrieveMessages(thread.id);

      const latest = messages[messages.length - 1];

      if (latest && latest.role === 'user') {
        setLoading(true);
        runId = await run(thread.id, assistant.id);
      }

      dispatch(setOnboardingState({ ...state, assistant, thread, messages, runId }));
    };

    setup();
  }, []);

  // Handles adding AI responses to the message thread
  useEffect(() => {
    if (!state.runId || !state.thread) return;

    const intervalId = setInterval(async () => {
      const runResponse = await axios.get(
        `https://api.openai.com/v1/threads/${state.thread.id}/runs/${state.runId}`,
        config,
      );

      if (runResponse.data.status === 'requires_action') {
        const { args } = extractFunctionData(runResponse);
        dispatch(setOnboardingState({ ...state, dataGathered: args }));
        navigation.navigate('Login');
      }

      if (runResponse.data.status === 'completed') {
        try {
          const messages = await retrieveMessages(state.thread.id);
          dispatch(setOnboardingState({ ...state, messages, runId: null }));

          setLoading(false);
          setCanSend(true);
          clearInterval(intervalId);
        } catch (error) {
          console.log(`Error retrieving messages (GoalChat.js): ${error.message}`);
        }
      }
    }, 500);
  }, [state.runId]);

  // Handles initialising the response from the AI to a new user message
  useEffect(() => {
    scrollRef.current.scrollToEnd({ animated: true });

    const _run = async () => {
      const latestMessage = state.messages[state.messages.length - 1];

      if (latestMessage && latestMessage.role === 'user') {
        const runId = await run(state.thread.id, state.assistant.id);
        dispatch(setOnboardingState({ ...state, runId }));
      }
    };

    _run();
  }, [state.messages]);

  // Handles animating the width of the input container when the keyboard is shown / hidden
  useEffect(() => {
    Animated.timing(animatedMargin, {
      toValue: isKeyboardVisible ? 10 : 30,
      duration: 200, // This is the duration of the animation
      useNativeDriver: false, // Set to true if you are only animating non-layout properties
    }).start();

    Animated.timing(animatedWidth, {
      toValue: isKeyboardVisible ? width * 0.98 : width * 0.9,
      duration: 200, // This is the duration of the animation
      useNativeDriver: false, // Set to true if you are only animating non-layout properties
    }).start();

    Animated.timing(scrollOpacity, {
      toValue: isKeyboardVisible ? 0.3 : 1,
      duration: 200, // This is the duration of the animation
      useNativeDriver: false, // Set to true if you are only animating non-layout properties
    }).start();
  }, [isKeyboardVisible, width]);

  const [userMessage, setUserMessage] = useState('');
  const [opacity] = useState(new Animated.Value(userMessage.split('').length > 0 ? 1 : 0.2));

  // Handles animating the opacity of the send button when text is entered / removed
  useEffect(() => {
    if (!canSend) return;
    Animated.timing(opacity, {
      toValue: userMessage.split('').length > 0 ? 1 : 0.2,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [userMessage]);

  const [canSend, setCanSend] = useState(false);

  const handleSendUserMessage = async () => {
    setCanSend(false);
    const success = await addUserMessage(state.thread.id, userMessage);

    if (success) {
      const messages = await retrieveMessages(state.thread.id);
      setUserMessage('');
      dispatch(setOnboardingState({ ...state, messages }));
      scrollRef.current.scrollToEnd({ animated: true });
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ ...styles.headerContainer, width }}>
        <Text style={styles.header}>
          Chat with <Text style={{ color: '#E66642', fontWeight: '600' }}>Sabio</Text>
        </Text>
      </View>
      <KeyboardAvoidingView behavior="padding">
        <GestureHandlerRootView style={{ flex: 1, paddingTop: 116 }}>
          <Animated.ScrollView
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            style={{
              ...styles.scrollable,
              opacity: scrollOpacity,
              marginHorizontal: 20,
            }}>
            {state.messages.map((message, index) => {
              if (message?.role === 'assistant') {
                return <AssistantMessage key={index} message={message.content[0].text.value} />;
              } else {
                return <UserMessage key={index} message={message.content[0].text.value} />;
              }
            })}
          </Animated.ScrollView>
        </GestureHandlerRootView>
        <Animated.View
          style={{
            alignItems: 'center',
            justifyContent: 'flex-end',
            backgroundColor: '#0f1013',
            minHeight: 85,
            paddingTop: 10,
            width,
          }}>
          <Animated.View style={{ ...styles.inputContainer, width: animatedWidth, marginBottom: animatedMargin }}>
            <TextInput
              multiline
              style={styles.input}
              value={userMessage}
              onChangeText={(text) => setUserMessage(text)}
            />
            <View style={{ height: '100%', width: 34 }}>
              <Pressable disabled={!canSend} style={{ ...styles.inputPressable }} onPress={handleSendUserMessage}>
                <Animated.View style={loading ? {} : { opacity }}>
                  {!loading ? <Send /> : <LoadingIndicator />}
                </Animated.View>
              </Pressable>
            </View>
          </Animated.View>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default GoalChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#0f1013',
  },
  headerContainer: {
    zIndex: 1,
    position: 'absolute',
    display: 'flex',
    alignItems: 'flex-start',
    paddingTop: 65,
    paddingLeft: 10,
    backgroundColor: '#16171B',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 11,
    elevation: 10,
  },
  header: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 25,
    marginHorizontal: 10,
    paddingBottom: 20,
  },
  scrollable: {
    paddingTop: 18,
    height: '100%',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2025',
    borderRadius: 20,
    padding: 7,
    paddingLeft: 15,
    paddingRight: 7,
    paddingBottom: 7,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 11,
    elevation: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    padding: 0,
    margin: 0,
    marginBottom: 3,
    maxHeight: 70,
  },
  inputPressable: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 11,
    elevation: 10,
  },
});
