import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useSocket } from '../hooks/useSocket'
import API from '../hooks/useApi'
import {
  FiTrash2, FiEdit, FiPlus, FiLogOut,
  FiEye, FiEyeOff, FiArchive, FiMessageSquare, FiInbox,
  FiMessageCircle, FiSearch, FiX, FiSend
} from 'react-icons/fi'

const EMPTY = { title: '', description: '', tags: '', github: '', live: '', image: '' }

export default function Admin() {
  const { token, isAdmin, login, logout } = useAuth()
  const navigate = useNavigate()
  const socket   = useSocket()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')

  // Tab
  const [activeTab, setActiveTab] = useState('projects')

  // Projects state
  const [projects, setProjects] = useState([])
  const [form, setForm]         = useState(EMPTY)
  const [editing, setEditing]   = useState(null)

  // Contact messages state
  const [messages, setMessages]     = useState([])
  const [msgFilter, setMsgFilter]   = useState('all')
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText]   = useState('')

  // Chat state
  const [allMessages, setAllMessages] = useState([])
  const [chatInput, setChatInput]     = useState('')
  const [chatSearch, setChatSearch]   = useState('')
  const [chatJoined, setChatJoined]   = useState(false)
  const chatBottomRef = useRef(null)

  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (isAdmin) {
      fetchProjects()
      fetchMessages()
    }
  }, [isAdmin])

  // Load chat history + subscribe to real-time when Chat tab is active
  useEffect(() => {
    if (activeTab !== 'chat' || !socket || !isAdmin) return

    API.get('/api/chat/logs', { headers })
      .then(({ data }) => setAllMessages([...data].reverse()))

    if (!chatJoined) {
      socket.emit('user:join', 'Admin')
      setChatJoined(true)
    }

    const handler = (msg) => setAllMessages(prev => [...prev, msg])
    socket.on('message:receive', handler)
    return () => socket.off('message:receive', handler)
  }, [activeTab, socket, isAdmin])

  // Auto-scroll on new chat messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [allMessages])

  // ── Helpers ───────────────────────────────────────────────
  const formatDate = (iso) => new Date(iso).toLocaleDateString('fr-CA', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
  const formatTime = (iso) => new Date(iso).toLocaleTimeString('fr-CA', {
    hour: '2-digit', minute: '2-digit'
  })
  const getInitial   = (name) => name?.charAt(0).toUpperCase() || '?'
  const avatarColors = ['bg-violet-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-pink-500', 'bg-teal-500']
  const getColor     = (name) => avatarColors[(name?.charCodeAt(0) || 0) % avatarColors.length]

  // ── Projects ──────────────────────────────────────────────
  const fetchProjects = async () => {
    const { data } = await API.get('/api/projects')
    setProjects(data)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
      setError('')
    } catch {
      setError('Identifiants invalides')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) }
    if (editing) {
      await API.put(`/api/projects/${editing}`, payload, { headers })
    } else {
      await API.post('/api/projects', payload, { headers })
    }
    setForm(EMPTY)
    setEditing(null)
    fetchProjects()
  }

  const handleDeleteProject = async (id) => {
    if (!confirm('Supprimer ce projet ?')) return
    await API.delete(`/api/projects/${id}`, { headers })
    fetchProjects()
  }

  const startEdit = (p) => {
    setEditing(p.id)
    setForm({ ...p, tags: p.tags.join(', ') })
  }

  // ── Contact messages ──────────────────────────────────────
  const fetchMessages = async () => {
    const { data } = await API.get('/api/contact/messages', { headers })
    setMessages(data)
  }

  const toggleRead = async (msg) => {
    await API.patch(`/api/contact/messages/${msg.id}/read`, { read: !msg.read }, { headers })
    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: msg.read ? 0 : 1 } : m))
  }

  const toggleArchive = async (msg) => {
    await API.patch(`/api/contact/messages/${msg.id}/archive`, { archived: !msg.archived }, { headers })
    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, archived: msg.archived ? 0 : 1 } : m))
  }

  const handleDeleteMessage = async (id) => {
    if (!confirm('Supprimer ce message ?')) return
    await API.delete(`/api/contact/messages/${id}`, { headers })
    setMessages(prev => prev.filter(m => m.id !== id))
  }

  const handleReply = async (id) => {
    if (!replyText.trim()) return
    await API.patch(`/api/contact/messages/${id}/reply`, { reply: replyText }, { headers })
    setMessages(prev => prev.map(m => m.id === id ? { ...m, reply: replyText } : m))
    setReplyingTo(null)
    setReplyText('')
  }

  const openReply = (msg) => {
    setReplyingTo(msg.id)
    setReplyText(msg.reply || '')
  }

  const filteredMessages = messages.filter(m => {
    if (msgFilter === 'unread')   return !m.archived && !m.read
    if (msgFilter === 'archived') return m.archived
    return !m.archived
  })

  const unreadCount   = messages.filter(m => !m.archived && !m.read).length
  const archivedCount = messages.filter(m => m.archived).length

  // ── Chat ──────────────────────────────────────────────────
  const sendChatMessage = (e) => {
    e?.preventDefault()
    if (!chatInput.trim() || !socket) return
    socket.emit('message:send', chatInput.trim())
    setChatInput('')
  }

  const handleDeleteChatMsg = async (msg) => {
    if (!confirm('Supprimer ce message ?')) return
    // Only DB-backed messages have a numeric id from autoincrement
    // Real-time messages that haven't been saved yet won't be in DB but timestamp id matches
    await API.delete(`/api/chat/logs/${msg.id}`, { headers }).catch(() => {})
    setAllMessages(prev => prev.filter(m => m.id !== msg.id))
  }

  const handleClearChat = async () => {
    if (!confirm('Vider tous les messages du chat ? Cette action est irréversible.')) return
    await API.delete('/api/chat/logs', { headers })
    setAllMessages([])
  }

  const filteredChat = chatSearch.trim()
    ? allMessages.filter(m => m.username?.toLowerCase().includes(chatSearch.toLowerCase()))
    : allMessages

  const uniqueChatUsers = new Set(allMessages.map(m => m.username)).size

  // ── Login screen ──────────────────────────────────────────
  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-gray-950 flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-gray-900 p-8 rounded-xl flex flex-col gap-4 w-80">
          <h1 className="text-xl font-bold text-white">Connexion Admin</h1>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email"
            className="px-3 py-2 rounded bg-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Mot de passe"
            className="px-3 py-2 rounded bg-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          <button type="submit" className="py-2 bg-violet-600 hover:bg-violet-700 text-white rounded font-medium">
            Se connecter
          </button>
        </form>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Panneau Admin</h1>
          <button onClick={() => { logout(); navigate('/') }} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <FiLogOut size={16} /> Déconnexion
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 mb-8 border-b border-gray-800">
          <button onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 text-sm font-medium rounded-t transition-colors ${
              activeTab === 'projects' ? 'bg-gray-900 text-violet-400 border border-b-gray-900 border-gray-700' : 'text-gray-500 hover:text-gray-300'
            }`}>
            Projets
          </button>

          <button onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t transition-colors ${
              activeTab === 'messages' ? 'bg-gray-900 text-violet-400 border border-b-gray-900 border-gray-700' : 'text-gray-500 hover:text-gray-300'
            }`}>
            <FiInbox size={14} />
            Messages
            {unreadCount > 0 && (
              <span className="bg-violet-600 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">{unreadCount}</span>
            )}
          </button>

          <button onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t transition-colors ${
              activeTab === 'chat' ? 'bg-gray-900 text-violet-400 border border-b-gray-900 border-gray-700' : 'text-gray-500 hover:text-gray-300'
            }`}>
            <FiMessageCircle size={14} />
            Chat
            {allMessages.length > 0 && (
              <span className="bg-gray-700 text-gray-300 text-xs rounded-full px-1.5 py-0.5 leading-none">{allMessages.length}</span>
            )}
          </button>
        </div>

        {/* ── PROJECTS TAB ────────────────────────────────── */}
        {activeTab === 'projects' && (
          <>
            <form onSubmit={handleSubmit} className="bg-gray-900 rounded-xl p-6 mb-8 flex flex-col gap-3">
              <h2 className="font-semibold text-violet-400">{editing ? 'Modifier le projet' : 'Ajouter un projet'}</h2>
              {['title', 'description', 'tags', 'github', 'live', 'image'].map(field => (
                <input key={field} value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                  placeholder={field === 'tags' ? 'tags (séparés par virgule)' : field}
                  className="px-3 py-2 rounded bg-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  required={field === 'title'} />
              ))}
              <div className="flex gap-3">
                <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded text-sm font-medium">
                  <FiPlus size={14} /> {editing ? 'Enregistrer' : 'Ajouter'}
                </button>
                {editing && (
                  <button type="button" onClick={() => { setEditing(null); setForm(EMPTY) }}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm">
                    Annuler
                  </button>
                )}
              </div>
            </form>

            <div className="flex flex-col gap-3">
              {projects.map(p => (
                <div key={p.id} className="bg-gray-900 rounded-xl p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">{p.title}</p>
                    <p className="text-sm text-gray-400">{p.tags.join(', ')}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(p)} className="p-2 text-gray-400 hover:text-violet-400 transition-colors"><FiEdit size={16} /></button>
                    <button onClick={() => handleDeleteProject(p.id)} className="p-2 text-gray-400 hover:text-red-400 transition-colors"><FiTrash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── MESSAGES TAB ────────────────────────────────── */}
        {activeTab === 'messages' && (
          <>
            <div className="flex gap-6 text-sm text-gray-400 mb-4">
              <span><span className="text-white font-medium">{messages.filter(m => !m.archived).length}</span> total</span>
              <span><span className="text-violet-400 font-medium">{unreadCount}</span> non lus</span>
              <span><span className="text-gray-500 font-medium">{archivedCount}</span> archivés</span>
            </div>

            <div className="flex gap-2 mb-6">
              {[{ key: 'all', label: 'Tous' }, { key: 'unread', label: 'Non lus' }, { key: 'archived', label: 'Archivés' }].map(f => (
                <button key={f.key} onClick={() => setMsgFilter(f.key)}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                    msgFilter === f.key ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}>
                  {f.label}
                </button>
              ))}
            </div>

            {filteredMessages.length === 0 ? (
              <div className="text-center py-16 text-gray-600">
                <FiInbox size={32} className="mx-auto mb-3" />
                <p className="text-sm">Aucun message</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredMessages.map(msg => (
                  <div key={msg.id} className={`bg-gray-900 rounded-xl p-5 flex flex-col gap-3 border-l-4 ${msg.read ? 'border-gray-800' : 'border-violet-500'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${getColor(msg.name)}`}>
                          {getInitial(msg.name)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm">{msg.name}</p>
                            {!msg.read && <span className="w-2 h-2 rounded-full bg-violet-500 inline-block" title="Non lu" />}
                          </div>
                          <p className="text-xs text-gray-400">{msg.email}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 shrink-0">{formatDate(msg.created_at)}</p>
                    </div>

                    <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{msg.message}</p>

                    {msg.reply && (
                      <div className="bg-gray-800 rounded-lg px-4 py-3 border-l-2 border-violet-600">
                        <p className="text-xs text-violet-400 font-medium mb-1">Réponse admin</p>
                        <p className="text-sm text-gray-300 whitespace-pre-wrap">{msg.reply}</p>
                      </div>
                    )}

                    {replyingTo === msg.id && (
                      <div className="flex flex-col gap-2">
                        <textarea value={replyText} onChange={e => setReplyText(e.target.value)}
                          placeholder="Écrire une réponse ou note interne..." rows={3}
                          className="w-full px-3 py-2 rounded bg-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" />
                        <div className="flex gap-2">
                          <button onClick={() => handleReply(msg.id)}
                            className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 rounded text-xs font-medium transition-colors">
                            Enregistrer
                          </button>
                          <button onClick={() => { setReplyingTo(null); setReplyText('') }}
                            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors">
                            Annuler
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-1 pt-1 border-t border-gray-800">
                      <button onClick={() => toggleRead(msg)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                        {msg.read ? <FiEyeOff size={13} /> : <FiEye size={13} />}
                        {msg.read ? 'Non lu' : 'Lu'}
                      </button>
                      <button onClick={() => openReply(msg)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs text-gray-400 hover:text-violet-400 hover:bg-gray-800 transition-colors">
                        <FiMessageSquare size={13} /> Répondre
                      </button>
                      <button onClick={() => toggleArchive(msg)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs text-gray-400 hover:text-yellow-400 hover:bg-gray-800 transition-colors">
                        <FiArchive size={13} /> {msg.archived ? 'Désarchiver' : 'Archiver'}
                      </button>
                      <button onClick={() => handleDeleteMessage(msg.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors ml-auto">
                        <FiTrash2 size={13} /> Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── CHAT TAB ─────────────────────────────────────── */}
        {activeTab === 'chat' && (
          <div className="flex flex-col bg-gray-900 rounded-xl overflow-hidden" style={{ height: '600px' }}>

            {/* Chat header: stats + search + clear */}
            <div className="px-4 py-3 border-b border-gray-800 flex flex-col gap-2 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex gap-4 text-xs text-gray-400">
                  <span><span className="text-white font-medium">{allMessages.length}</span> messages</span>
                  <span><span className="text-violet-400 font-medium">{uniqueChatUsers}</span> utilisateurs</span>
                </div>
                {allMessages.length > 0 && (
                  <button onClick={handleClearChat}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs text-gray-500 hover:text-red-400 hover:bg-gray-800 border border-gray-700 hover:border-red-900 transition-colors">
                    <FiTrash2 size={12} /> Vider
                  </button>
                )}
              </div>
              {/* Search */}
              <div className="relative">
                <FiSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input value={chatSearch} onChange={e => setChatSearch(e.target.value)}
                  placeholder="Filtrer par utilisateur..."
                  className="w-full pl-8 pr-7 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-xs placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-violet-500" />
                {chatSearch && (
                  <button onClick={() => setChatSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                    <FiX size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
              {filteredChat.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-600 py-16">
                  <FiMessageCircle size={32} className="mb-3" />
                  <p className="text-sm">{chatSearch ? 'Aucun résultat' : 'Aucun message dans le chat'}</p>
                </div>
              ) : (
                filteredChat.map((msg) => {
                  const isAdmin = msg.username === 'Admin'
                  return (
                    <div key={msg.id} className={`flex items-end gap-2 group ${isAdmin ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Avatar (only for others) */}
                      {!isAdmin && (
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 ${getColor(msg.username)}`}>
                          {getInitial(msg.username)}
                        </div>
                      )}

                      <div className={`flex flex-col gap-0.5 max-w-[70%] ${isAdmin ? 'items-end' : 'items-start'}`}>
                        {/* Username label */}
                        <span className="text-xs text-gray-500 px-1">{msg.username}</span>

                        <div className="flex items-end gap-2">
                          {/* Delete button on hover */}
                          {isAdmin && (
                            <button onClick={() => handleDeleteChatMsg(msg)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-gray-600 hover:text-red-400 transition-all shrink-0">
                              <FiTrash2 size={12} />
                            </button>
                          )}

                          {/* Bubble */}
                          <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                            isAdmin
                              ? 'bg-violet-600 text-white rounded-br-sm'
                              : 'bg-gray-800 text-gray-100 rounded-bl-sm'
                          }`}>
                            {msg.text}
                          </div>

                          {!isAdmin && (
                            <button onClick={() => handleDeleteChatMsg(msg)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-gray-600 hover:text-red-400 transition-all shrink-0">
                              <FiTrash2 size={12} />
                            </button>
                          )}
                        </div>

                        {/* Timestamp */}
                        <span className="text-xs text-gray-600 px-1">
                          {formatTime(msg.timestamp || msg.created_at)}
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Input bar */}
            <form onSubmit={sendChatMessage} className="flex items-center gap-2 px-4 py-3 border-t border-gray-800 shrink-0">
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Message en tant qu'Admin..."
                className="flex-1 px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <button type="submit" disabled={!chatInput.trim()}
                className="w-9 h-9 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-colors shrink-0">
                <FiSend size={15} />
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  )
}
