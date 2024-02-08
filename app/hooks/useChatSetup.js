// useChatSetup.js
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from 'react-native';
import * as openai from '../utils/openai';
import call from '../utils/call';
import { updateState } from '../stores/chat/chatSlice';

const useChatSetup = ({ isFocused, scrollRef }) => {
  const dispatch = useDispatch();
  const session = useSelector((state) => state.user.session);
  const state = useSelector((state) => state.chat);
  const [loading, setLoading] = useState(false);
  const [requiresResponse, setRequiresResponse] = useState(false);
  const [responsePending, setResponsePending] = useState(false);

  useEffect(() => {
    const setup = async () => {
      if (!isFocused) return;

      setLoading(true);

      let { assistant, thread } = state;

      if (!assistant) {
        assistant = await openai.retrieveAssistant('main', session.user?.id);
      }

      if (!thread) {
        try {
          if (session.user?.threadId) {
            thread = await openai.retrieveThread(session.user.threadId, session.user?.id);
          } else {
            thread = await openai.createThread('main', state.activity, session.user?.id);
            await call('POST', 'users/update', { userId: session.user?.id, data: { threadId: thread.id } });
          }
        } catch (error) {
          Alert.alert('Error', 'There was an issue setting up the chat. Please try again.');
          console.error(error);
          setLoading(false);
          return;
        }
      }

      const messages = await openai.retrieveMessages(thread.id, session.user?.id);

      dispatch(updateState({ ...state, assistant, thread, messages }));

      const latestMessage = messages[messages.length - 1];
      if (latestMessage?.role === 'user') {
        setRequiresResponse(true);
      }

      setLoading(false);
      scrollRef.current?.scrollToEnd({ animated: true });
    };

    setup();
  }, [isFocused, dispatch, session.user?.id, state]);

  return { loading, requiresResponse, setRequiresResponse, responsePending, setResponsePending };
};

export default useChatSetup;
