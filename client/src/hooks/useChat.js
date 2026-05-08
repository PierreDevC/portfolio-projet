import { useState, useEffect, useCallback } from 'react'
import { useSocket } from './useSocket'
import { EVENTS } from '../utils/socketEvents'

export function useChat() {
  const socket = useSocket()
  const [username, setUsername]       = useState('')
  const [joined, setJoined]           = useState(false)
  const [messages, setMessages]       = useState([])
  const [typingUsers, setTypingUsers] = useState([])
  const [usersCount, setUsersCount]   = useState(0)

  useEffect(() => {
    // socket pas encore prêt au premier rendu, on attend
    if (!socket) return

    // nouveau message reçu — on l'ajoute à la liste
    socket.on(EVENTS.MESSAGE_RECEIVE, (msg) => {
      setMessages(prev => [...prev, msg])
    })

    // mise à jour du compteur d'utilisateurs connectés
    socket.on(EVENTS.USERS_COUNT, (count) => {
      setUsersCount(count)
    })

    // quelqu'un a rejoint, on affiche un message système dans le chat
    socket.on(EVENTS.USER_JOINED, ({ username: name }) => {
      setMessages(prev => [...prev, { id: Date.now(), type: 'system', text: `${name} a rejoint le chat` }])
    })

    // quelqu'un est parti — idem
    socket.on(EVENTS.USER_LEFT, ({ username: name }) => {
      setMessages(prev => [...prev, { id: Date.now(), type: 'system', text: `${name} a quitté le chat` }])
    })

    // Set évite les doublons si l'event se déclenche plusieurs fois pour le même user
    socket.on(EVENTS.TYPING_UPDATE, ({ username: name, isTyping }) => {
      setTypingUsers(prev =>
        isTyping ? [...new Set([...prev, name])] : prev.filter(u => u !== name)
      )
    })

    // nettoyage au unmount (évite les listeners en double si le composant remonte)
    return () => {
      socket.off(EVENTS.MESSAGE_RECEIVE)
      socket.off(EVENTS.USERS_COUNT)
      socket.off(EVENTS.USER_JOINED)
      socket.off(EVENTS.USER_LEFT)
      socket.off(EVENTS.TYPING_UPDATE)
    }
  }, [socket])

  // useCallback pour stabiliser les références et éviter des re-renders inutiles (évite les boucles infinies)
  const join = useCallback((name) => {
    if (!socket || !name.trim()) return
    socket.emit(EVENTS.USER_JOIN, name.trim())
    setUsername(name.trim())
    setJoined(true)
  }, [socket])

  const sendMessage = useCallback((text) => {
    if (!socket || !text.trim()) return
    socket.emit(EVENTS.MESSAGE_SEND, text.trim())
  }, [socket])

  const sendTyping = useCallback((isTyping) => {
    if (!socket) return
    socket.emit(EVENTS.USER_TYPING, isTyping)
  }, [socket])

  return { username, joined, messages, typingUsers, usersCount, join, sendMessage, sendTyping }
}
