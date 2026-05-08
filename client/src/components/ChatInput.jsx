import { useState, useRef, useEffect } from 'react'
import { FiSend } from 'react-icons/fi'

export default function ChatInput({ onSend, onTyping }) {
  const [text, setText] = useState('')
  // ref plutôt que state pour le timeout, pas besoin de re-render
  const typingTimeout = useRef(null)

  const handleChange = (e) => {
    setText(e.target.value)
    // signale que l'user est en train d'écrire
    onTyping(true)
    // repart le timer à chaque frappe, s'il n'y a plus de frappe pendant 1.5s,
    //  envoie isTyping: false pour retirer l'indicateur chez les autres
    clearTimeout(typingTimeout.current)
    typingTimeout.current = setTimeout(() => onTyping(false), 1500)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    onSend(text)
    setText('')
    // retire l'indicateur de frappe immédiatement après l'envoi
    onTyping(false)
    clearTimeout(typingTimeout.current)
  }

  // nettoyage au unmount (évite un appel à onTyping sur un composant démonté)
  useEffect(() => () => clearTimeout(typingTimeout.current), [])

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-3 border-t border-gray-200 dark:border-gray-700">
      <input
        value={text}
        onChange={handleChange}
        placeholder="Écrire un message..."
        className="flex-1 px-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
      />
      {/* bouton désactivé si le champ est vide ou ne contient que des espaces (évite l'envoi d'un message vide) */}
      <button
        type="submit"
        disabled={!text.trim()}
        className="p-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white rounded-lg transition-colors"
      >
        <FiSend size={16} />
      </button>
    </form>
  )
}
