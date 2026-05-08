export default function ChatMessage({ msg, currentUser }) {
    if (msg.type === 'system') {
      return (
        <div className="text-center text-xs text-gray-400 dark:text-gray-500 py-1">
          {msg.text}
        </div>
      )
    }
  
    const isMe = msg.username === currentUser
    const time = msg.timestamp
      ? new Date(msg.timestamp).toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' })
      : ''
  
    return (
      <div className={`flex flex-col gap-0.5 ${isMe ? 'items-end' : 'items-start'}`}>
        <span className="text-xs text-gray-400 dark:text-gray-500 px-1">{msg.username}</span>
        <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
          isMe
            ? 'bg-violet-600 text-white rounded-br-sm'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-sm'
        }`}>
          {msg.text}
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-500 px-1">{time}</span>
      </div>
    )
  }