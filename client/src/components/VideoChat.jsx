import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiVideo, FiX, FiPhone, FiPhoneOff } from 'react-icons/fi'
import { useSocket } from '../hooks/useSocket'
import { useMedia } from '../hooks/useMedia'
import { useWebRTC } from '../hooks/useWebRTC'
import VideoControls from './VideoControls'

export default function VideoChat() {
  const socket = useSocket()
  const [open, setOpen] = useState(false)
  const [incomingCall, setIncomingCall] = useState(false)
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)

  const { stream, audioEnabled, videoEnabled, error, startMedia, stopMedia, toggleAudio, toggleVideo } = useMedia()
  const { remoteStream, status, setStatus, createOffer, handleOffer, handleAnswer, handleIceCandidate, hangUp } = useWebRTC(socket)

  // Attach local stream to video element
  useEffect(() => {
    if (localVideoRef.current && stream) {
      localVideoRef.current.srcObject = stream
    }
  }, [stream])

  // Attach remote stream to video element
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream
    }
  }, [remoteStream])

  // Socket signaling events
  useEffect(() => {
    if (!socket) return

    socket.on('video:offer', async (offer) => {
      setIncomingCall(true)
      setOpen(true)
      // Store offer to use on accept
      socket._pendingOffer = offer
    })

    socket.on('video:answer', (answer) => {
      handleAnswer(answer)
    })

    socket.on('video:ice-candidate', (candidate) => {
      handleIceCandidate(candidate)
    })

    socket.on('video:hang-up', () => {
      setStatus('ended')
      setIncomingCall(false)
      if (stream) stopMedia(stream)
    })

    return () => {
      socket.off('video:offer')
      socket.off('video:answer')
      socket.off('video:ice-candidate')
      socket.off('video:hang-up')
    }
  }, [socket, stream, handleAnswer, handleIceCandidate, stopMedia, setStatus])

  const handleOpen = async () => {
    setOpen(true)
    const s = await startMedia()
    if (localVideoRef.current && s) localVideoRef.current.srcObject = s
  }

  const handleCall = async () => {
    if (!stream) return
    await createOffer(stream)
  }

  const handleAccept = async () => {
    setIncomingCall(false)
    const s = await startMedia()
    if (s && socket._pendingOffer) {
      await handleOffer(socket._pendingOffer, s)
      socket._pendingOffer = null
    }
  }

  const handleReject = () => {
    setIncomingCall(false)
    socket.emit('video:hang-up')
    setOpen(false)
  }

  const handleHangUp = () => {
    hangUp()
    stopMedia(stream)
    setIncomingCall(false)
    setOpen(false)
  }

  const isInCall = status === 'connected' || status === 'calling'

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-3">
      {/* Incoming call banner */}
      <AnimatePresence>
        {incomingCall && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-gray-900 border border-violet-500 rounded-xl px-4 py-3 flex items-center gap-4 shadow-xl"
          >
            <div className="flex flex-col">
              <span className="text-white text-sm font-semibold">Appel entrant</span>
              <span className="text-gray-400 text-xs">Quelqu'un veut vous appeler</span>
            </div>
            <div className="flex gap-2">
              <button onClick={handleAccept}
                className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors">
                <FiPhone size={16} />
              </button>
              <button onClick={handleReject}
                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors">
                <FiPhoneOff size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-80 bg-gray-950 rounded-xl shadow-2xl border border-gray-800 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-900">
              <span className="text-white text-sm font-semibold flex items-center gap-2">
                <FiVideo size={15} className="text-violet-400" />
                Vidéo
                {status === 'calling' && <span className="text-xs text-yellow-400">En attente...</span>}
                {status === 'connected' && <span className="text-xs text-green-400">Connecté</span>}
              </span>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <FiX size={16} />
              </button>
            </div>

            {/* Video area */}
            <div className="relative bg-black aspect-video">
              {/* Remote video (full) */}
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className={`w-full h-full object-cover ${remoteStream ? '' : 'hidden'}`}
              />

              {/* Placeholder when no remote stream */}
              {!remoteStream && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-sm">
                  {status === 'calling' ? 'Appel en cours...' : 'Aucune connexion'}
                </div>
              )}

              {/* Local video (PiP) */}
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="absolute bottom-2 right-2 w-24 h-16 object-cover rounded-lg border-2 border-gray-700 bg-gray-900"
              />
            </div>

            {/* Error message */}
            {error && <p className="text-red-400 text-xs px-4 py-2 bg-gray-900">{error}</p>}

            {/* Actions */}
            {isInCall ? (
              <VideoControls
                audioEnabled={audioEnabled}
                videoEnabled={videoEnabled}
                onToggleAudio={toggleAudio}
                onToggleVideo={toggleVideo}
                onHangUp={handleHangUp}
              />
            ) : (
              <div className="flex justify-center py-3 bg-gray-900">
                {!stream ? (
                  <button onClick={handleOpen}
                    className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm rounded-lg transition-colors">
                    <FiVideo size={14} /> Activer la caméra
                  </button>
                ) : (
                  <button onClick={handleCall}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors">
                    <FiPhone size={14} /> Appeler
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      {!open && (
        <button
          onClick={handleOpen}
          className="w-14 h-14 bg-gray-800 hover:bg-violet-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
        >
          <FiVideo size={20} />
        </button>
      )}
    </div>
  )
}