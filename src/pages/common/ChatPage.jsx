import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../hooks/useAuth';
import ChatBox from '../../components/chat/ChatBox';
import { ArrowLeft } from 'lucide-react';

const ChatPage = () => {
  const { id } = useParams(); // conversationId
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const data = await axiosClient.get(`/conversations/${id}`);
        setConversation(data);
      } catch (error) {
        console.error('Failed to load conversation:', error);
        navigate('/inbox');
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!conversation) return null;

  const otherParticipant = conversation.participants.find((p) => p._id !== user._id) || {};

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/inbox')}
        className="mb-4 flex items-center text-gray-600 hover:text-primary-600 transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Inbox
      </button>

      <div className="max-w-4xl mx-auto">
        <ChatBox
          conversationId={conversation._id}
          receiverName={otherParticipant.name}
          receiverId={otherParticipant._id}
        />
      </div>
    </div>
  );
};

export default ChatPage;
