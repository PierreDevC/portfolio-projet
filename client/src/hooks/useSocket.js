import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

let socket = null

export function useSocket() {
  const ref = useRef(null)

  useEffect(() => {
    if (!socket) {
      socket = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:3001')
    }
    ref.current = socket
  }, [])

  return ref.current || socket
}