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
  ImageBackground,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useKeyboard } from '@react-native-community/hooks';
import { useDispatch, useSelector } from 'react-redux';
import SafariView from 'react-native-safari-view';
import * as openai from '../../../utils/openai';
import { updateState } from '../../../stores/onboarding/onboardingSlice';
import { getIconFromLabel } from '../../../utils/icon';
import AssistantMessage from '../../../components/chat/AssistantMessage';
import UserMessage from '../../../components/chat/UserMessage';
import background from '../../../assets/background-chat.png';
import call from '../../../utils/call';

const Chat = () => {
  const scrollRef = useRef();
  const dispatch = useDispatch();
  const keyboard = useKeyboard();
  const width = useWindowDimensions().width;

  const session = useSelector((state) => state.user.session);
  const state = useSelector((state) => state.onboarding);

  const [animatedWidth] = useState(new Animated.Value(width * 0.9));
  const [animatedMargin] = useState(new Animated.Value(120));

  const [userMessage, setUserMessage] = useState('');
  const [canSend, setCanSend] = useState(false);
  const [activeToolId, setActiveToolId] = useState(null);

  const [opacity] = useState(new Animated.Value(userMessage.split('').length > 0 ? 1 : 0.2));

  const Send = getIconFromLabel('send');

  // Handles setting up the assistant and thread & retrieving messages
  useEffect(() => {
    const setup = async () => {
      let assistant = state.assistant;
      let thread = state.thread;
      let messages = state.messages;
      let runId = state.runId;

      if (!state.assistant) {
        assistant = await openai.retrieveAssistant('onboarding');
      }

      if (!state.thread) {
        thread = await openai.createThread('onboarding');
      }

      messages = await openai.retrieveMessages(thread.id);

      const latest = messages[messages.length - 1];

      if (latest && latest.role === 'user') {
        console.log('Creating run from setup');
        runId = await openai.run(thread.id, assistant.id);
      }

      dispatch(updateState({ ...state, assistant, thread, messages, runId }));
    };

    setup();
  }, []);

  // Handles adding AI responses to the message thread
  useEffect(() => {
    const _run = async () => {
      if (!state.runId || !state.thread) return;

      const interval = setInterval(async () => {
        const runResponse = await openai.retrieveRun(state.thread.id, state.runId);

        if (!runResponse) return;

        if (runResponse.status === 'completed') {
          const messages = await openai.retrieveMessages(state.thread.id);
          dispatch(updateState({ messages, connectingDevice: false }));

          setTimeout(() => {
            scrollRef.current.scrollToEnd({ animated: true });
          }, 100);

          setCanSend(true);
          clearInterval(interval);
        } else if (runResponse.status === 'requires_action' && !activeToolId) {
          const { args, name, id } = openai.extractFunctionData(runResponse);

          if (name === 'connectSmartWatch') {
            if (args.toLowerCase().includes('fitbit')) {
              const redirect = await call('GET', `connect/getUrl/fitbit/${session.user.id}`);
              setActiveToolId(id);
              dispatch(updateState({ connectingDevice: true, redirect, showSafari: true }));
              clearInterval(interval);
            }
          }

          if (name === 'nextStep') {
            await call('POST', `users/completeOnboarding`, { data: args, id: session.user.id });
            dispatch(updateState({ onboarded: true }));
            clearInterval(interval);
          }
        }
      }, 500); // This is where the interval is set to 500ms
    };

    _run();

    // The dependencies array was missing brackets and should include the variables used within the useEffect hook.
  }, [state.runId, activeToolId]);

  // Handles initialising the response from the AI to a new user message
  useEffect(() => {
    const _run = async () => {
      const latestMessage = state.messages[state.messages.length - 1];

      if (latestMessage && latestMessage.role === 'user') {
        const runResponse = await openai.retrieveRun(state.thread.id, state.runId);

        if (runResponse && runResponse.status === 'completed') {
          const runId = await openai.run(state.thread.id, state.assistant.id);
          dispatch(updateState({ ...state, runId }));
        }
      }
    };

    _run();
  }, [state.messages]);

  // Handles user closing the safari view when making watch connection

  useEffect(() => {
    SafariView.addEventListener('onDismiss', async () => {
      if (activeToolId) {
        let output = '';

        const connected = await call('GET', `connect/list/${session.user.id}`);

        if (connected.length > 0) {
          output = 'success';
        } else {
          output = 'failure';
        }

        try {
          await openai.submitToolResponse(state.thread.id, state.runId, activeToolId, output);
          dispatch(updateState({ connectingDevice: false, showSafari: false }));
          setActiveToolId(null);
        } catch (error) {
          console.log('Error submitting tool response');
          console.log(error);
        }
      }
    });
  }, [activeToolId]);

  // Handles opening the safari view when making watch connection
  useEffect(() => {
    if (!state.showSafari) return;
    SafariView.show({ url: state.redirect });
  }, [state.showSafari]);

  // Handles animating the width of the input container (can't use native driver when animating layout props)
  useEffect(() => {
    Animated.timing(animatedMargin, {
      toValue: keyboard.keyboardShown ? 10 : 30,
      duration: 200,
      useNativeDriver: false,
    }).start();
    Animated.timing(animatedWidth, {
      toValue: keyboard.keyboardShown ? width * 0.98 : width * 0.9,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [keyboard.keyboardShown, width]);

  // Handles animating the opacity of the send button when text is entered / removed
  useEffect(() => {
    if (!canSend) return;
    Animated.timing(opacity, {
      toValue: userMessage.split('').length > 0 ? 1 : 0.2,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [userMessage]);

  // Handles sending user message to the assistant
  const handleSendUserMessage = async () => {
    setCanSend(false);
    const success = await openai.addUserMessage(state.thread.id, userMessage);

    if (success) {
      const messages = await openai.retrieveMessages(state.thread.id);
      setUserMessage('');
      dispatch(updateState({ messages }));
      setTimeout(() => {
        scrollRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ ...styles.headerContainer, width }}>
        <Text style={styles.header}>
          Chat with <Text style={{ color: '#E66642', fontWeight: '600' }}>Sabio</Text>
        </Text>
      </View>
      <ImageBackground source={background} resizeMode="cover" style={styles.background}>
        <KeyboardAvoidingView behavior="padding">
          <GestureHandlerRootView style={{ flex: 1, paddingTop: 116 }}>
            <Animated.ScrollView
              ref={scrollRef}
              showsVerticalScrollIndicator={false}
              style={{
                ...styles.scrollable,
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
              minHeight: 60,
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
                <Pressable style={{ ...styles.inputPressable }} onPress={handleSendUserMessage}>
                  <Animated.View style={{ opacity }}>
                    <Send />
                  </Animated.View>
                </Pressable>
              </View>
            </Animated.View>
          </Animated.View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#0f1013',
  },
  background: {
    flex: 1,
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
