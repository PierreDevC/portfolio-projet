import { useRef, useState, useCallback } from 'react'

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ]
}

export function useWebRTC(socket) {
  const peerRef = useRef(null)
  const [remoteStream, setRemoteStream] = useState(null)
  const [status, setStatus] = useState('idle') // idle | calling | connected | ended

  const createPeer = useCallback((localStream) => {
    const peer = new RTCPeerConnection(ICE_SERVERS)

    localStream.getTracks().forEach(track => peer.addTrack(track, localStream))

    peer.ontrack = (e) => {
      setRemoteStream(e.streams[0])
      setStatus('connected')
    }

    peer.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit('video:ice-candidate', e.candidate)
      }
    }

    peer.onconnectionstatechange = () => {
      if (['disconnected', 'failed', 'closed'].includes(peer.connectionState)) {
        setStatus('ended')
        setRemoteStream(null)
      }
    }

    peerRef.current = peer
    return peer
  }, [socket])

  const createOffer = useCallback(async (localStream) => {
    const peer = createPeer(localStream)
    const offer = await peer.createOffer()
    await peer.setLocalDescription(offer)
    socket.emit('video:offer', offer)
    setStatus('calling')
  }, [createPeer, socket])

  const handleOffer = useCallback(async (offer, localStream) => {
    const peer = createPeer(localStream)
    await peer.setRemoteDescription(new RTCSessionDescription(offer))
    const answer = await peer.createAnswer()
    await peer.setLocalDescription(answer)
    socket.emit('video:answer', answer)
  }, [createPeer, socket])

  const handleAnswer = useCallback(async (answer) => {
    if (!peerRef.current) return
    await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer))
  }, [])

  const handleIceCandidate = useCallback(async (candidate) => {
    if (!peerRef.current) return
    try {
      await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate))
    } catch {}
  }, [])

  const hangUp = useCallback(() => {
    if (peerRef.current) {
      peerRef.current.close()
      peerRef.current = null
    }
    setRemoteStream(null)
    setStatus('idle')
    socket.emit('video:hang-up')
  }, [socket])

  return { remoteStream, status, setStatus, createOffer, handleOffer, handleAnswer, handleIceCandidate, hangUp }
}