import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../hooks/useAuth';
import { MessageSquare, Calendar } from 'lucide-react';

const InboxPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const data = await axiosClient.get('/conversations');
      setConversations(data || []);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Messages</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {conversations.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {conversations.map((conv) => {
              const otherParticipant = conv.participants.find((p) => p._id !== user._id) || {};

              return (
                <Link
                  key={conv._id}
                  to={`/inbox/${conv._id}`}
                  className="block p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      {otherParticipant.profilePicture ? (
                        <img
                          src={otherParticipant.profilePicture}
                          alt={otherParticipant.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 font-semibold text-lg">
                            {otherParticipant.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {otherParticipant.name}
                        </h3>
                        {conv.lastMessage && (
                          <span className="text-xs text-gray-500 flex items-center">
                            {new Date(conv.lastMessage.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {conv.lastMessage ? (
                          conv.lastMessage.content
                        ) : (
                          <span className="italic text-gray-400">No messages yet</span>
                        )}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
            <p className="text-gray-500">
              Contact a freelancer to start a conversation.
            </p>
            <Link to="/marketplace" className="mt-4 inline-block btn-primary">
              Browse Freelancers
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default InboxPage;
