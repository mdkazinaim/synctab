import { useState, useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import type { Message } from '../../types';

import { ChatSidebar } from './ChatSidebar';
import { ChatMessages } from './ChatMessages';

interface ChatPageProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
}

export const ChatPage = ({ messages, onSendMessage }: ChatPageProps) => {
  const [chatMessage, setChatMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    onSendMessage(chatMessage.trim());
    setChatMessage('');
  };

  return (
    <div className="chat-page-container">
      <ChatSidebar />

      <div className="chat-main-area">
        <div className="chat-main-header">
          <div>
            <span style={{ fontSize: '14px', fontWeight: 800 }}># general-workspace</span>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Welcome to the team coordination channel
            </p>
          </div>
        </div>

        <ChatMessages messages={messages} chatEndRef={chatEndRef} />

        <form onSubmit={handleSubmit} className="chat-page-input-wrapper">
          <input
            type="text"
            className="chat-page-input"
            placeholder="Send a message to #general-workspace..."
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
          />
          <button type="submit" className="chat-page-send-btn">
            Send <ChevronRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
export default ChatPage;
