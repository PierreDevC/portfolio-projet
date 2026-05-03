import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMessageCircle, FiX, FiUsers } from 'react-icons/fi'
import { useChat } from '../hooks/useChat'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'

export default function ChatBox() {
  const [open, setOpen] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [unread, setUnread] = useState(0)
  const messagesEndRef = useRef(null)
  const { username, joined, messages, typingUsers, usersCount, join, sendMessage, sendTyping } = useChat()

  // Auto-scroll to latest message
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      setUnread(0)
    }
  }, [messages, open])

  // Count unread when closed
  useEffect(() => {
    if (!open && messages.length > 0) setUnread(u => u + 1)
  }, [messages])

  const handleJoin = (e) => {
    e.preventDefault()
    join(nameInput)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-80 h-[460px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-violet-600 text-white">
              <div className="flex flex-col">
                <span className="font-semibold text-sm">Chat en direct</span>
                <span className="text-xs text-violet-200 flex items-center gap-1">
                  <FiUsers size={11} /> {usersCount} connecté{usersCount > 1 ? 's' : ''}
                </span>
              </div>
              <button onClick={() => setOpen(false)} className="hover:text-violet-200 transition-colors">
                <FiX size={18} />
              </button>
            </div>

            {!joined ? (
              /* Username form */
              <form onSubmit={handleJoin} className="flex flex-col gap-4 p-6 flex-1 justify-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  Choisissez un pseudo pour rejoindre le chat
                </p>
                <input
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  placeholder="Votre pseudo"
                  maxLength={20}
                  required
                  className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <button
                  type="submit"
                  className="py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Rejoindre
                </button>
              </form>
            ) : (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                  {messages.length === 0 && (
                    <p className="text-xs text-gray-400 text-center mt-8">
                      Aucun message pour l'instant. Dites bonjour !
                    </p>
                  )}
                  {messages.map(msg => (
                    <ChatMessage key={msg.id} msg={msg} currentUser={username} />
                  ))}
                  {typingUsers.length > 0 && (
                    <p className="text-xs text-gray-400 italic">
                      {typingUsers.join(', ')} {typingUsers.length > 1 ? 'écrivent' : 'écrit'}...
                    </p>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <ChatInput onSend={sendMessage} onTyping={sendTyping} />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <button
        onClick={() => { setOpen(o => !o); setUnread(0) }}
        className="relative w-14 h-14 bg-violet-600 hover:bg-violet-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
      >
        {open ? <FiX size={22} /> : <FiMessageCircle size={22} />}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>
    </div>
  )
}