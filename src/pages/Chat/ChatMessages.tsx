import type { Message } from '../../types';


interface ChatMessagesProps {
  messages: Message[];
  chatEndRef: React.RefObject<HTMLDivElement | null>;
}

export const ChatMessages = ({ messages, chatEndRef }: ChatMessagesProps) => {
  return (
    <div className="chat-messages-container">
      {messages.map((msg) => (
        <div key={msg.id} className="chat-msg-row">
          <div className={`chat-msg-avatar ${msg.user?.avatar || 'avatar-1'}`}>
            {msg.user?.name ? msg.user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="chat-msg-content-box">
            <div className="chat-msg-meta">
              <span className="chat-msg-sender">{msg.user?.name || 'Teammate'}</span>
              <span className="chat-msg-time">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="chat-msg-text">{msg.text}</div>
          </div>
        </div>
      ))}
      <div ref={chatEndRef} />
    </div>
  );
};
