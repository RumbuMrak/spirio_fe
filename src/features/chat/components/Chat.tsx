import Button from '@/components/UI/button/Button';
import { cn } from '@/services/utils';
import { ChatCentered } from '@phosphor-icons/react';
import { useState, useEffect } from 'react';
import { useCreateChatClient, Chat, Channel, ChannelHeader, MessageInput, MessageList, Thread, Window } from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';
import s from './chat.module.css';
const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
const ChatComponent: (props: {
  token: string;
  chat_id: string;
  user: {
    id: string;
    name: string;
  };
}) => JSX.Element | null = ({ token, chat_id, user }) => {
  const [openChat, setOpenChat] = useState(false);
  const [channel, setChannel] = useState<any>();
  const userData: any = {
    id: user.id,
    name: user.name,
  };
  const client = useCreateChatClient({
    apiKey,
    tokenOrProvider: token,
    userData,
  });
  useEffect(() => {
    if (!client) return;
    const channel = client.channel('messaging', chat_id);
    client.connectUser(userData, token);
    setChannel(channel);
  }, [client]);
  if (!client) return null;
  return (
    <>
      <Button onClick={() => setOpenChat(!openChat)} color="gradient" className={cn('fixed bottom-8  !p-6', openChat ? 'right-[550px]' : 'right-8')}>
        <ChatCentered size={20} weight="bold" />
      </Button>
      <div className={cn(s.wrapper, 'fixed right-0 top-0 z-50 h-full w-[500px] overflow-auto', !openChat && 'hidden')}>
        <Chat client={client} theme="str-chat__grey800">
          <Channel channel={channel}>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput />
            </Window>
            <Thread />
          </Channel>
        </Chat>
      </div>
    </>
  );
};
export default ChatComponent;
