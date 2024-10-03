import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import "./ChatRoom.scss";
import { attachIcon, recordIcon, sendMessageIcon } from "../../assets";
import Topbar from "../../components/Topbar/Topbar";

// Sample contacts data
const contacts = [
  {
    id: 1,
    name: "Aliwin",
    avatar: "https://picsum.photos/200",
    status: "Lorem ipsum is a placeholder......",
    messages: [
      { type: "received", content: "Hello, how are you?", time: "12:00 pm" },
      {
        type: "sent",
        content: "I'm good, thanks for asking!",
        time: "12:01 pm",
      },
      { type: "received", content: "Hello, how are you?", time: "12:00 pm" },
      {
        type: "sent",
        content: "I'm good, thanks for asking!",
        time: "12:01 pm",
      },

      { type: "received", content: "Hello, how are you?", time: "12:00 pm" },
      {
        type: "sent",
        content: "I'm good, thanks for asking!",
        time: "12:01 pm",
      },
      { type: "received", content: "Hello, how are you?", time: "12:00 pm" },
      {
        type: "sent",
        content: "I'm good, thanks for asking!",
        time: "12:01 pm",
      },
    ],
  },
  {
    id: 2,
    name: "Munashil",
    avatar: "https://picsum.photos/200",
    status: "Lorem ipsum is a placeholder......",
    messages: [
      {
        type: "received",
        content: "Hey, are you coming to the meeting?",
        time: "10:00 am",
      },
      {
        type: "sent",
        content: "Yes, I'll be there in 10 minutes.",
        time: "10:05 am",
      },
    ],
  },
  {
    id: 3,
    name: "Abisha Manish",
    avatar: "https://picsum.photos/200",
    status: "Lorem ipsum is a placeholder......",
    messages: [
      {
        type: "received",
        content: "Could you send me the report?",
        time: "9:30 am",
      },
      { type: "sent", content: "Sure, I'll send it shortly.", time: "9:35 am" },
    ],
  },
];

const ChatRoom = () => {
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    if (user) {
      const newSocket = io("http://localhost:5000");
      setSocket(newSocket);

      newSocket.emit("join", user.id);

      return () => newSocket.close();
    }
  }, [user]);

  useEffect(() => {
    if (socket) {
      socket.on("receiveMessage", (data) => {
        const { senderId, message } = data;
        const updatedContacts = contacts.map((contact) => {
          if (contact.id === senderId) {
            return {
              ...contact,
              messages: [
                ...contact.messages,
                {
                  type: "received",
                  content: message,
                  time: new Date().toLocaleTimeString(),
                },
              ],
            };
          }
          return contact;
        });
        setSelectedContact((prevContact) => {
          if (prevContact.id === senderId) {
            return {
              ...prevContact,
              messages: [
                ...prevContact.messages,
                {
                  type: "received",
                  content: message,
                  time: new Date().toLocaleTimeString(),
                },
              ],
            };
          }
          return prevContact;
        });
      });
    }
  }, [socket]);

  const handleSendMessage = () => {
    if (message.trim() && socket && user) {
      const newMessage = {
        type: "sent",
        content: message,
        time: new Date().toLocaleTimeString(),
      };
      setSelectedContact((prevContact) => ({
        ...prevContact,
        messages: [...prevContact.messages, newMessage],
      }));
      socket.emit("sendMessage", {
        senderId: user.id,
        receiverId: selectedContact.id,
        message: message,
      });
      setMessage("");
    }
  };

  return (
    <>
      <Topbar />

      <div className="chat-container">
        {/* Left Side - Contact List */}
        <div className="contact-list">
          <div className="search-bar">
            <div className="custom-SearchBar-container">
              {/* <ReactSVG className="search-icon" src={SearchIcon} /> */}
              <input type="text" placeholder="Send message" />
                  
            </div>
          </div>
          <ul className="contacts">
            {contacts.map((contact) => (
              <li
                key={contact.id}
                className={`contact-item ${
                  contact.id === selectedContact.id ? "active" : ""
                }`}
                onClick={() => setSelectedContact(contact)}
              >
                <img src={contact.avatar} alt={contact.name} />
                <div className="contact-info">
                  <h4>{contact.name}</h4>
                  <p>{contact.status}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Side - Chat Area */}
        <div className="chat-area">
          <div className="chat-header">
            <img
              src={selectedContact.avatar}
              alt={selectedContact.name}
              className="contact-avatar"
            />
            <h3>{selectedContact.name}</h3>
          </div>

          {/* Chat Messages */}
          <div className="chat-messages">
            {selectedContact.messages.map((message, index) => (
              <div
                key={index}
                className={`message ${
                  message.type === "received" ? "received" : "sent"
                }`}
              >
                {message.type === "received" && (
                  <img
                    src={selectedContact.avatar}
                    alt={selectedContact.name}
                    className="message-avatar"
                  />
                )}
                <div className="message-content">
                  <p>{message.content}</p>
                  <span className="message-time">
                    {message.time}
                    {message.type === "sent" && <i className="read-icon">✔✔</i>}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="chat-input">
            <div className="input-container">
              <input
                type="text"
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <div className="icons">
                <img src={recordIcon} alt="Record" />
                <img src={attachIcon} alt="Attach" />
              </div>
            </div>
            <button className="send-button" onClick={handleSendMessage}>
              <img src={sendMessageIcon} alt="Send" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatRoom;
