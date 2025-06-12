"use client"

import * as React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import "../styles/chat.css" // Ensure you have the correct path to your CSS file
import { Send, Bot, User, ImageIcon, Camera, Sparkles, Mic, Paperclip, MoreVertical, Trash2, Copy } from "lucide-react"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  image?: string
  isTyping?: boolean
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content:
        "Hello! I'm your AI assistant. I can help you with anything - from photo editing and creating collages to answering questions about technology, science, cooking, travel, and much more. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !selectedImage) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
      image: selectedImage || undefined,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setSelectedImage(null)
    setIsTyping(true)

    try {
      const response = await fetch("https://practicumproject-server.onrender.com/api/Chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Messages: [
            {
              Role: "user",
              Content: inputValue,
            },
          ],
        }),
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const data = await response.json()
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: data.reply,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botResponse])
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsTyping(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const deleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id))
  }

  return (
    <div className="chat-page">
      <div className="chat-container">
        <motion.div
          className="chat-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="header-content">
            <div className="header-left">
              <div className="ai-avatar">
                <Bot className="avatar-icon" />
                <div className="status-indicator" />
              </div>
              <div>
                <h1 className="chat-title">AI Assistant</h1>
                <p className="chat-subtitle">Your intelligent companion for everything</p>
              </div>
            </div>
            <div className="header-actions">
              <button className="action-btn">
                <MoreVertical className="action-icon" />
              </button>
            </div>
          </div>
        </motion.div>

        <div className="messages-container">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={`message ${message.type}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="message-avatar">
                  {message.type === "bot" ? <Bot className="avatar-icon" /> : <User className="avatar-icon" />}
                </div>
                <div className="message-content">
                  <div className="message-bubble">
                    {message.image && (
                      <div className="message-image">
                        <img src={message.image || "/placeholder.svg"} alt="Uploaded" />
                      </div>
                    )}
                    <p className="message-text">{message.content}</p>
                    <div className="message-actions">
                      <button
                        className="message-action-btn"
                        onClick={() => copyMessage(message.content)}
                        title="Copy message"
                      >
                        <Copy className="action-icon" />
                      </button>
                      <button
                        className="message-action-btn"
                        onClick={() => deleteMessage(message.id)}
                        title="Delete message"
                      >
                        <Trash2 className="action-icon" />
                      </button>
                    </div>
                  </div>
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {isTyping && (
              <motion.div
                className="message bot typing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="message-avatar">
                  <Bot className="avatar-icon" />
                </div>
                <div className="message-content">
                  <div className="message-bubble">
                    <div className="typing-indicator">
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        <motion.div
          className="input-area"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {selectedImage && (
            <div className="selected-image-preview">
              <img src={selectedImage || "/placeholder.svg"} alt="Selected" />
              <button className="remove-image-btn" onClick={() => setSelectedImage(null)}>
                ×
              </button>
            </div>
          )}
          <div className="input-container">
            <div className="input-actions">
              <button className="input-action-btn" onClick={() => fileInputRef.current?.click()} title="Upload image">
                <Paperclip className="action-icon" />
              </button>
              <button className="input-action-btn" title="Voice message">
                <Mic className="action-icon" />
              </button>
            </div>
            <textarea
              className="message-input"
              placeholder="Ask me anything - from photo editing to cooking, travel, science, and more..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              rows={1}
            />
            <button className="send-btn" onClick={handleSendMessage} disabled={!inputValue.trim() && !selectedImage}>
              <Send className="send-icon" />
            </button>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="file-input" />
        </motion.div>

        <motion.div
          className="quick-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <button className="quick-action-btn" onClick={() => setInputValue("How do I create a collage?")}>
            <Sparkles className="quick-icon" />
            Create Collage
          </button>
          <button className="quick-action-btn" onClick={() => setInputValue("Help me organize my photos")}>
            <ImageIcon className="quick-icon" />
            Organize Photos
          </button>
          <button className="quick-action-btn" onClick={() => setInputValue("Generate an AI image")}>
            <Camera className="quick-icon" />
            AI Generator
          </button>
          <button className="quick-action-btn" onClick={() => setInputValue("Give me a healthy recipe")}>
            <Sparkles className="quick-icon" />
            Cooking Tips
          </button>
          <button className="quick-action-btn" onClick={() => setInputValue("Plan a weekend trip")}>
            <ImageIcon className="quick-icon" />
            Travel Ideas
          </button>
          <button className="quick-action-btn" onClick={() => setInputValue("Explain quantum physics")}>
            <Camera className="quick-icon" />
            Learn Science
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default ChatPage
