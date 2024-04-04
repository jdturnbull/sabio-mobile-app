import React, { useEffect, useState, useRef } from 'react';
import { View, useWindowDimensions, Animated, ImageBackground, Alert, Appearance } from 'react-native';
import styled from 'styled-components';
import { useTheme } from 'styled-components';
import PushNotification from 'react-native-push-notification';
import DeviceInfo from 'react-native-device-info';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
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
import { useMixpanel } from '../../hooks/useMixpanel';

const StyledGestureHandlerRootView = styled(GestureHandlerRootView)`
  flex: 1;
`;

const Container = styled.View`
  flex: 1;
  align-items: center;
  background-color: ${(props) => props.theme.colors.chatBackground};
`;

const LogoutContainer = styled.View`
  margin-top: 50px;
  height: 50px;
  padding-horizontal: 20px;
  display: flex;
  justify-content: center;
`;

const AnimationContainer = styled.View`
  background-color: ${(props) => props.theme.text.chatMessage.backgroundAssistant};
  border-radius: 18px;
  border-top-left-radius: 0;
  padding: 15px;
  margin-bottom: 20px;
  margin-left: 28px;
  margin-right: 45px;
  align-self: flex-start;
`;

const FooterContainer = styled(Animated.View)`
  align-items: center;
  justify-content: flex-end;
  min-height: 50px;
  padding-top: 10px;
`;

const InputContainer = styled(Animated.View)`
  display: flex;
  flex-direction: row;
  align-items: center;
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
  font-family: ${(props) => props.theme.text.family};
  font-size: 16px;
  font-weight: 400;
  padding: 0;
  margin: 0;
  margin-bottom: 3px;
  max-height: 70px;
`;

const InputPressable = styled.Pressable`
  position: absolute;
  bottom: 0;
  right: 0;
  shadowcolor: #000;
  shadowoffset: 0px 10px;
  shadowopacity: 0.3;
  shadowradius: 11px;
  elevation: 10;
`;

const LogoutPressable = styled.Pressable``;

const KeyboardAvoidingView = styled.KeyboardAvoidingView``;

const NextButton = styled.Pressable`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const NextText = styled.Text`
  color: ${(props) => props.theme.colors.primary};
  font-family: ${(props) => props.theme.text.family};
  font-size: 16px;
  font-weight: 600;
  margin-right: 10px;
`;

const Chat = () => {
  const colorScheme = Appearance.getColorScheme();
  const scrollRef = useRef();
  const dispatch = useDispatch();
  const { track } = useMixpanel();
  const keyboard = useKeyboard();
  const width = useWindowDimensions().width;
  const navigation = useNavigation();

  const session = useSelector((state) => state.user.session);
  const state = useSelector((state) => state.onboarding);

  const [loading, setLoading] = useState(false);
  const [toolOutputs, setToolOutputs] = useState([]);
  const [shouldCompleteTool, setShouldCompleteTool] = useState(false);
  const [canSend, setCanSend] = useState(false);
  const [userMessage, setUserMessage] = useState('');

  useEffect(() => {
    // Request permission for notifications on component mount
    PushNotification.requestPermissions().then(async (response) => {
      const token = await AsyncStorage.getItem('deviceToken');

      const deviceToken = session.user.deviceToken ? session.user.deviceToken : token;

      await call('POST', 'users/update', {
        userId: session.user.id,
        data: { notificationsEnabled: response.alert, deviceToken },
      });
    });
  }, []);

  // Maybe use this to show a button if the app doesn't auto redirect?
  const [showNext, setShowNext] = useState(false);

  const [requiresResponse, setRequiresResponse] = useState(false);
  const [responsePending, setResponsePending] = useState(false);

  const [animatedWidth] = useState(new Animated.Value(width * 0.9));
  const [animatedMargin] = useState(new Animated.Value(120));

  const [opacity] = useState(new Animated.Value(userMessage.split('').length > 0 ? 1 : 0.2));

  const theme = useTheme();

  const Send = getIconFromLabel('send');

  useEffect(() => {
    track('SCREEN_VIEW', { screen: 'Onboarding chat' });
  }, []);

  useEffect(() => {
    if (session.user.onboardingData) {
      track('APP_ACTION', { action: 'Navigating to Finalise', screen: 'Onboarding chat', location: 'useEffect' });
      setShowNext(true);
      navigation.navigate('Finalise');
    }
  }, []);

  const handleError = ({ error }) => {
    track('ERROR', { screen: 'Onboarding Chat', error: error });
    console.log(error.message);
  };

  const setupAssistant = async () => {
    if (state.assistant) return state.assistant;
    const { response, error } = await openai.retrieveAssistant('onboarding');

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
      const { response, error } = await openai.createThread('onboarding', session.user?.id);
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
      track('SCREEN_VIEW', { screen: 'Onboarding chat' });
      const assistant = await setupAssistant();
      const thread = await setupThread();
      const messages = await setupMessages(thread);

      // Update the state with the assistant, thread and messages
      dispatch(updateState({ ...state, assistant, thread, messages }));

      track('APP_ACTION', { action: 'Onboarding chat setup', screen: 'Onboarding chat' });

      // Get the most recent message
      const latestMessage = messages[messages.length - 1];

      // If the most recent message is from the user trigger an AI response
      if (latestMessage?.role === 'user') setRequiresResponse(true);
      if (latestMessage?.role === 'assistant') setCanSend(true);
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
      const { response, error } = await openai.run(state.thread.id, state.assistant.id, session.user?.id);

      if (error) handleError({ error });

      if (response) {
        track('APP_ACTION', { action: 'AI response initialised', screen: 'Onboarding chat' });
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

      console.log('Retrieved response, status is:' + response.status);

      track('APP_ACTION', { action: 'AI response retrieved', status: response.status, screen: 'Onboarding chat' });

      if (response.status === 'in_progress' || response.status === 'queued') {
        // If the response isn't ready yet, run the function again in 2 seconds
        timeoutId = setTimeout(_captureResponse, 2000);
      } else if (response.status === 'completed') {
        // Get the new messages from the message thread and save them
        const { response, error } = await openai.retrieveMessages(state.thread.id, session.user?.id);

        if (error) handleError({ error });

        // Set loading to false to remove the loading indicator
        setLoading(false);

        // Update the state with the new messages
        dispatch(updateState({ messages: response }));

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
              track('APP_ACTION', { action: 'Called next step function', screen: 'Onboarding chat' });

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
                track('APP_ACTION', {
                  action: 'Navigating to Finalise',
                  screen: 'Onboarding chat',
                  location: 'Function call',
                });

                setShowNext(true);

                navigation.navigate('Finalise');
              }, 1000);
            } catch (error) {
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
        handleError({ error });
      } else {
        track('APP_ACTION', { action: 'Tool output submitted', screen: 'Onboarding chat' });

        // Clear tool outputs
        setToolOutputs([]);

        // Tell the component that the tool no longer needs to be completed
        setShouldCompleteTool(false);

        // Tell the component a response is pending
        setResponsePending(true);
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

    track('USER_ACTION', { action: 'User message sent', screen: 'Onboarding chat' });

    // Clear the user message
    setUserMessage('');

    // Retrieve the messages from the message thread
    const { response, error } = await openai.retrieveMessages(state.thread.id, session.user?.id);

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
    track('USER_ACTION', { action: 'User pressed logout', screen: 'Onboarding chat' });
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
            track('USER_ACTION', { action: 'User logged out', screen: 'Onboarding chat' });
            await AsyncStorage.removeItem('session');
            dispatch(setup());
          },
        },
      ],
      { cancelable: false },
    );
  };

  const NextIcon = getIconFromLabel('next');

  return (
    <Container>
      <ImageBackground
        source={colorScheme === 'light' ? backgroundLight : backgroundDark}
        resizeMode="cover"
        style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior="padding">
          <StyledGestureHandlerRootView>
            <Animated.ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
              <LogoutContainer>
                <LogoutPressable onPress={logout}>
                  <Logout color={theme.text.colors.secondary} />
                </LogoutPressable>
              </LogoutContainer>
              {state.messages.map((message, index) => {
                if (message?.role === 'assistant') {
                  return <AssistantMessage key={index} message={message.content[0].text.value} />;
                } else {
                  return <UserMessage key={index} message={message.content[0].text.value} />;
                }
              })}
              {loading && (
                <AnimationContainer>
                  <TypingAnimation />
                </AnimationContainer>
              )}
            </Animated.ScrollView>
          </StyledGestureHandlerRootView>
          <FooterContainer style={{ width }}>
            {!showNext ? (
              <InputContainer style={{ width: animatedWidth, marginBottom: animatedMargin }}>
                <StyledInput multiline value={userMessage} onChangeText={(text) => setUserMessage(text)} />
                <View style={{ height: '100%', width: 34 }}>
                  <InputPressable onPress={handleSendUserMessage}>
                    <Animated.View style={{ opacity }}>
                      <Send />
                    </Animated.View>
                  </InputPressable>
                </View>
              </InputContainer>
            ) : (
              <InputContainer
                style={{
                  width: animatedWidth,
                  marginBottom: animatedMargin,
                  backgroundColor: 'transparent',
                  justifyContent: 'flex-end',
                }}>
                <NextButton onPress={() => navigation.navigate('Finalise')}>
                  <NextText>Next screen</NextText>
                  <NextIcon />
                </NextButton>
              </InputContainer>
            )}
          </FooterContainer>
        </KeyboardAvoidingView>
      </ImageBackground>
    </Container>
  );
};

export default Chat;
