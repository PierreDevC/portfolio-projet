import { FiMic, FiMicOff, FiVideo, FiVideoOff, FiPhoneOff } from 'react-icons/fi'

export default function VideoControls({ audioEnabled, videoEnabled, onToggleAudio, onToggleVideo, onHangUp }) {
  return (
    <div className="flex items-center justify-center gap-4 py-3 bg-gray-900/80 rounded-b-xl">
      <button
        onClick={onToggleAudio}
        className={`p-3 rounded-full transition-colors ${
          audioEnabled ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-red-600 hover:bg-red-700 text-white'
        }`}
        title={audioEnabled ? 'Couper le micro' : 'Activer le micro'}
      >
        {audioEnabled ? <FiMic size={18} /> : <FiMicOff size={18} />}
      </button>

      <button
        onClick={onToggleVideo}
        className={`p-3 rounded-full transition-colors ${
          videoEnabled ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-red-600 hover:bg-red-700 text-white'
        }`}
        title={videoEnabled ? 'Couper la caméra' : 'Activer la caméra'}
      >
        {videoEnabled ? <FiVideo size={18} /> : <FiVideoOff size={18} />}
      </button>

      <button
        onClick={onHangUp}
        className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
        title="Raccrocher"
      >
        <FiPhoneOff size={18} />
      </button>
    </div>
  )
}