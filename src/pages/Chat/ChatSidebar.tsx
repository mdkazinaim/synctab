export const ChatSidebar = () => {
  return (
    <div className="chat-channel-sidebar">
      <h3 style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '-0.3px', margin: '4px 0 10px 0' }}>
        Workspace Channels
      </h3>
      <div className="chat-channel-list">
        <button className="chat-channel-item active">
          # general-workspace
        </button>
        <button className="chat-channel-item" disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>
          # announcements
        </button>
        <button className="chat-channel-item" disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>
          # links-sharing
        </button>
      </div>
    </div>
  );
};
