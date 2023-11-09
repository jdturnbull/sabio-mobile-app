import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
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
import { ScrollView, GestureHandlerRootView } from 'react-native-gesture-handler';
import { retrieveAssistant, createThread, retrieveMessages, run, config, addUserMessage } from '../../../utils/openai';
import { useDispatch, useSelector } from 'react-redux';
import { setOnboardingState } from '../../../stores/user/userSlice';
import { getIconFromLabel } from '../../../utils/icon';

const AssistantMessage = ({ message }) => {
  return (
    <View
      style={{
        backgroundColor: '#1F2025',
        borderRadius: 10,
        padding: 10,
        margin: 10,
        marginLeft: 35,
        alignSelf: 'flex-end',
      }}>
      <Text style={{ color: '#ffffff90', fontWeight: '500', fontSize: 18 }}>{message}</Text>
    </View>
  );
};

const UserMessage = ({ message }) => {
  return (
    <View
      style={{
        backgroundColor: '#E66642',
        borderRadius: 10,
        padding: 10,
        margin: 10,
        marginRight: 35,
        alignSelf: 'flex-start',
      }}>
      <Text style={{ color: '#fff', fontWeight: '500', fontSize: 18 }}>{message}</Text>
    </View>
  );
};

const GoalChat = ({ handleNext }) => {
  const dispatch = useDispatch();
  const width = useWindowDimensions().width;

  const [animatedWidth] = useState(new Animated.Value(width * 0.9));
  const state = useSelector((state) => state.user.onboardingState);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const scrollRef = useRef();

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

  const SendIcon = getIconFromLabel('send');

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

      // Let's just always grab the messages incase we have a new one
      messages = await retrieveMessages(thread.id);

      // Let's check if the latest message is from the user, if it is we need to respond
      const latestMessage = messages[messages.length - 1];

      if (latestMessage && latestMessage.role === 'user') {
        // We now need to respond to the user

        const motivations = state.motivations.join(', ');

        // If this is the first message of the conversation, lets instruct the assistant on the motivations set by the user
        const instructions = `The user has identified in a previous step that their motivations for using the app are ${motivations}. Given this is the start of the conversation, ask the user if they are interested in setting a specific goal related to one of their motivations, or if they want to set an endurance based goal. Remember, KEEP YOUR MESSAGES TO THE USER SHORT!`;
        runId = await run(thread.id, assistant.id, instructions);
      }

      dispatch(setOnboardingState({ ...state, ai: { assistant, thread, messages, runId } }));
    };

    setup();
  }, []);

  // Handles adding AI responses to the message thread
  useEffect(() => {
    // Whenever runId is not null there's a message to be added
    if (!state.ai.runId || !state.ai.thread) return;

    const intervalId = setInterval(async () => {
      const runResponse = await axios.get(
        `https://api.openai.com/v1/threads/${state.ai.thread.id}/runs/${state.ai.runId}`,
        config,
      );

      console.log(runResponse.data.status);

      // The set goal function is being called
      if (runResponse.data.status === 'requires_action') {
        const { tool_calls } = runResponse.data.required_action.submit_tool_outputs;
        const { arguments: args } = tool_calls[0].function;

        const { _goal } = JSON.parse(args);

        handleNext();
        dispatch(setOnboardingState({ ...state, goal: _goal }));
        clearInterval(intervalId);
      }

      if (runResponse.data.status === 'completed') {
        try {
          const messages = await retrieveMessages(state.ai.thread.id);
          dispatch(setOnboardingState({ ...state, ai: { ...state.ai, messages, runId: null } }));
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
    Animated.timing(animatedWidth, {
      toValue: isKeyboardVisible ? width * 0.98 : width * 0.9,
      duration: 300, // This is the duration of the animation
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
    }
  };

  return (
    <View style={{ ...styles.container, width }}>
      <Text style={styles.header}>
        Custom <Text style={{ color: '#E66642', fontWeight: '700' }}>Goal</Text>
      </Text>
      <Text style={styles.subHeader}>Chat with Sabio to set your goal</Text>
      <KeyboardAvoidingView behavior="padding">
        <GestureHandlerRootView style={{ flex: 1, alignItems: 'center' }}>
          <ScrollView
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            style={{ ...styles.scrollable, width: width * 0.9 }}>
            {state.ai.messages.map((message, index) => {
              if (message?.role === 'assistant') {
                return <AssistantMessage key={index} message={message.content[0].text.value} />;
              } else {
                return <UserMessage key={index} message={message.content[0].text.value} />;
              }
            })}
          </ScrollView>
        </GestureHandlerRootView>
        <Animated.View style={{ ...styles.inputContainer, width: animatedWidth }}>
          <TextInput multiline style={styles.input} value={userMessage} onChangeText={(text) => setUserMessage(text)} />
          <View style={{ height: '100%', width: 34 }}>
            <Pressable disabled={!canSend} style={{ ...styles.inputPressable }} onPress={handleSendUserMessage}>
              <Animated.View style={{ opacity }}>
                <SendIcon />
              </Animated.View>
            </Pressable>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default GoalChat;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  header: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 25,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  subHeader: {
    color: '#ffffff90',
    fontWeight: '500',
    fontSize: 18,
    marginHorizontal: 10,
    lineHeight: 25,
  },
  scrollable: {
    marginTop: 20,
  },
  inputContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2025',
    borderRadius: 20,
    padding: 7,
    paddingLeft: 15,
    paddingRight: 7,
    paddingBottom: 7,
    marginBottom: 90,
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
