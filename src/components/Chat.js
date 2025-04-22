import React, { useState, useEffect, useRef } from "react";
import ChatResponse from "./ChatResponse";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  MessageCircle,
  Send,
  LogOut,
  MessageSquare,
  Search,
  PlusCircle,
  UserCircle,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const messagesEndRef = useRef(null);
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchChatHistory();
  }, []);

  const fetchChatHistory = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/chat/history`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setChatHistory(response.data);
    } catch (error) {
      toast.error("Failed to fetch chat history");
    }
  };

  const loadChat = async (chatId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/chat/${chatId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessages(response.data.messages);
      setCurrentChatId(chatId);
    } catch (error) {
      toast.error("Failed to load chat");
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = {
      content: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/chat/`,
        {
          message: input,
          chatId: currentChatId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!currentChatId) {
        setCurrentChatId(response.data._id);
        await fetchChatHistory();
      }

      const botResponse = {
        content: response.data.response,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = chatHistory.filter((chat) =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cleanResponse = (response) => {
    return response
      .replace(/^```html/, "")
      .replace(/```$/, "")
      .trim();
  };

  const deleteChat = async (chatId, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/chat/${chatId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (currentChatId === chatId) {
        setMessages([]);
        setCurrentChatId(null);
      }

      await fetchChatHistory();
      toast.success("Chat deleted successfully");
    } catch (error) {
      toast.error("Failed to delete chat");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r flex flex-col">
        <div className="p-4 border-b bg-white">
          <button
            onClick={() => {
              setMessages([]);
              setCurrentChatId(null);
            }}
            className="w-full flex items-center justify-center space-x-2 p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            <PlusCircle size={20} />
            <span>New Chat</span>
          </button>
          <div className="mt-4 relative">
            <input
              type="text"
              placeholder="Search chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-2">
          {filteredHistory.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              {searchTerm ? "No chats found" : "No chat history"}
            </div>
          )}
          {filteredHistory.map((chat) => (
            <button
              key={chat._id}
              onClick={() => loadChat(chat._id)}
              className={`group w-full p-3 text-left hover:bg-gray-50 rounded-lg mt-2 flex items-start space-x-3 relative ${
                currentChatId === chat._id
                  ? "bg-indigo-50 hover:bg-indigo-100"
                  : "hover:bg-gray-50"
              }`}
            >
              <MessageSquare
                className={`flex-shrink-0 ${
                  currentChatId === chat._id
                    ? "text-indigo-600"
                    : "text-gray-400"
                }`}
                size={20}
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate text-sm">{chat.title}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {format(new Date(chat.updatedAt), "MMM d, yyyy")}
                </div>
              </div>
              <button
                onClick={(e) => deleteChat(chat._id, e)}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 rounded-full transition-all duration-200"
                title="Delete chat"
              >
                <Trash2 size={16} className="text-red-500" />
              </button>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1">
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white border-b px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold truncate">Chat Assistant</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/profile"
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <UserCircle size={20} />
                <span>Profile</span>
              </Link>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex-shrink-0"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-start space-x-2 max-w-[70%] ${
                    message.sender === "user"
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === "user"
                        ? "bg-indigo-600"
                        : "bg-gray-400"
                    }`}
                  >
                    <MessageCircle size={16} className="text-white" />
                  </div>
                  <div
                    className={`p-3 rounded-lg ${
                      message.sender === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {message.sender === "user" ? (
                      message.content
                    ) : (
                      <ChatResponse response={cleanResponse(message.content)} />
                    )}
                    <div
                      className={`text-xs mt-1 ${
                        message.sender === "user"
                          ? "text-indigo-200"
                          : "text-gray-500"
                      }`}
                    >
                      {format(new Date(message.timestamp), "HH:mm")}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 p-3 rounded-lg animate-pulse">
                  AI is typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={sendMessage} className="p-4 bg-white border-t">
            <div className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
              >
                <Send size={20} />
                <span>Send</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chat;
