import React, { useEffect, useState, useRef } from "react";
import { 
  Menu, Search, MoreVertical, ArrowLeft, Download, 
  FileText, MapPin, Video, Music, MessageSquarePlus, X, Send 
} from "lucide-react";
import { HiLink } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";

// Redux Actions (Assuming imports are correct based on your snippet)
import { getAllUsersThunk } from "../../reducer/slices/user/userThunk";
import { setSelectedUser } from "../../reducer/slices/user/userSlice";
import { getMessagesThunk, sendMessageThunk } from "../../reducer/slices/messages/messagesThunk";
import { initializeSocket, setOnlineUsers } from "../../reducer/slices/socket/socket.slice";
import { addNewMessage } from "../../reducer/slices/messages/messagesSlice";

import AttachItem from "./documentSendLabel/documentSendLabel";

const ChatPage = () => {
  const { conversationId } = useParams();
  const isNewChat = conversationId === "new";
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // --- Refs ---
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

  // --- State ---
  const [caption, setCaption] = useState("");
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [mediaType, setMediaType] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileUrl, setSelectedFileUrl] = useState(null);
  const [message, setMessage] = useState("");

  // --- Redux State ---
  const { token, users, selectedUser, userDetails } = useSelector((state) => state.auth);
  const { socket, onlineUsers } = useSelector((state) => state.socket);
  const { conversations } = useSelector((state) => state.messages);
  console.log("conversations are:",conversations);
  console.log("Fetched users are:",userDetails);

  const isOnline = onlineUsers?.includes(selectedUser?._id);

  // --- Side Effects ---
  useEffect(() => {
    if (token && (!users || users.length === 0)) {
      dispatch(getAllUsersThunk());
    }
  }, [token, users, dispatch]);

  useEffect(() => {
     if (!conversationId || isNewChat) return;

      dispatch(getMessagesThunk(conversationId));

    }, [conversationId, dispatch]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, previewOpen]); // Scroll when chat opens or conversations change

  useEffect(() => {
    if (!userDetails?._id) return;
    dispatch(initializeSocket(userDetails._id));
  }, [userDetails?._id, dispatch]);

  useEffect(() => {
    if (!socket) return;

    const handleOnlineUsers = (users) => dispatch(setOnlineUsers(users));

    const handleNewMessage = (msg) => {
      // helper to normalize id from either string or populated object
      const getId = (v) => {
        if (!v) return null;
        if (typeof v === "string") return v;
        if (typeof v === "object") return v._id ? v._id.toString() : (v.toString && v.toString());
        return String(v);
      };

      const msgConvId = getId(msg.conversation);
      const senderId = getId(msg.sender);
      const recieverId = getId(msg.reciever);
      const currentConvId = conversationId;
      const selId = getId(selectedUser?._id);
      const meId = getId(userDetails?._id);

      // If message belongs to currently opened conversation -> add it
      if (msgConvId && currentConvId && msgConvId === currentConvId) {
        dispatch(addNewMessage(msg));
        return;
      }

      // If incoming message is between selectedUser and me (covers /chat/new)
      const isBetweenSelectedAndMe =
        selId && meId && (
          (senderId === selId && recieverId === meId) ||
          (recieverId === selId && senderId === meId)
        );

      if (isBetweenSelectedAndMe) {
        // attach conversation id to selectedUser if backend provided it
        if (msgConvId) {
          dispatch(setSelectedUser({ ...selectedUser, conversation: { _id: msgConvId } }));
          if (msgConvId !== currentConvId) {
            navigate(`/chat/${msgConvId}`);
          }
        }
        dispatch(addNewMessage(msg));
      }
    };

    socket.on("onlineUsers", handleOnlineUsers);
    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, conversationId, dispatch, selectedUser, userDetails, navigate]);

  // --- Handlers ---
  const handleUserClick = (user) => {
      console.log("fetched users for conversation are:.......",user);
    dispatch(setSelectedUser(user));
    if (user.conversation?._id) {
      navigate(`/chat/${user.conversation._id}`);
    }
    else{
      navigate('/chat/new');
    }
  };

  const handleattachClick = (type) => {
    setMediaType(type);
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 0);
    setShowAttachMenu(false);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setSelectedFile(file);
    setSelectedFileUrl(URL.createObjectURL(file));
    setPreviewOpen(true); // Switch Right Panel to Preview Mode
    setCaption(""); // Reset caption
  };

  const closePreview = () => {
    setPreviewOpen(false);
    setSelectedFile(null);
    setSelectedFileUrl(null);
    setMediaType("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!selectedUser) return;

    const formData = new FormData();
    formData.append("recieverId", selectedUser._id);

    if (selectedFile) {
      formData.append("file", selectedFile);
      formData.append("mediaType", mediaType);
      if (caption.trim() !== "") formData.append("content", caption);
    } else {
      if (!message || message.trim() === "") return;
      formData.append("content", message);
    }

    dispatch(sendMessageThunk(formData)).then((res) => {
      const newConversationId = res?.payload?.data?.conversation;
      const returnedMessage = res?.payload?.data?.message || res?.payload?.data;

      // attach conversation id to selectedUser so UI will use it next time
      if (newConversationId) {
        dispatch(setSelectedUser({ ...selectedUser, conversation: { _id: newConversationId } }));
      }

      // only navigate when we got a valid id and it's different from current route
      if (newConversationId && newConversationId !== conversationId) {
        navigate(`/chat/${newConversationId}`);
      }

      // update messages locally to avoid full refetch/refresh
      if (returnedMessage) {
        dispatch(addNewMessage(returnedMessage));
      }
    });

    setMessage("");
    closePreview();
  };

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans text-sm bg-gray-50">
      
      {/* ================= LEFT SIDEBAR (Icons) ================= */}
<div className="hidden lg:flex w-[72px] bg-[#0e1621] flex-col items-center py-2 shrink-0">
        <button className="p-3 text-gray-400 hover:text-white mb-2">
          <Menu size={24} />
        </button>
        {/* ... (Tabs kept same as your code) ... */}
        <div className="flex flex-col gap-4 w-full items-center">
            {/* Example Tab */}
            <div className="flex flex-col items-center cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-[#2b5278] flex items-center justify-center text-white relative">
                <span className="text-xs font-bold">All</span>
              </div>
            </div>
        </div>
      </div>

      {/* ================= MIDDLE PANEL (User List) ================= */}
<div
  className={`
    bg-gradient-to-br from-[#0f2027] via-[#111827] to-black
    border-r border-gray-200 flex flex-col shrink-0
    w-full md:w-80
    ${selectedUser ? "hidden md:flex" : "flex"}
  `}
>
        <div className="h-14  flex items-center justify-between px-4 ">
          <span className="font-semibold text-lg text-white">Chats</span>
          <button onClick={()=>navigate('/add-contact')} className="p-2 rounded-full hover:bg-gray-100 transition">
            <MessageSquarePlus size={20} className="text-white" />
          </button>
        </div>
        
        {/* Search */}
        <div className="px-3 py-5  border-b border-gray-600">
          <div className="flex items-center  rounded-full border-2 border-gray-600 px-3 py-2">
            <Search size={16} className="text-gray-400" />
            <input type="text" placeholder="Search" className="text-white ml-2 w-full text-sm focus:outline-none" />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {users.data?.map((user) => (
            <div
              onClick={() => handleUserClick(user)}
              key={user._id}
              className={`flex items-center gap-3 px-3 py-3 cursor-pointer transition ${selectedUser?._id === user._id ? "bg-[#2C4255]" : "hover:bg-[#2C4255"}`}
            >
              <div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center overflow-hidden">
                <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 border-b border-gray-600 pb-2">
                <h3 className="font-semibold text-white truncate">{user.userName || user.phoneNumber}</h3>
                <p className="text-sm text-gray-400 truncate">{user.conversation?.lastMessage?.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= RIGHT PANEL (Chat OR Preview) ================= */}
<div
  className={`
    flex-1 flex flex-col relative bg-[#efe7dd] bg-opacity-30
    ${!selectedUser ? "hidden md:flex" : "flex"}
  `}
>
        {/* Using a WhatsApp-like subtle background color or image if desired */}

        {/* CONDITIONAL RENDERING:
            If previewOpen is true -> Show Preview UI
            Else -> Show Chat UI
        */}
        {previewOpen ? (
          
          /* ================= PREVIEW MODE (WhatsApp Style) ================= */
          <div className="flex flex-col h-full bg-[#0b141a] relative animate-fade-in">
            
            {/* Top Header */}
            <div className="h-16 px-4 flex items-center gap-4 text-gray-300">
              <button onClick={closePreview} className="p-2 hover:bg-white/10 rounded-full transition">
                <X size={24} />
              </button>
              <span className="text-lg font-medium">Preview {mediaType}</span>
            </div>

            {/* Media Display Area */}
            <div className="flex-1 flex items-center justify-center p-8 overflow-hidden">
              {mediaType === "image" && (
                <img src={selectedFileUrl} alt="Preview" className="max-h-full max-w-full object-contain shadow-lg" />
              )}
              {mediaType === "video" && (
                <video src={selectedFileUrl} controls className="max-h-full max-w-full shadow-lg" />
              )}
              {mediaType === "audio" && (
                <div className="bg-white/10 p-6 rounded-xl flex flex-col items-center gap-4">
                  <Music size={48} className="text-orange-500" />
                  <audio src={selectedFileUrl} controls />
                </div>
              )}
              {mediaType === "document" && (
                <div className="bg-white p-8 rounded-xl flex flex-col items-center gap-4 shadow-xl">
                  <FileText size={64} className="text-blue-500" />
                  <span className="text-gray-800 font-medium">{selectedFile?.name}</span>
                  <span className="text-gray-500 text-sm">{(selectedFile?.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              )}
            </div>

            {/* Bottom Caption Input */}
            <div className="h-20 bg-[#0b141a] flex items-center px-4 gap-4 justify-center">
              <div className="max-w-4xl w-full flex items-center gap-2">
                <input 
                  type="text" 
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Add a caption..."
                  className="flex-1 bg-[#2a3942] text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(e)}
                />
                <button 
                  onClick={handleSendMessage}
                  className="w-12 h-12 bg-[#00a884] hover:bg-[#008f70] rounded-full flex items-center justify-center text-white shadow-lg transition transform active:scale-95"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>

        ) : (

          /* ================= NORMAL CHAT MODE ================= */
          <>
            {/* Chat Header */}
            {selectedUser && (
  <div className="h-16 bg-gradient-to-br from-[#0f2027] via-[#111827] to-black flex items-center px-4 gap-3 shadow-sm z-10">
    
    {/* Mobile Back Button */}
    <button
      onClick={() => navigate("/")}
      className="md:hidden text-white"
    >
      <ArrowLeft size={22} />
    </button>

    <div className="flex items-center gap-3 flex-1">
      <div className="w-10 h-10 rounded-full bg-indigo-500 overflow-hidden">
        <img src={selectedUser.profilePicture} className="w-full h-full object-cover" />
      </div>
      <div>
        <h1 className="font-semibold text-white text-sm sm:text-base">
          {selectedUser.userName || selectedUser.phoneNumber}
        </h1>
        <span className="text-xs text-green-500">
          {isOnline ? "Online" : "Last seen recently"}
        </span>
      </div>
    </div>
  </div>
)}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5  flex flex-col gap-2 bg-gradient-to-br from-[#0f2027] via-[#111827] to-black">
              {conversations?.map((msg) => (
                
          <div
  key={msg._id}
  className={`max-w-[65%] px-3 py-2 text-sm shadow ${
    msg.sender._id === userDetails._id
      ? "self-end bg-[#2f3f4f] text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg"
      : "self-start bg-[#1f2d3a] text-white rounded-tl-lg rounded-tr-lg rounded-br-lg"
  }`}
>
                  {/* Handle Media in Chat Bubble */}
                  {msg && (
                    <div className="mb-2">
                      {msg.contentType === "image" && <img src={msg.imageOrVideoUrl} alt="media" className="rounded-md max-h-60" />}
                      {msg.contentType === "video" && <video src={msg.imageOrVideoUrl} controls className="rounded-md max-h-60" />}
                    </div>
                  )}


                  
                  <div className="flex flex-wrap items-end gap-2">
    {msg.content && (
      <p className="break-words text-lg">{msg.content}</p>
    )}

    <span className="text-[10px] text-slate-300 whitespace-nowrap ">
      {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }) : "12:00 PM"}
    </span>
  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div className="min-h-[60px] bg-gradient-to-br from-[#0f2027] via-[#111827] to-black flex items-center px-4 py-2 border-t border-white/10 gap-3">
              {/* Attachment Icon */}
              <div className="relative">
                <button 
                  onClick={() => setShowAttachMenu(!showAttachMenu)}
                  className="p-2 text-white  rounded-full hover:cursor-pointer transition"
                >
                  <HiLink className="text-xl rotate-45" />
                </button>

                {showAttachMenu && (
                  <div className="absolute bottom-14 left-0 z-50 animate-fade-in-up">
                    <div className="flex flex-col gap-3 bg-white p-4 rounded-xl shadow-2xl border border-gray-100 w-48">
                      <AttachItem icon={Music} label="Photos & Videos" color="bg-purple-500" onClick={() => handleattachClick("image")} />
                      <AttachItem icon={Video} label="Camera" color="bg-pink-500" onClick={() => handleattachClick("video")} />
                      <AttachItem icon={FileText} label="Document" color="bg-indigo-500" onClick={() => handleattachClick("document")} />
                    </div>
                  </div>
                )}
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept={
                  mediaType === "video" ? "video/*" : 
                  mediaType === "audio" ? "audio/*" : 
                  mediaType === "image" ? "image/*" : 
                  ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                }
                onChange={handleFileSelect}
              />

              {/* Text Input */}
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(e)}
                type="text"
                placeholder="Type a message"
                className="flex-1 bg-transparent text-white border-none focus:ring-0 text-sm focus:outline-none px-2"
              />
              
              <button type="button" onClick={handleSendMessage} className="p-2 text-white  rounded-full">
                <Send size={20} className={message ? "text-green-500" : ""} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatPage;