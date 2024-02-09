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
  Alert,
  Appearance,
} from 'react-native';
import styled from 'styled-components';
import { useTheme } from 'styled-components';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useKeyboard } from '@react-native-community/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import * as openai from '../../utils/openai';
import { updateState } from '../../stores/onboarding/onboardingSlice';
import { getIconFromLabel } from '../../utils/icon';
import AssistantMessage from '../../components/chat/AssistantMessage';
import UserMessage from '../../components/chat/UserMessage';
import TypingAnimation from '../../components/chat/TypingAnimation';
import backgroundDark from '../../assets/background-chat-dark.png';
import backgroundLight from '../../assets/background-chat-light.png';

import call from '../../utils/call';
import { hapticImpact } from '../../utils/haptics';
import { setup } from '../../stores/user/userSlice';
import { usePostHog } from 'posthog-react-native';

const StyledGestureHandlerRootView = styled(GestureHandlerRootView)`
  flex: 1;
`;

const Chat = () => {
  const posthog = usePostHog();
  const colorScheme = Appearance.getColorScheme();
  const scrollRef = useRef();
  const dispatch = useDispatch();
  const keyboard = useKeyboard();
  const width = useWindowDimensions().width;
  const navigation = useNavigation();

  const session = useSelector((state) => state.user.session);
  const state = useSelector((state) => state.onboarding);

  const [isSetup, setIsSetup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toolOutputs, setToolOutputs] = useState([]);
  const [shouldCompleteTool, setShouldCompleteTool] = useState(false);
  const [canSend, setCanSend] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [requiresResponse, setRequiresResponse] = useState(false);
  const [responsePending, setResponsePending] = useState(false);

  const [hasResetThread, setHasResetThread] = useState(false);

  const [animatedWidth] = useState(new Animated.Value(width * 0.9));
  const [animatedMargin] = useState(new Animated.Value(120));

  const [opacity] = useState(new Animated.Value(userMessage.split('').length > 0 ? 1 : 0.2));

  const theme = useTheme();

  const Send = getIconFromLabel('send');

  // Check if we should be on this screen
  useEffect(() => {
    if (session.user.onboardingData) {
      navigation.navigate('Finalise');
    }
  }, []);

  // Handles setting up the assistant
  const setupAssistant = async () => {
    if (state.assistant) return state.assistant;
    const { response, error } = await openai.retrieveAssistant('onboarding', session.user?.id);
    if (error) {
      posthog.capture('ERROR', { type: 'onboarding_chat', subType: 'setup_assistant' });
      Alert.alert('Error', 'There was an issue setting up the chat. Please reload the app.');
      return null;
    }
    return response;
  };

  const setupThread = async () => {
    if (state.thread) return state.thread; // If thread is already set, return it
    let threadId = session.user?.threadId;

    if (threadId) {
      // Try to retrieve or move messages to a new thread based on the condition
      const { response, error } = threadId.includes('error')
        ? await openai.moveMessagesToNewThread(threadId)
        : await openai.retrieveThread(threadId, session.user?.id);

      if (!error) {
        if (threadId.includes('error')) {
          posthog.capture('ONBOARDING_CHAT_ACTION', { type: 'moved_messages_to_new_thread' });
          setHasResetThread(true);
        }

        await call('POST', 'users/update', { userId: session.user?.id, data: { threadId: response.id } });
        return response;
      } else {
        posthog.capture('ERROR', { type: 'onboarding_chat', subType: 'setup_thread' });
      }
    }

    // Create a new thread if there's no threadId or if there was an error
    const { response, error } = await openai.createThread('onboarding');

    if (error) {
      posthog.capture('ERROR', { type: 'onboarding_chat', subType: 'setup_blank_thread' });
      Alert.alert('Error', 'There was an issue setting up the chat. Please reload the app');
      return null;
    }

    await call('POST', 'users/update', { userId: session.user?.id, data: { threadId: response.id } });
    return response;
  };

  const setupMessages = async (thread) => {
    if (!thread) return [];
    return await openai.retrieveMessages(thread.id, session.user?.id);
  };

  // Handles setting up the assistant and thread & retrieving messages
  useEffect(() => {
    const setup = async () => {
      const assistant = await setupAssistant();
      const thread = await setupThread();
      const messages = await setupMessages(thread);

      // Update the state with the assistant, thread and messages
      dispatch(updateState({ ...state, assistant, thread, messages }));

      // Get the most recent message
      const latestMessage = messages[messages.length - 1];

      // If the most recent message is from the user trigger an AI response
      if (latestMessage?.role === 'user') {
        setRequiresResponse(true);
      } else {
        setCanSend(true);
      }

      setIsSetup(true);
    };

    setup();
  }, []);

  // Handles initialising the response from the AI to a new user message
  useEffect(() => {
    const _run = async () => {
      // If no response is required, then don't run
      if (!requiresResponse) return;

      // Set loading to true to show the loading indicator
      setLoading(true);

      // Initialise a response from the AI

      const { response, error } = await openai.run(
        state.thread.id,
        state.assistant.id,
        session.user?.id,
        hasResetThread,
      );

      if (error) {
        posthog.capture('ERROR', { type: 'onboarding_chat', subType: 'initialise_response' });
        await call('POST', 'users/update', { userId: session.user?.id, data: { threadId: `error-${thread.id}` } });
        Alert.alert('Error', 'There was a problem with your assistant, please reload the app.');
      } else {
        // Save the id of the response
        dispatch(updateState({ ...state, runId: response.id }));

        // Tell the component that a response is no longer required
        setRequiresResponse(false);

        // Tell the component that a response is pending
        setResponsePending(true);

        posthog.capture('ONBOARDING_CHAT_ACTION', { type: 'initialise_response' });
      }
    };

    _run();
  }, [requiresResponse]);

  // Handles capturing the response and adding it to the message thread.
  useEffect(() => {
    let timeoutId = null;

    const _captureResponse = async () => {
      if (!responsePending) return;

      try {
        // Retrieve the response from the AI
        const { response, error } = await openai.retrieveRun(state.thread.id, state.runId, session.user?.id);

        if (error) {
          posthog.capture('ERROR', { type: 'onboarding_chat', subType: 'capture_response' });
          Alert.alert('Error', 'There was an issue with the chat, please reload the app.');
          await call('POST', 'users/update', { userId: session.user?.id, data: { threadId: `error-${thread.id}` } });
        }

        console.log('Retrieved response, status is:' + response.status);

        if (response.status === 'in_progress' || response.status === 'queued') {
          // If the response isn't ready yet, run the function again in 2 seconds
          timeoutId = setTimeout(_captureResponse, 2000);
        } else if (response.status === 'completed') {
          // Get the new messages from the message thread and save them
          const messages = await openai.retrieveMessages(state.thread.id, session.user?.id);

          // Set loading to false to remove the loading indicator
          setLoading(false);

          // Update the state with the new messages
          dispatch(updateState({ messages }));

          // Scroll to the bottom of the chat so the user can see the new message
          setTimeout(() => {
            scrollRef.current?.scrollToEnd({ animated: true });
          }, 100);

          // Set canSend true to enable the user to send a new message
          setCanSend(true);

          // Tell the component that a response is no longer pending
          setResponsePending(false);
        } else if (response.status === 'requires_action') {
          // Extract the function data from the response
          const calls = openai.extractFunctionData(response, session.user?.id);

          for (let i = 0; i < calls.length; i++) {
            const { args, name, id } = calls[i];

            if (name === 'nextStep') {
              try {
                posthog.capture('ONBOARDING_CHAT_ACTION', { type: 'next_step' });

                await call('POST', `users/saveOnboardingData`, {
                  data: args,
                  id: session.user?.id,
                  threadId: state.thread.id,
                });

                setToolOutputs([
                  ...toolOutputs,
                  { id, response: 'User has completed the onboarding, wish them farewell for now.' },
                ]);

                // Update the state to move the user into the app
                setTimeout(() => {
                  navigation.navigate('Finalise');
                }, 2000);
              } catch (error) {
                posthog.capture('ERROR', { type: 'onboarding_chat', subType: 'next_step' });
                setToolOutputs([
                  ...toolOutputs,
                  {
                    id,
                    response:
                      "Error completing onboarding, you'll need to apologise to the user and ask them if they'd like you to try again.",
                  },
                ]);
              }
            }
          }

          // Trigger the tool completion
          setShouldCompleteTool(true);

          // Tell the component that a response is no longer pending
          setResponsePending(false);
        }
      } catch (error) {
        posthog.capture('ERROR', { type: 'onboarding_chat', subType: 'capture_response' });
        // Reset threadId, here i want to move the messages over to the new thread
        Alert.alert('Error', 'There was an issue with the chat, please reload the app.');
        await call('POST', 'users/update', { userId: session.user?.id, data: { threadId: `error-${thread.id}` } });
      }
    };

    _captureResponse();

    // Cleanup function to clear the timeout when the component unmounts or before the useEffect runs again
    return () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, [responsePending]);

  // Handles completing the tool
  useEffect(() => {
    const _completeTool = async () => {
      if (!shouldCompleteTool) return;

      let raw_body = toolOutputs.map((tool, index) => {
        return { tool_call_id: tool.id, output: tool.response };
      });

      // Replace any undefined outputs with an error string
      for (let i = 0; i < raw_body.length; i++) {
        if (raw_body[i].output === undefined) {
          raw_body[i].output = 'Error: No output';
        }
      }

      const body = JSON.stringify({ tool_outputs: raw_body });

      const { response, error } = await openai.submitToolResponse({
        thread_id: state.thread.id,
        run_id: state.runId,
        body,
        userId: session.user?.id,
      });

      if (error) {
        posthog.capture('ERROR', { type: 'onboarding_chat', subType: 'complete_tool' });
        Alert.alert('Error', 'There was an issue completing the tool, please reload the app.');
        await call('POST', 'users/update', { userId: session.user?.id, data: { threadId: `error-${thread.id}` } });
      } else {
        // Save the response to the tool output so it can be used when completing the tool
        setToolOutputs([]);

        // Tell the component that the tool no longer needs to be completed
        setShouldCompleteTool(false);

        // Tell the component a response is pending
        setResponsePending(true);

        posthog.capture('ONBOARDING_CHAT_ACTION', { type: 'complete_tool' });
      }
    };

    _completeTool();
  }, [shouldCompleteTool]);

  // Handles sending user message to the assistant
  const handleSendUserMessage = async () => {
    if (!userMessage) return;
    if (!canSend) return;

    // Stop the user from sending a message while the AI is responding
    setCanSend(false);

    hapticImpact();

    // Add the user message to the message thread
    await openai.addUserMessage(state.thread.id, userMessage, session.user?.id);

    // Clear the user message
    setUserMessage('');

    // Retrieve the messages from the message thread
    const messages = await openai.retrieveMessages(state.thread.id, session.user?.id);

    // Update the state with the new messages
    dispatch(updateState({ messages }));

    // Tell the AI to respond to the user message
    setRequiresResponse(true);

    posthog.capture('ONBOARDING_CHAT_ACTION', { type: 'send_user_message' });

    // Scroll to the bottom of the chat so the user can see the new message
    setTimeout(() => {
      scrollRef.current.scrollToEnd({ animated: true });
    }, 100);
  };

  // Handles animating the width of the input container (can't use native driver when animating layout props)
  useEffect(() => {
    Animated.timing(animatedMargin, {
      toValue: keyboard.keyboardShown ? 5 : 30,
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

  const Logout = getIconFromLabel('logout');

  const logout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            // remove token from local storage
            await AsyncStorage.removeItem('session');
            dispatch(setup());
          },
        },
      ],
      { cancelable: false },
    );
  };

  return (
    <View style={{ ...styles.container, backgroundColor: theme.colors.chatBackground }}>
      <ImageBackground
        source={colorScheme === 'light' ? backgroundLight : backgroundDark}
        resizeMode="cover"
        style={styles.background}>
        <KeyboardAvoidingView behavior="padding">
          <StyledGestureHandlerRootView>
            <Animated.ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
              <View
                style={{
                  marginTop: 50,
                  height: 50,
                  paddingHorizontal: 20,
                  display: 'flex',
                  justifyContent: 'center',
                }}>
                <Pressable onPress={logout}>
                  <Logout color={theme.text.colors.secondary} />
                </Pressable>
              </View>
              {state.messages.map((message, index) => {
                if (message?.role === 'assistant') {
                  return <AssistantMessage key={index} message={message.content[0].text.value} />;
                } else {
                  return <UserMessage key={index} message={message.content[0].text.value} />;
                }
              })}
              {loading && (
                <View
                  style={{
                    backgroundColor: theme.text.chatMessage.backgroundAssistant,
                    borderRadius: 18,
                    borderTopLeftRadius: 0,
                    padding: 15,
                    marginBottom: 20,
                    marginLeft: 28,
                    marginRight: 45,
                    alignSelf: 'flex-start',
                  }}>
                  <TypingAnimation />
                </View>
              )}
            </Animated.ScrollView>
          </StyledGestureHandlerRootView>
          <Animated.View
            style={{
              alignItems: 'center',
              justifyContent: 'flex-end',
              minHeight: 50,
              paddingTop: 10,
              width,
            }}>
            <Animated.View
              style={{
                ...styles.inputContainer,
                width: animatedWidth,
                marginBottom: animatedMargin,
                backgroundColor: theme.text.chatMessage.inputBackground,
              }}>
              <TextInput
                multiline
                style={{ ...styles.input, color: theme.text.colors.secondary }}
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
  },
  background: {
    flex: 1,
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
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '400',
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
  modal: {
    flex: 1,
  },
  modalContent: {
    height: '100%',
    backgroundColor: '#16171B',
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    zIndex: 100,
    padding: 20,
  },
  modalTop: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    width: 40,
    height: 4,
    borderRadius: 4,
    backgroundColor: '#ffffff40',
  },
  modalBody: {
    flex: 1,
    marginTop: 30,
    padding: 20,
  },
  modalTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 20,
    marginBottom: 20,
  },
  modalText: {
    marginTop: 20,
    fontSize: 15,
    lineHeight: 20,
    color: '#737476',
    fontWeight: '600',
  },
  pressable: {
    marginTop: 40,
    marginRight: 10,
    backgroundColor: '#1F2025',
    padding: 20,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 3,
    shadowOpacity: 0.3,
    shadowColor: '#000',
  },
  pressableText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
