import { useState, useRef, useCallback } from 'react'

export function useMedia() {
  const [stream, setStream] = useState(null)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [error, setError] = useState(null)

  // démarrer la media
  const startMedia = useCallback(async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      setStream(s)
      setError(null)
      return s
    } catch (err) {
      setError("Accès à la caméra/microphone refusé.")
      return null
    }
  }, [])

  // stopper la media
  const stopMedia = useCallback((s) => {
    const target = s || stream
    if (target) target.getTracks().forEach(t => t.stop())
    setStream(null)
  }, [stream])

  // activer/désactiver le son
  const toggleAudio = useCallback(() => {
    if (!stream) return
    stream.getAudioTracks().forEach(t => { t.enabled = !t.enabled })
    setAudioEnabled(v => !v)
  }, [stream])

  // activer/désactiver la vidéo
  const toggleVideo = useCallback(() => {
    if (!stream) return
    stream.getVideoTracks().forEach(t => { t.enabled = !t.enabled })
    setVideoEnabled(v => !v)
  }, [stream])

  return { stream, audioEnabled, videoEnabled, error, startMedia, stopMedia, toggleAudio, toggleVideo }
}