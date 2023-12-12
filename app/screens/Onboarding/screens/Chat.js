import React, { useEffect, useState, useRef, useCallback } from 'react';
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
  Modal,
  FlatList,
  Alert,
  Appearance,
} from 'react-native';
import styled from 'styled-components';
import { useTheme } from 'styled-components';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import { useKeyboard } from '@react-native-community/hooks';
import { useDispatch, useSelector } from 'react-redux';
import SafariView from 'react-native-safari-view';
import * as openai from '../../../utils/openai';
import { updateState } from '../../../stores/onboarding/onboardingSlice';
import { getIconFromLabel } from '../../../utils/icon';
import AssistantMessage from '../../../components/chat/AssistantMessage';
import UserMessage from '../../../components/chat/UserMessage';
import TypingAnimation from '../../../components/chat/TypingAnimation';
import backgroundDark from '../../../assets/background-chat-dark.png';
import backgroundLight from '../../../assets/background-chat-light.png';

import call from '../../../utils/call';

const StyledGestureHandlerRootView = styled(GestureHandlerRootView)`
  flex: 1;
  padding-top: ${(props) => props.theme.spacing.safeAreaView};
`;

const Chat = () => {
  const colorScheme = Appearance.getColorScheme();
  const scrollRef = useRef();
  const dispatch = useDispatch();
  const keyboard = useKeyboard();
  const width = useWindowDimensions().width;

  const threshold = 100;

  const session = useSelector((state) => state.user.session);
  const state = useSelector((state) => state.onboarding);

  const [isSetup, setIsSetup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSafari, setShowSafari] = useState(false);
  const [redirect, setRedirect] = useState(null);
  const [toolId, setToolId] = useState(null);
  const [toolOutput, setToolOutput] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [programmaticDismissal, setProgrammaticDismissal] = useState(false);
  const [shouldCompleteTool, setShouldCompleteTool] = useState(false);
  const [canSend, setCanSend] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [requiresResponse, setRequiresResponse] = useState(false);
  const [responsePending, setResponsePending] = useState(false);

  const [animatedWidth] = useState(new Animated.Value(width * 0.9));
  const [animatedMargin] = useState(new Animated.Value(120));
  const translateY = useRef(new Animated.Value(0)).current;
  const [opacity] = useState(new Animated.Value(userMessage.split('').length > 0 ? 1 : 0.2));

  const theme = useTheme();

  const LogoSmall = getIconFromLabel('logoSmall');
  const Send = getIconFromLabel('send');
  const HelpIcon = getIconFromLabel('help');

  // Handles setting up the assistant and thread & retrieving messages
  useEffect(() => {
    const setup = async () => {
      if (isSetup) return;

      let assistant = state.assistant;
      let thread = state.thread;
      let messages = state.messages;

      if (!state.assistant) {
        assistant = await openai.retrieveAssistant('onboarding', session.user.id);
      }

      if (!state.thread) {
        thread = await openai.createThread('onboarding', state.activity, session.user.id);
      }

      // Get the messages from the thread
      messages = await openai.retrieveMessages(thread.id, session.user.id);

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
      const response = await openai.retrieveRun(state.thread.id, state.runId, session.user.id);
      console.log('Retrieved response, status is:' + response.status);

      if (response.status === 'in_progress' || response.status === 'queued') {
        // If the response isn't ready yet, run the function again in 2 seconds
        timeoutId = setTimeout(_captureResponse, 2000);
      } else if (response.status === 'completed') {
        // Get the new messages from the message thread and save them
        const messages = await openai.retrieveMessages(state.thread.id, session.user.id);

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
        const { args, name, id } = openai.extractFunctionData(response, session.user.id);

        // Save the tool id so we can use it when getting the tool completion
        setToolId(id);

        if (name === 'connectSmartWatch') {
          if (args.toLowerCase().includes('strava')) {
            // Get and store the redirect url
            const redirect = await call('GET', `connect/getUrl/strava/${session.user.id}`);
            setRedirect(redirect);
            // Trigger opening the safari view
            setShowSafari(true);
          }
        }

        // TODO: The catch seems to fail here, need to investigate

        if (name === 'nextStep') {
          try {
            // Complete the onboarding process
            await call('POST', `users/completeOnboarding`, {
              data: args,
              id: session.user.id,
              threadId: state.thread.id,
            });

            // Update the state to move the user into the app
            dispatch(updateState({ onboarded: true }));
          } catch (error) {
            console.log('Error completing onboarding: ' + error.message);

            setToolOutput(
              "Error completing onboarding, you'll need to apologise to the user, tell them you've notified the team and ask them to reload the app and try again later on.",
            );

            setShouldCompleteTool(true);
          }
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

  // Handles opening the safari view when showSafrari is true
  useEffect(() => {
    if (!showSafari) return;

    SafariView.show({ url: redirect });
  }, [showSafari]);

  // Handles closing the safari view when the user has connected their watch
  useEffect(() => {
    let timeoutId = null;

    const _captureResponse = async () => {
      if (!showSafari) return;

      try {
        // Retrieve the connections from the backend
        const response = await call('GET', `connect/list/${session.user.id}`);

        if (response.length === 0) {
          // If the user hasn't connected their watch, run the function again in 2 seconds
          timeoutId = setTimeout(_captureResponse, 2000);
        } else {
          // If the user has connected their watch, close the safari view
          SafariView.dismiss();
          // So we know we auto closed the safari view
          setProgrammaticDismissal(true);

          // If the user has connected their watch, complete the tool
          setToolOutput('User has connected their smart tracker successfully.');
          setShouldCompleteTool(true);
        }
      } catch (error) {
        console.log("Error retrieving user's connections" + error.message);
        // If there was an error connecting the user to their smart tracker, complete the tool
        setToolOutput('Error connecting user to smart tracker.');
        setShouldCompleteTool(true);
      }
    };

    _captureResponse();

    // Cleanup function to clear the timeout when the component unmounts or before the useEffect runs again
    return () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, [showSafari]);

  // Handles the user manually closing the safari view
  const handleSafariViewDismiss = async () => {
    // If the dismissal was done by the user
    if (!programmaticDismissal) {
      // Retrieve the connections from the backend
      const response = await call('GET', `connect/list/${session.user.id}`);

      if (response.length === 0) {
        // If the user hasn't connected their watch, complete the tool
        setToolOutput(
          'User cancelled the safari view allowing them to connect their smart tracker. No smart tracker has been connected, you need to ask the user to connect something before continuing.',
        );
        setShouldCompleteTool(true);
      } else {
        // If the user has connected their watch, complete the tool
        setToolOutput('User has connected their smart tracker successfully.');
        setShouldCompleteTool(true);
      }
    }

    // Scroll to the bottom of the chat
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);

    setShowSafari(false);
    setProgrammaticDismissal(false); // Reset the dismissal flag
  };

  // Event listener to handle user manually closing the safari view
  useEffect(() => {
    SafariView.addEventListener('onDismiss', handleSafariViewDismiss);

    // return () => {
    //   // Remove event listener on cleanup if there is one
    //   if (SafariView.removeEventListener) {
    //     SafariView.removeEventListener('onDismiss', handleSafariViewDismiss);
    //   }
    // };
  }, []);

  // Handles completing the tool
  useEffect(() => {
    const _completeTool = async () => {
      if (!shouldCompleteTool) return;

      // Complete the tool
      await openai.submitToolResponse(state.thread.id, state.runId, toolId, toolOutput, session.user.id);

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
    await openai.addUserMessage(state.thread.id, userMessage, session.user.id);

    // Clear the user message
    setUserMessage('');

    // Retrieve the messages from the message thread
    const messages = await openai.retrieveMessages(state.thread.id, session.user.id);

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

  const handleHelp = () => {
    setModalOpen(true);
  };

  const handleGestureEvent = useCallback(
    Animated.event(
      [
        {
          nativeEvent: {
            translationY: translateY,
          },
        },
      ],
      { useNativeDriver: true },
    ),
    [],
  );

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      let { translationY } = event.nativeEvent;

      if (translationY > threshold) {
        setModalOpen(false);
        translateY.setValue(0);
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          speed: 14,
          bounciness: 12,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const handleContactSupport = async () => {
    Alert.alert('Contact Support', 'Please email help@heysabio.com', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', marginVertical: 2 }}>
      <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#737476', marginRight: 4 }} />
      <Text style={{ color: '#737476', fontSize: 15, fontWeight: '600', marginLeft: 5 }}>{item}</Text>
    </View>
  );

  const CONSTRAINTS = [
    'The goal must be quantifiable',
    'The plan must be atleast a month long',
    'The plan must be at most a year long',
    'Access to a smart tracker is required',
  ];

  return (
    <View style={{ ...styles.container, backgroundColor: theme.colors.chatBackground }}>
      <ImageBackground
        source={colorScheme === 'light' ? backgroundLight : backgroundDark}
        resizeMode="cover"
        style={styles.background}>
        <KeyboardAvoidingView behavior="padding">
          <StyledGestureHandlerRootView>
            <Animated.ScrollView
              ref={scrollRef}
              showsVerticalScrollIndicator={false}
              style={{
                ...styles.scrollable,
              }}>
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
              minHeight: 63,
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
        <Modal style={styles.modal} animationType="slide" transparent={true} visible={modalOpen}>
          <View style={styles.modal}>
            <View style={{ height: 250 }} />
            <PanGestureHandler onGestureEvent={handleGestureEvent} onHandlerStateChange={onHandlerStateChange}>
              <Animated.View style={{ ...styles.modalContent, transform: [{ translateY }] }}>
                <View style={styles.modalTop}>
                  <View style={styles.line} />
                </View>
                <View style={styles.modalBody}>
                  <View>
                    <Text style={styles.modalTitle}>Chatting with Sabio</Text>
                    <Text style={styles.modalText}>
                      Sabio's goal for this conversation is to understand a quantifiable and timebound fitness goal that
                      he can help you work towards.
                    </Text>
                    <Text style={styles.modalText}>
                      There are a few constaints that Sabio has to work within, these are listed below:
                    </Text>
                    <FlatList style={{ marginTop: 20 }} data={CONSTRAINTS} renderItem={renderItem} />
                    <Text style={styles.modalText}>
                      If this app is behaving unexpectedly, please reload the app to reset the conversation.
                    </Text>
                    <Pressable onPress={handleContactSupport} style={styles.pressable}>
                      <Text style={styles.pressableText}>Contact Support</Text>
                    </Pressable>
                  </View>
                </View>
              </Animated.View>
            </PanGestureHandler>
          </View>
        </Modal>
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
