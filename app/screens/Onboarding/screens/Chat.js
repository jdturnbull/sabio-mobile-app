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
import AssistantMessage from './components/AssistantMessage';
import UserMessage from './components/UserMessage';
import LoadingIndicator from './components/LoadingIndicator';

const GoalChat = () => {
  const scrollRef = useRef();
  const dispatch = useDispatch();
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
      let assistant = state.ai.assistant;
      let thread = state.ai.thread;
      let messages = state.ai.messages;
      let runId = state.ai.runId;

      if (!state.ai.assistant) {
        assistant = await retrieveAssistant('goal');
      }

      if (!state.ai.thread) {
        thread = await createThread('goal');
      }

      messages = await retrieveMessages(thread.id);

      const latest = messages[messages.length - 1];

      if (latest && latest.role === 'user') {
        setLoading(true);
        runId = await run(thread.id, assistant.id);
      }

      dispatch(setOnboardingState({ ...state, ai: { assistant, thread, messages, runId } }));
    };

    setup();
  }, []);

  // Handles adding AI responses to the message thread
  useEffect(() => {
    if (!state.ai.runId || !state.ai.thread) return;

    const intervalId = setInterval(async () => {
      const runResponse = await axios.get(
        `https://api.openai.com/v1/threads/${state.ai.thread.id}/runs/${state.ai.runId}`,
        config,
      );

      if (runResponse.data.status === 'requires_action') {
        const { name, args } = extractFunctionData(runResponse);
        // TODO: Handle the action
      }

      if (runResponse.data.status === 'completed') {
        try {
          const messages = await retrieveMessages(state.ai.thread.id);
          dispatch(setOnboardingState({ ...state, ai: { ...state.ai, messages, runId: null } }));

          setLoading(false);
          setCanSend(true);
          clearInterval(intervalId);
        } catch (error) {
          console.log(`Error retrieving messages (GoalChat.js): ${error.message}`);
        }
      }
    }, 500);
  }, [state.ai.runId]);

  // Handles initialising the response from the AI to a new user message
  useEffect(() => {
    scrollRef.current.scrollToEnd({ animated: true });

    const _run = async () => {
      const latestMessage = state.ai.messages[state.ai.messages.length - 1];

      if (latestMessage && latestMessage.role === 'user') {
        const runId = await run(state.ai.thread.id, state.ai.assistant.id);
        dispatch(setOnboardingState({ ...state, ai: { ...state.ai, runId } }));
      }
    };

    _run();
  }, [state.ai.messages]);

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
    const success = await addUserMessage(state.ai.thread.id, userMessage);

    if (success) {
      const messages = await retrieveMessages(state.ai.thread.id);
      setUserMessage('');
      dispatch(setOnboardingState({ ...state, ai: { ...state.ai, messages } }));
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
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Animated.ScrollView
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            style={{
              ...styles.scrollable,
              opacity: scrollOpacity,
              width: width * 0.9,
            }}>
            {state.ai.messages.map((message, index) => {
              if (message?.role === 'assistant') {
                return <AssistantMessage key={index} message={message.content[0].text.value} />;
              } else {
                return <UserMessage key={index} message={message.content[0].text.value} />;
              }
            })}
          </Animated.ScrollView>
        </GestureHandlerRootView>
        <Animated.View style={{ alignItems: 'center' }}>
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
    top: 116,
    paddingTop: 18,
    height: '100%',
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
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
