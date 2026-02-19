import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../../hooks/useAuth';
import { Send, Image as ImageIcon, X, Lock } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { useToast } from '../../hooks/useToast';

const ENDPOINT = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

const ChatBox = ({ conversationId, orderId, receiverName, receiverId, isReadOnly = false }) => {
  const { user } = useAuth();
  const { showError } = useToast();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState(conversationId);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const isLocked = isReadOnly;
  const effectiveId = conversationId || orderId;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!effectiveId) return;

    // Fetch previous messages
    const fetchMessages = async () => {
      try {
        console.log('Fetching messages for id:', effectiveId);
        const data = await axiosClient.get(`/messages/${effectiveId}`);
        console.log('Fetched messages data:', data);
        if (data && data.success) {
          setMessages(data.messages);
          // Update active conversation ID if backend returns it (normalized)
          if (data.conversationId) {
            setActiveConversationId(data.conversationId);
          } else if (conversationId) {
            setActiveConversationId(conversationId);
          }
        } else {
          console.error('Invalid message data received:', data);
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    fetchMessages();

    // Connect to Socket.io
    const newSocket = io(ENDPOINT);
    setSocket(newSocket);

    // We need to join the room. If we don't have the real conversationId yet (e.g. using orderId), 
    // we might need to wait or the backend might handle joining by orderId? 
    // Ideally we join by conversationId. 
    // If fetchMessages returns the real ID, we should use that. 
    // But this effect runs on mount. socket.emit might happen before fetch returns.
    // Let's rely on backend resolving orderId -> conversationId for the initial GET, 
    // but for socket, we really want the conversation ID room.
    // We can emit 'join_conversation' inside fetchMessages or use a separate effect that depends on activeConversationId.

    // For now, let's keep it here but assume we might need to rejoin if ID changes?
    // Actually, let's move socket logic to a separate effect that depends on activeConversationId.

    return () => {
      newSocket.disconnect();
    };
  }, [effectiveId]);

  useEffect(() => {
    if (!socket || !activeConversationId) return;

    socket.emit('join_conversation', activeConversationId);

    const handleReceiveMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [socket, activeConversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showError('Image size should be less than 5MB');
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && !image) || !socket || isLocked) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      if (newMessage.trim()) formData.append('content', newMessage);
      if (image) formData.append('image', image);

      // Save to DB via HTTP (handles upload)
      const targetId = activeConversationId || effectiveId;
      const response = await axiosClient.post(`/messages/${targetId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const savedMessage = response.message;

      // Emit to socket with full message data (including image URL)
      const messageData = {
        ...savedMessage,
        sender: {
          _id: user._id,
          name: user.name,
          profilePicture: user.profilePicture,
        },
      };

      socket.emit('send_message', messageData);

      // Optimistic update not needed as we wait for DB response which is fast enough for images
      // or we can append manually if needed, but socket broadcast handles it for others
      // For self, we can append it:
      // setMessages(prev => [...prev, messageData]); 

      setNewMessage('');
      removeImage();
    } catch (error) {
      console.error('Failed to send message:', error);
      showError('Failed to send message');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center">
          <span className={`w-2 h-2 rounded-full mr-2 ${isLocked ? 'bg-red-500' : 'bg-green-500'}`}></span>
          Chat with {receiverName}
        </h3>
        {isLocked && (
          <span className="text-xs text-red-500 flex items-center bg-red-50 px-2 py-1 rounded">
            <Lock size={12} className="mr-1" />
            Locked
          </span>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, index) => {
          const isOwn = msg.sender?._id === user._id || msg.sender === user._id;

          return (
            <div
              key={index}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 shadow-sm ${isOwn
                  ? 'bg-primary-600 text-white rounded-tr-none'
                  : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
                  }`}
              >
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mb-2">
                    <img
                      src={msg.attachments[0]}
                      alt="Attachment"
                      className="rounded-lg max-w-full max-h-60 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => window.open(msg.attachments[0], '_blank')}
                    />
                  </div>
                )}
                {msg.content && <div className="text-sm whitespace-pre-wrap">{msg.content}</div>}
                <div
                  className={`text-xs mt-1 text-right ${isOwn ? 'text-primary-200' : 'text-gray-400'
                    }`}
                >
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
        {isLocked ? (
          <div className="text-center text-gray-500 py-2 bg-gray-100 rounded-lg text-sm">
            {orderStatus === 'Pending'
              ? 'Chat will be unlocked once the freelancer accepts the order.'
              : 'Chat is disabled for cancelled orders.'}
          </div>
        ) : (
          <div className="space-y-2">
            {imagePreview && (
              <div className="relative inline-block">
                <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded-lg border border-gray-200" />
                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md"
                >
                  <X size={12} />
                </button>
              </div>
            )}
            <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-colors"
                title="Upload Image"
              >
                <ImageIcon size={24} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
              />
              <div className="flex-1 relative">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  placeholder="Type a message..."
                  className="w-full input-field pr-10 min-h-[44px] max-h-32 py-2 resize-none"
                  rows={1}
                />
              </div>
              <button
                type="submit"
                disabled={(!newMessage.trim() && !image) || isUploading}
                className="btn-primary p-2 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed h-11 w-11 rounded-full"
              >
                {isUploading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send size={20} />
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBox;
