import { useEffect, useRef, useState } from "react";

const Chat = ({chatHistory, sendMessage, localParticipant}) => {
    const chatWindowRef = useRef();
    const [newMessage, setNewMessage] = useState('');
    const isLocalUser = (id) => id === localParticipant.user_id;
    useEffect(() => {
        if (chatWindowRef.current) {
          chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
      }, [chatHistory?.length]);
    return (
        <>
            <div className="messages-container overflow-auto h-[14rem]" ref={chatWindowRef}>
        {chatHistory.map((chatItem) => (
          <div
            className={isLocalUser(chatItem.senderID) ? 'message local' : 'message'}
            key={chatItem.id}
          >
            <span className="content">{chatItem.message}</span>
            <span className="sender">{chatItem.sender}</span>
          </div>
        ))}
      </div>
      <form onSubmit={(e) => {
        e.preventDefault();
        sendMessage(newMessage);
        setNewMessage('');
      }}>
        <footer className="chat-footer ">
          <input
          className="appearance-none block w-full mt-4 mb-4 mr-4 bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            value={newMessage}
            placeholder="Type message here"
            variant="transparent"
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            className="block mb-4 mt-4 px-3 py-2 text-xs  font-bold no-underline hover:shadow bg-green-600 text-white"
            variant="transparent"
            disabled={!newMessage}
            type="submit"
          >
            Send
          </button>
        </footer>
      </form>
      <style jsx>{`
        .messages-container {
          flex: 1;
        }

        .message {
          margin: var(--spacing-xxs);
          padding: var(--spacing-xxs);
          background: var(--gray-wash);
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
        }

        .message.local {
          background: var(--gray-light);
        }

        .message.local .sender {
          color: var(--primary-dark);
        }

        .content {
          color: var(--text-mid);
          display: block;
        }

        .sender {
          font-weight: var(--weight-medium);
          font-size: 0.75rem;
        }

        .chat-footer {
          flex-flow: row nowrap;
          box-sizing: border-box;
          display: flex;
          position: relative;
          border-top: 1px solid var(--gray-light);
        }

        .chat-footer :global(.input-container) {
          flex: 1;
        }

        .chat-footer :global(.input-container input) {
          padding-right: 0px;
        }

        .chat-footer :global(.send-button) {
          padding: 0 var(--spacing-xs);
        }
      `}</style>
        </>
    )
}
export default Chat;