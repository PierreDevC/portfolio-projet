import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import API from '../hooks/useApi'
import {
  FiTrash2, FiEdit, FiPlus, FiLogOut,
  FiEye, FiEyeOff, FiArchive, FiMessageSquare, FiInbox
} from 'react-icons/fi'

const EMPTY = { title: '', description: '', tags: '', github: '', live: '', image: '' }

export default function Admin() {
  const { token, isAdmin, login, logout } = useAuth()
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]     = useState('')

  // Tab
  const [activeTab, setActiveTab] = useState('projects')

  // Projects state
  const [projects, setProjects] = useState([])
  const [form, setForm]         = useState(EMPTY)
  const [editing, setEditing]   = useState(null)

  // Messages state
  const [messages, setMessages]   = useState([])
  const [msgFilter, setMsgFilter] = useState('all')
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText]   = useState('')

  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (isAdmin) {
      fetchProjects()
      fetchMessages()
    }
  }, [isAdmin])

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

  // ── Messages ──────────────────────────────────────────────
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
    return !m.archived // 'all' = non-archived
  })

  const unreadCount   = messages.filter(m => !m.archived && !m.read).length
  const archivedCount = messages.filter(m => m.archived).length

  const formatDate = (iso) => new Date(iso).toLocaleDateString('fr-CA', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  const getInitial = (name) => name?.charAt(0).toUpperCase() || '?'
  const avatarColors = [
    'bg-violet-500', 'bg-blue-500', 'bg-green-500',
    'bg-yellow-500', 'bg-pink-500', 'bg-teal-500'
  ]
  const getColor = (name) => avatarColors[(name?.charCodeAt(0) || 0) % avatarColors.length]

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
          <button onClick={logout} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <FiLogOut size={16} /> Déconnexion
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 mb-8 border-b border-gray-800 pb-0">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 text-sm font-medium rounded-t transition-colors ${
              activeTab === 'projects'
                ? 'bg-gray-900 text-violet-400 border border-b-gray-900 border-gray-700'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Projets
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t transition-colors ${
              activeTab === 'messages'
                ? 'bg-gray-900 text-violet-400 border border-b-gray-900 border-gray-700'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <FiInbox size={14} />
            Messages
            {unreadCount > 0 && (
              <span className="bg-violet-600 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">
                {unreadCount}
              </span>
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
            {/* Stats */}
            <div className="flex gap-6 text-sm text-gray-400 mb-4">
              <span><span className="text-white font-medium">{messages.filter(m => !m.archived).length}</span> total</span>
              <span><span className="text-violet-400 font-medium">{unreadCount}</span> non lus</span>
              <span><span className="text-gray-500 font-medium">{archivedCount}</span> archivés</span>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 mb-6">
              {[
                { key: 'all', label: 'Tous' },
                { key: 'unread', label: 'Non lus' },
                { key: 'archived', label: 'Archivés' },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setMsgFilter(f.key)}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                    msgFilter === f.key
                      ? 'bg-violet-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Message list */}
            {filteredMessages.length === 0 ? (
              <div className="text-center py-16 text-gray-600">
                <FiInbox size={32} className="mx-auto mb-3" />
                <p className="text-sm">Aucun message</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredMessages.map(msg => (
                  <div key={msg.id} className={`bg-gray-900 rounded-xl p-5 flex flex-col gap-3 border-l-4 ${
                    msg.read ? 'border-gray-800' : 'border-violet-500'
                  }`}>
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${getColor(msg.name)}`}>
                          {getInitial(msg.name)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm">{msg.name}</p>
                            {!msg.read && (
                              <span className="w-2 h-2 rounded-full bg-violet-500 inline-block" title="Non lu" />
                            )}
                          </div>
                          <p className="text-xs text-gray-400">{msg.email}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 shrink-0">{formatDate(msg.created_at)}</p>
                    </div>

                    {/* Message body */}
                    <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{msg.message}</p>

                    {/* Reply display */}
                    {msg.reply && (
                      <div className="bg-gray-800 rounded-lg px-4 py-3 border-l-2 border-violet-600">
                        <p className="text-xs text-violet-400 font-medium mb-1">Réponse admin</p>
                        <p className="text-sm text-gray-300 whitespace-pre-wrap">{msg.reply}</p>
                      </div>
                    )}

                    {/* Inline reply form */}
                    {replyingTo === msg.id && (
                      <div className="flex flex-col gap-2">
                        <textarea
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                          placeholder="Écrire une réponse ou note interne..."
                          rows={3}
                          className="w-full px-3 py-2 rounded bg-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReply(msg.id)}
                            className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 rounded text-xs font-medium transition-colors"
                          >
                            Enregistrer
                          </button>
                          <button
                            onClick={() => { setReplyingTo(null); setReplyText('') }}
                            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Action row */}
                    <div className="flex items-center gap-1 pt-1 border-t border-gray-800">
                      <button
                        onClick={() => toggleRead(msg)}
                        title={msg.read ? 'Marquer non lu' : 'Marquer lu'}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                      >
                        {msg.read ? <FiEyeOff size={13} /> : <FiEye size={13} />}
                        {msg.read ? 'Non lu' : 'Lu'}
                      </button>

                      <button
                        onClick={() => openReply(msg)}
                        title="Répondre / noter"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs text-gray-400 hover:text-violet-400 hover:bg-gray-800 transition-colors"
                      >
                        <FiMessageSquare size={13} />
                        Répondre
                      </button>

                      <button
                        onClick={() => toggleArchive(msg)}
                        title={msg.archived ? 'Désarchiver' : 'Archiver'}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs text-gray-400 hover:text-yellow-400 hover:bg-gray-800 transition-colors"
                      >
                        <FiArchive size={13} />
                        {msg.archived ? 'Désarchiver' : 'Archiver'}
                      </button>

                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        title="Supprimer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors ml-auto"
                      >
                        <FiTrash2 size={13} />
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
