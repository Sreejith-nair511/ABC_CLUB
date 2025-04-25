"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X, Send, Bot } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

type Message = {
  id: number
  text: string
  sender: "bot" | "user"
  timestamp: Date
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const isMobile = useMobile()

  // Sample questions for quick access
  const sampleQuestions = ["What is blockchain?", "How do I join the club?", "When is the next event?"]

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()

      // Add welcome message if no messages
      if (messages.length === 0) {
        setMessages([
          {
            id: 1,
            text: "Hey there! I'm BlockBot — your guide to everything blockchain at ABC Club. How can I help you today?",
            sender: "bot",
            timestamp: new Date(),
          },
        ])
      }
    }
  }, [isOpen, messages.length])

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Simulate bot typing
    setIsTyping(true)

    // Simulate bot response after delay
    setTimeout(() => {
      setIsTyping(false)

      let responseText = "I'm still learning about that. Can you try asking something else?"

      // Simple response logic based on keywords
      const input = inputValue.toLowerCase()
      if (input.includes("blockchain")) {
        responseText =
          "Blockchain is a distributed ledger technology that enables secure, transparent, and immutable record-keeping without the need for a central authority. It's the foundation of cryptocurrencies like Bitcoin and Ethereum, but has many other applications too!"
      } else if (input.includes("join") || input.includes("club")) {
        responseText =
          "Great to hear you're interested in joining ABC Club! We welcome new members throughout the year. You can sign up by filling out the form in the 'Get Involved' section, or come to one of our weekly meetings every Thursday at 5 PM in the ISE building."
      } else if (input.includes("event") || input.includes("next") || input.includes("meeting")) {
        responseText =
          "Our next event is a Blockchain Basics Workshop this Friday at 4 PM in Room 302. We'll be covering the fundamentals of blockchain technology and helping everyone set up their first wallet. Hope to see you there!"
      }

      const botMessage: Message = {
        id: Date.now(),
        text: responseText,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  const handleSampleQuestion = (question: string) => {
    setInputValue(question)
    setTimeout(() => {
      handleSendMessage()
    }, 100)
  }

  return (
    <>
      {/* Chat toggle button */}
      <motion.button
        className="fixed bottom-4 right-4 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg hover:bg-emerald-700 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X size={20} />
        ) : (
          <div className="relative">
            <MessageSquare size={20} />
            {/* Pulsing animation */}
            <motion.div
              className="absolute inset-0 rounded-full bg-emerald-500"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            />
          </div>
        )}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`fixed z-40 bg-gray-900 rounded-lg shadow-xl border border-gray-800 overflow-hidden ${
              isMobile ? "bottom-16 right-0 left-0 mx-2 max-h-[80vh]" : "bottom-20 right-4 w-full max-w-sm"
            }`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Chat header */}
            <div className="bg-gray-800 p-3 flex items-center justify-between border-b border-gray-700">
              <div className="flex items-center">
                <div className="bg-emerald-600 rounded-full p-1.5 mr-2">
                  <Bot size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-white text-sm">BlockBot</h3>
                  <p className="text-xs text-gray-400">ABC Club Assistant</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Chat messages */}
            <div className="p-3 h-64 md:h-72 overflow-y-auto bg-gray-900 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-3 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-2.5 ${
                      message.sender === "user" ? "bg-emerald-600 text-white" : "bg-gray-800 text-gray-200"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start mb-3">
                  <div className="bg-gray-800 rounded-lg p-2.5 max-w-[85%]">
                    <div className="flex space-x-1">
                      <motion.div
                        className="w-2 h-2 rounded-full bg-emerald-500"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 rounded-full bg-emerald-500"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0.1 }}
                      />
                      <motion.div
                        className="w-2 h-2 rounded-full bg-emerald-500"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0.2 }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Sample questions */}
            {messages.length <= 2 && (
              <div className="px-3 py-2 bg-gray-800 border-t border-gray-700">
                <p className="text-xs text-gray-400 mb-1.5">Try asking:</p>
                <div className="flex flex-wrap gap-1.5">
                  {sampleQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSampleQuestion(question)}
                      className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-full px-2.5 py-1 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat input */}
            <div className="p-2.5 bg-gray-800 border-t border-gray-700 flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 bg-gray-700 text-white rounded-l-full py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={inputValue.trim() === ""}
                className={`bg-emerald-600 hover:bg-emerald-700 text-white rounded-r-full py-1.5 px-3 transition-colors ${
                  inputValue.trim() === "" ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
