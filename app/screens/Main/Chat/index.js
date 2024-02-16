import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { View, useWindowDimensions, Animated, ImageBackground, useColorScheme, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { useKeyboard } from '@react-native-community/hooks';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import call from '../../../utils/call';
import * as openai from '../../../utils/openai';
import { getIconFromLabel } from '../../../utils/icon';
import UserMessage from '../../../components/chat/UserMessage';
import { updateState } from '../../../stores/chat/chatSlice';
import AssistantMessage from '../../../components/chat/AssistantMessage';
import TypingAnimation from '../../../components/chat/TypingAnimation';
import BackgroundLight from '../../../assets/background-chat-light.png';
import BackgroundDark from '../../../assets/background-chat-dark.png';
import { useMixpanel } from '../../../hooks/useMixpanel';

const Container = styled.View`
  flex: 1;
  align-items: center;
  background-color: #0f1013;
  background-color: ${(props) => props.theme.colors.chatBackground};
`;

const TypingAnimationContainer = styled.View`
  background-color: ${(props) => props.theme.text.chatMessage.backgroundAssistant};
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
  margin-right: 30px;
  margin-left: 30px;
  align-self: flex-start;
  width: 65px;
`;

const FooterContainer = styled(Animated.View)`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  min-height: 63px;
  padding-top: 10px;
`;

const InputContainer = styled(Animated.View)`
  background-color: ${(props) => props.theme.text.chatMessage.inputBackground};
  border-radius: 20px;
  padding: 7px;
  padding-left: 15px;
  padding-right: 7px;
  padding-bottom: 7px;
  flex-direction: row;
  align-items: center;
`;

const StyledInput = styled.TextInput`
  flex: 1;
  color: ${(props) => props.theme.text.colors.secondary};
  font-size: 16px;
  font-weight: 400;
  padding: 0;
  margin: 0;
  margin-bottom: 3px;
  max-height: 70px;
`;

const StyledPressable = styled.Pressable`
  position: absolute;
  bottom: 0;
  right: 0;
  shadowcolor: #000;
  shadowoffset: 0px 10px;
  shadowopacity: 0.3;
  shadowradius: 11px;
  elevation: 10;
`;

const StyledKeyboardAvoidingView = styled.KeyboardAvoidingView``;

const Chat = () => {
  const colorScheme = useColorScheme();

  const isFocused = useIsFocused();

  const { track } = useMixpanel();

  const scrollRef = useRef();
  const dispatch = useDispatch();
  const keyboard = useKeyboard();
  const width = useWindowDimensions().width;
  const [loading, setLoading] = useState(false);
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

  const handleError = ({ error }) => {
    track('ERROR', { screen: 'Main chat', error });
    // Tell the user of the issue
    // reset their chat state and rerun the setup function
  };

  const setupAssistant = async () => {
    if (state.assistant) return state.assistant;
    const { response, error } = await openai.retrieveAssistant('main', session.user?.id);

    if (response) return response;
    if (error) handleError({ error });
  };

  const setupThread = async () => {
    if (state.thread) return state.thread;
    let threadId = session.user?.threadId;

    if (threadId) {
      const { response, error } = await openai.retrieveThread(threadId, session.user?.id);
      if (response) return response;
      if (error) handleError({ error });
    } else {
      const { response, error } = await openai.createThread('main', session.user?.id);
      if (response) return response;
      if (error) handleError({ error });
    }
  };

  const setupMessages = async (thread) => {
    if (!thread) return [];
    const { response, error } = await openai.retrieveMessages(thread.id);
    if (response) return response;
    if (error) handleError({ error });
  };

  // Handles setting up the assistant and thread & retrieving messages
  useEffect(() => {
    const setup = async () => {
      track('SCREEN_VIEW', { screen: 'Main chat' });
      const assistant = await setupAssistant();
      const thread = await setupThread();
      const messages = await setupMessages(thread);

      // Update the state with the assistant, thread and messages
      dispatch(updateState({ ...state, assistant, thread, messages }));

      // Get the most recent message
      const latestMessage = messages[messages.length - 1];

      // If the most recent message is from the user trigger an AI response
      if (latestMessage?.role === 'user') setRequiresResponse(true);
      if (latestMessage?.role === 'assistant') setCanSend(true);
    };

    setup();
  }, [isFocused]);

  // Handles initialising the response from the AI to a new user message
  useEffect(() => {
    const _run = async () => {
      // If no response is required, then don't run
      if (!requiresResponse) return;

      // Set loading to true to show the loading indicator
      setLoading(true);

      // Initialise a response from the AI
      const { response, error } = await openai.run(state.thread.id, state.assistant.id, session.user?.id);

      if (error) handleError({ error });

      if (response) {
        track('APP_ACTION', { action: 'AI response initialised', screen: 'Main chat' });
        // Save the id of the response
        dispatch(updateState({ ...state, runId: response.id }));

        // Tell the component that a response is no longer required
        setRequiresResponse(false);

        // Tell the component that a response is pending
        setResponsePending(true);
      }
    };

    _run();
  }, [requiresResponse]);

  // Handles capturing the response and adding it to the message thread.
  useEffect(() => {
    let timeoutId = null;

    const _captureResponse = async () => {
      if (!responsePending) return;

      // Retrieve the response from the AI
      const { response, error } = await openai.retrieveRun(state.thread.id, state.runId, session.user?.id);

      if (error) handleError({ error });
      if (!response) return;

      console.log(response.status);
      track('APP_ACTION', { action: 'AI response retrieved', status: response.status, screen: 'Main chat' });

      if (response.status === 'in_progress' || response.status === 'queued') {
        // If the response isn't ready yet, run the function again in 2 seconds
        timeoutId = setTimeout(_captureResponse, 2000);
      }

      if (response.status === 'completed') {
        const { response, error } = await openai.retrieveMessages(state.thread.id, session.user?.id);
        if (error) handleError({ error });

        // Get rid of the typing animation
        setLoading(false);
        // Load new messages
        dispatch(updateState({ messages: response }));

        // Scroll to the bottom of the chat so the user can see the new message
        setTimeout(() => {
          scrollRef.current?.scrollToEnd({ animated: true });
        }, 100);

        // Set canSend true to enable the user to send a new message
        setCanSend(true);

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

  // Handles sending user message to the assistant
  const handleSendUserMessage = async () => {
    if (!userMessage) return;
    if (!canSend) return;

    // Stop the user from sending a message while the AI is responding
    setCanSend(false);

    // Add the user message to the message thread
    await openai.addUserMessage(state.thread.id, userMessage, session.user?.id);

    track('USER_ACTION', { action: 'User message sent', screen: 'Main chat' });

    // Clear the user message
    setUserMessage('');

    // Retrieve the messages from the message thread
    const { error, response } = await openai.retrieveMessages(state.thread.id, session.user?.id);

    if (error) handleError({ error });

    // Update the state with the new messages
    dispatch(updateState({ messages: response }));

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
      toValue: keyboard.keyboardShown ? 5 : 10,
      duration: 200,
      useNativeDriver: false,
    }).start();
    Animated.timing(animatedWidth, {
      toValue: keyboard.keyboardShown ? width * 0.98 : width * 0.95,
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
    <Container>
      <ImageBackground
        source={colorScheme === 'light' ? BackgroundLight : BackgroundDark}
        resizeMode="cover"
        style={{ flex: 1 }}>
        <StyledKeyboardAvoidingView behavior="padding">
          <GestureHandlerRootView style={{ flex: 1, paddingTop: 60 }}>
            <Animated.ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
              {state.messages.map((message, index) => {
                if (message?.role === 'assistant') {
                  return <AssistantMessage key={index} message={message.content[0].text.value} />;
                } else {
                  return <UserMessage key={index} message={message.content[0].text.value} />;
                }
              })}
              {loading && (
                <TypingAnimationContainer>
                  <TypingAnimation />
                </TypingAnimationContainer>
              )}
            </Animated.ScrollView>
          </GestureHandlerRootView>
          <FooterContainer style={{ width }}>
            <InputContainer style={{ width: animatedWidth, marginBottom: animatedMargin }}>
              <StyledInput multiline value={userMessage} onChangeText={(text) => setUserMessage(text)} />
              <View style={{ height: '100%', width: 34 }}>
                <StyledPressable onPress={handleSendUserMessage}>
                  <Animated.View style={{ opacity }}>
                    <Send />
                  </Animated.View>
                </StyledPressable>
              </View>
            </InputContainer>
          </FooterContainer>
        </StyledKeyboardAvoidingView>
      </ImageBackground>
    </Container>
  );
};

export default Chat;
