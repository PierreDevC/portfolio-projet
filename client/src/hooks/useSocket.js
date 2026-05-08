import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

// variable hors du hook, partagée entre tous les composants qui l'appellent
// c'est ce qui garantit une seule connexion socket pour toute l'app (singleton)
let socket = null

export function useSocket() {
  const ref = useRef(null)

  useEffect(() => {
    // crée la connexion seulement si elle n'existe pas encore
    if (!socket) {
      socket = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:3001')
    }
    ref.current = socket
  }, [])

  // ref.current peu  t être null au premier rendu, socket prend le relais
  return ref.current || socket
}
