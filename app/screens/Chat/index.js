import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { View, TouchableOpacity, useWindowDimensions, Animated, Keyboard } from 'react-native';
import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useKeyboard } from '@react-native-community/hooks';
import ArrowLeft from '../../assets/icons/24x/ArrowLeft';
import * as openai from '../../utils/openai';
import Send from '../../assets/icons/24x/Send';
import { useSelector } from "react-redux";
import call from "../../utils/call";
import AssistantMessage from "./AssistantMessage";
import UserMessage from "./UserMessage";
import TypingAnimation from "./TypingAnimation";

const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #16171b;
`;

const Header = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 50px;
`;

const HeaderText = styled.Text`
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.md};
  font-weight: ${(props) => props.theme.text.weight.bold};
  font-size: ${(props) => props.theme.text.size.md};
  color: ${(props) => props.theme.text.colors.white};
`;

const TypingAnimationContainer = styled.View`
  background-color: ${(props) => props.theme.colors.background2};
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
  margin-right: 30px;
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
  background-color: ${(props) => props.theme.colors.backgroundLight1};
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
  color: #f8f8f8;
  font-family: ${(props) => props.theme.text.family};
  font-size: ${(props) => props.theme.text.size.sm};
  font-weight: ${(props) => props.theme.text.weight.regular};
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
    const route = useRoute();
    const { day, week } = route.params;

    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const scrollRef = useRef();
    const keyboard = useKeyboard();
    const width = useWindowDimensions().width;

    const user = useSelector((state) => state.user.user);

    const [assistant, setAssistant] = useState(null);
    const [thread, setThread] = useState(null);
    const [messages, setMessages] = useState([]);

    const [isProcessing, setIsProcessing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [canSend, setCanSend] = useState(false);
    const [userMessage, setUserMessage] = useState('');
    const [requiresResponse, setRequiresResponse] = useState(false);
    const [responsePending, setResponsePending] = useState(false);
    const [runId, setRunId] = useState(null);

    const [animatedWidth] = useState(new Animated.Value(width * 0.9));
    const [animatedMargin] = useState(new Animated.Value(120));
    const [opacity] = useState(new Animated.Value(userMessage.split('').length > 0 ? 1 : 0.2));

    const clearState = () => {
        setAssistant(null);
        setThread(null);
        setMessages([]);
        setIsProcessing(false);
        setLoading(false);
        setCanSend(false);
        setUserMessage('');
        setRequiresResponse(false);
        setResponsePending(false);
    }

    useEffect(() => {
        if (!isFocused) {
            console.log('Resetting state')
            clearState();
        }
    }, [isFocused])


    const handleBack = () => {
        if (!isProcessing) {
            setIsProcessing(true);
            navigation.goBack();
            setTimeout(() => {
                setIsProcessing(false);
            }, 500);
        }
    };

    const handleError = ({ error }) => {
        console.log(error);
    };

    const setupAssistant = async () => {
        if (assistant) return assistant;
        const { response, error } = await openai.retrieveAssistant();

        if (response) return response;
        if (error) handleError({ error });
    };

    const setupThread = async () => {
        if (thread) return thread;
        // TODO: Check if this date has a threadId already
        const threadId = await call('GET', `users/getThreadByDate/${week.activities[0].date}/${user.id}/${week.activities[0].training_plan_id}`);

        if (threadId) {
            const { response, error } = await openai.retrieveThread(threadId);
            if (response) return response;
            if (error) handleError({ error });
        } else {
            const messages = JSON.stringify({ messages: [{ role: 'assistant', content: `Hey ${user.first_name}! How can I help you?` }] });
            const { response, error } = await openai.createThread(messages);

            if (response) {
                await call('POST', 'users/createConversation', { user_id: user.id, thread_id: response.id, training_plan_id: week.activities[0].training_plan_id, associated_date: week.activities[0].date });
                return response;
            }

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
            const _assistant = await setupAssistant();
            const _thread = await setupThread();
            const _messages = await setupMessages(_thread);

            // Update the state with the assistant, thread and messages
            setAssistant(_assistant);
            setThread(_thread);
            setMessages(_messages);

            // Get the most recent message
            const latestMessage = _messages[_messages.length - 1];

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
            const { response, error } = await openai.run(thread.id, assistant.id, day, week, user.id);

            if (error) handleError({ error });

            if (response) {
                // Save the id of the response
                setRunId(response.id);
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
            const { response, error } = await openai.retrieveRun(thread.id, runId);

            if (error) handleError({ error });
            if (!response) return;

            console.log(response.status);

            if (response.status === 'in_progress' || response.status === 'queued') {
                // If the response isn't ready yet, run the function again in 2 seconds
                timeoutId = setTimeout(_captureResponse, 2000);
            }

            if (response.status === 'completed') {
                const { response, error } = await openai.retrieveMessages(thread.id);
                if (error) handleError({ error });

                // Get rid of the typing animation
                setLoading(false);
                // Load new messages
                setMessages(response);

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
        await openai.addUserMessage(thread.id, userMessage);

        // Clear the user message
        setUserMessage('');

        // Retrieve the messages from the message thread
        const { error, response } = await openai.retrieveMessages(thread.id);

        if (error) handleError({ error });

        // Update the state with the new messages
        setMessages(response);

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
            <Header>
                <TouchableOpacity style={{ padding: 8 }} onPress={handleBack}>
                    <ArrowLeft />
                </TouchableOpacity>
                <View
                    style={{
                        flex: 1,
                        marginRight: 32,
                        alignItems: 'center',
                        textAlign: 'center'
                    }}>
                    <HeaderText>Chat with Sabio</HeaderText>
                </View>
            </Header>
            <StyledKeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
                <GestureHandlerRootView style={{ flex: 1, paddingTop: 20 }}>
                    <Animated.ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
                        {messages.map((message, index) => {
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
                <FooterContainer style={{ width: width - 40 }}>
                    <InputContainer style={{ width: animatedWidth, marginBottom: animatedMargin }}>
                        <StyledInput
                            multiline
                            value={userMessage}
                            onChangeText={(text) => setUserMessage(text)}
                            onSubmitEditing={handleSendUserMessage}
                            onKeyPress={(e) => {
                                if (e.nativeEvent.key === 'Enter') {
                                    e.p
                                    handleSendUserMessage();
                                    setUserMessage('');
                                }
                            }}
                            blurOnSubmit={false}
                        />
                        <View style={{ height: '100%', width: 34, }}>
                            <StyledPressable onPress={handleSendUserMessage}>
                                <Animated.View style={{ opacity, marginBottom: Keyboard.keyboardShown ? 0 : 5, paddingRight: 10 }}>
                                    <Send color={'#f8f8f8'} style={{ transform: [{ rotate: '40ddeg' }] }} />
                                </Animated.View>
                            </StyledPressable>
                        </View>
                    </InputContainer>
                </FooterContainer>
            </StyledKeyboardAvoidingView>
        </Container >
    )
}

export default Chat;