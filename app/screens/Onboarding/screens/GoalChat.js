import React, { useEffect, useState } from 'react';
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
import { retrieveAssistant, createThread, retrieveMessages, run, config } from '../../../utils/openai';
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

const GoalChat = () => {
  const dispatch = useDispatch();
  const width = useWindowDimensions().width;

  const [animatedWidth] = useState(new Animated.Value(width * 0.9));
  const state = useSelector((state) => state.user.onboardingState);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true); // or some other action
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false); // or some other action
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const SendIcon = getIconFromLabel('send');

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

  useEffect(() => {
    // Whenever runId is not null there's a message to be added
    if (!state.ai.runId || !state.ai.thread) return;

    const intervalId = setInterval(async () => {
      const runResponse = await axios.get(
        `https://api.openai.com/v1/threads/${state.ai.thread.id}/runs/${state.ai.runId}`,
        config,
      );

      console.log(runResponse.data.status);

      if (runResponse.data.status === 'completed') {
        const messages = await retrieveMessages(state.ai.thread.id);
        dispatch(setOnboardingState({ ...state, ai: { ...state.ai, messages, runId: null } }));
        clearInterval(intervalId);
      }
    }, 500);
  }, [state.ai.runId]);

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: isKeyboardVisible ? width * 0.98 : width * 0.9,
      duration: 300, // This is the duration of the animation
      useNativeDriver: false, // Set to true if you are only animating non-layout properties
    }).start();
  }, [isKeyboardVisible, width]);

  const [userMessage, setUserMessage] = useState('');
  const [opacity] = useState(new Animated.Value(userMessage.split('').length > 0 ? 1 : 0.2));

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: userMessage.split('').length > 0 ? 1 : 0.2,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [userMessage]);

  return (
    <View style={{ ...styles.container, width }}>
      <Text style={styles.header}>
        Custom <Text style={{ color: '#E66642', fontWeight: '700' }}>Goal</Text>
      </Text>
      <Text style={styles.subHeader}>Chat with Sabio to set your goal</Text>
      <KeyboardAvoidingView behavior="padding">
        <GestureHandlerRootView style={{ flex: 1, alignItems: 'center' }}>
          <ScrollView showsVerticalScrollIndicator={false} style={{ ...styles.scrollable, width: width * 0.9 }}>
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
            <Pressable style={{ ...styles.inputPressable }}>
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
