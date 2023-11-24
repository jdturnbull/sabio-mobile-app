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
import * as openai from '../../../../utils/openai';
import { useDispatch, useSelector } from 'react-redux';
import { getIconFromLabel } from '../../../../utils/icon';
import AssistantMessage from '../../../../components/chat/AssistantMessage';
import UserMessage from '../../../../components/chat/UserMessage';
import { useNavigation } from '@react-navigation/native';
import { updateState } from '../../../../stores/chat/chatSlice';
import { useKeyboard } from '@react-native-community/hooks';
import background from '../../../../assets/background-chat.png';
import call from '../../../../utils/call';

const Chat = () => {
  const scrollRef = useRef();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const keyboard = useKeyboard();
  const width = useWindowDimensions().width;
  const [isSetup, setIsSetup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toolId, setToolId] = useState(null);
  const [toolOutput, setToolOutput] = useState(null);
  const [shouldCompleteTool, setShouldCompleteTool] = useState(false);
  const [canSend, setCanSend] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [requiresResponse, setRequiresResponse] = useState(false);
  const [responsePending, setResponsePending] = useState(false);

  const session = useSelector((state) => state.user.session);
  const state = useSelector((state) => state.chat);

  const [animatedWidth] = useState(new Animated.Value(width * 0.9));
  const [animatedMargin] = useState(new Animated.Value(120));
  const [opacity] = useState(new Animated.Value(userMessage.split('').length > 0 ? 1 : 0.2));

  const Send = getIconFromLabel('send');

  // Handles setting up the assistant and thread & retrieving messages
  useEffect(() => {
    const setup = async () => {
      if (isSetup) return;

      let assistant = state.assistant;
      let thread = state.thread;
      let messages = state.messages;

      if (!state.assistant) {
        assistant = await openai.retrieveAssistant('main');
      }

      if (!state.thread) {
        thread = await openai.createThread('main', state.activity);
      }

      // Get the messages from the thread
      messages = await openai.retrieveMessages(thread.id);

      // Update the state with the assistant, thread and messages
      dispatch(updateState({ ...state, assistant, thread, messages }));

      // Get the most recent message
      const latestMessage = messages[messages.length - 1];

      // If the most recent message is from the user trigger an AI response
      if (latestMessage?.role === 'user') {
        setRequiresResponse(true);
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
      const id = await openai.run(state.thread.id, state.assistant.id, session.user.id);

      // Save the id of the response
      dispatch(updateState({ ...state, runId: id }));

      // Tell the component that a response is no longer required
      setRequiresResponse(false);

      // Tell the component that a response is pending
      setResponsePending(true);
    };

    _run();
  }, [requiresResponse]);

  // Handles capturing the response and adding it to the message thread.
  useEffect(() => {
    let timeoutId = null;

    const _captureResponse = async () => {
      if (!responsePending) return;

      // Retrieve the response from the AI
      const response = await openai.retrieveRun(state.thread.id, state.runId);
      console.log('Retrieved response, status is:' + response.status);

      if (response.status === 'in_progress' || response.status === 'queued') {
        // If the response isn't ready yet, run the function again in 2 seconds
        timeoutId = setTimeout(_captureResponse, 2000);
      } else if (response.status === 'completed') {
        // Get the new messages from the message thread and save them
        const messages = await openai.retrieveMessages(state.thread.id);

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
        const { args, name, id } = openai.extractFunctionData(response);

        // Save the tool id so we can use it when getting the tool completion
        setToolId(id);

        if (name === 'replan') {
          // Send the data to the backend to replan the week
          const response = await call('POST', 'users/replan', { data: args, userId: session.user.id });

          // Save the response to the tool output so it can be used when completing the tool
          setToolOutput(response);

          // Trigger the tool completion
          setShouldCompleteTool(true);
        }

        // Tell the component that a response is no longer pending
        setResponsePending(false);
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

      // Complete the tool
      await openai.submitToolResponse(state.thread.id, state.runId, toolId, toolOutput);

      // Tell the component that the tool no longer needs to be completed
      setShouldCompleteTool(false);

      // Tell the component a response is pending
      setResponsePending(true);
    };

    _completeTool();
  }, [shouldCompleteTool]);

  // Handles sending user message to the assistant
  const handleSendUserMessage = async () => {
    if (!userMessage) return;
    if (!canSend) return;

    // Stop the user from sending a message while the AI is responding
    setCanSend(false);

    // Add the user message to the message thread
    await openai.addUserMessage(state.thread.id, userMessage);

    // Clear the user message
    setUserMessage('');

    // Retrieve the messages from the message thread
    const messages = await openai.retrieveMessages(state.thread.id);

    // Update the state with the new messages
    dispatch(updateState({ messages }));

    // Tell the AI to respond to the user message
    setRequiresResponse(true);

    // Scroll to the bottom of the chat so the user can see the new message
    setTimeout(() => {
      scrollRef.current.scrollToEnd({ animated: true });
    }, 100);
  };

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

  useEffect(() => {
    scrollRef.current.scrollToEnd({ animated: true });
  }, [keyboard.keyboardShown]);

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
              {loading && (
                <View style={{ height: 100, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>Sabio is typing...</Text>
                </View>
              )}
            </Animated.ScrollView>
          </GestureHandlerRootView>
          <Animated.View
            style={{
              alignItems: 'center',
              justifyContent: 'flex-end',
              minHeight: 63,
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
    paddingBottom: 25,
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
