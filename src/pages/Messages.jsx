import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import Layout from '../components/Layout';
import { MessageCircle, Send, User, Clock, ArrowLeft } from 'lucide-react';
import io from 'socket.io-client';

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const socketRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const response = await apiService.getConversations();
      setConversations(response.data.conversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">Connect with your matches</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-3 min-h-[600px]">
            {/* Conversations List */}
            <div className={`border-r border-gray-200 ${selectedConversation ? 'hidden md:block' : 'block'}`}>
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
              </div>

              <div className="overflow-y-auto h-full">
                {conversations.length === 0 ? (
                  <div className="p-6 text-center">
                    <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No conversations yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Start chatting with your matches!
                    </p>
                  </div>
                ) : (
                  conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedConversation?.id === conversation.id ? 'bg-pink-50 border-l-4 border-l-pink-500' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {/* Profile Picture */}
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center">
                          {conversation.profile_image ? (
                            <img
                              src={conversation.profile_image}
                              alt={conversation.first_name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-lg font-bold text-pink-600">
                              {conversation.first_name ? conversation.first_name[0] + conversation.last_name[0] : 'U'}
                            </span>
                          )}
                        </div>

                        {/* Conversation Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                              {conversation.first_name ? `${conversation.first_name} ${conversation.last_name}` : 'Unknown User'}
                            </h3>
                            {conversation.last_message && (
                              <span className="text-xs text-gray-500">
                                {formatTime(conversation.message_time)}
                              </span>
                            )}
                          </div>

                          {conversation.last_message ? (
                            <p className={`text-sm truncate ${
                              conversation.is_from_me ? 'text-gray-600' : 'text-gray-900 font-medium'
                            }`}>
                              {conversation.is_from_me ? 'You: ' : ''}
                              {conversation.last_message}
                            </p>
                          ) : (
                            <p className="text-sm text-gray-500">No messages yet</p>
                          )}
                        </div>

                        {/* Unread Badge */}
                        {conversation.unread_count > 0 && (
                          <div className="bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {conversation.unread_count}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className={`flex flex-col ${selectedConversation ? 'block' : 'hidden md:flex'}`}>
              {selectedConversation ? (
                <ChatInterface conversation={selectedConversation} onBack={() => setSelectedConversation(null)} />
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-gray-500">
                      Choose a conversation from the list to start chatting
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Chat Interface Component
const ChatInterface = ({ conversation, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    loadMessages();
    setupSocket();
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [conversation.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const setupSocket = () => {
    socketRef.current = io('http://localhost:5000', {
      transports: ['websocket', 'polling']
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to socket server');
      socketRef.current.emit('join_conversation', conversation.id);
    });

    socketRef.current.on('new_message', (message) => {
      console.log('New message received:', message);
      setMessages(prevMessages => [...prevMessages, message]);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });
  };

  const loadMessages = async () => {
    try {
      const response = await apiService.getMessages(conversation.id);
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await apiService.sendMessage(conversation.id, newMessage);
      setNewMessage('');
      // Don't refresh messages here, let socket handle it
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center">
            {conversation.profile_image ? (
              <img
                src={conversation.profile_image}
                alt={conversation.first_name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-sm font-bold text-pink-600">
                {conversation.first_name ? conversation.first_name[0] + conversation.last_name[0] : 'U'}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {conversation.first_name ? `${conversation.first_name} ${conversation.last_name}` : 'Unknown User'}
            </h3>
            <p className="text-sm text-gray-500">@{conversation.username ? conversation.username : 'unknown'}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.is_from_me ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.is_from_me
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.message}</p>
              <p className={`text-xs mt-1 ${
                message.is_from_me ? 'text-pink-100' : 'text-gray-500'
              }`}>
                {formatMessageTime(message.created_at)}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={sendMessage} className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-pink-500 focus:border-pink-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Messages;
