import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import API from '../hooks/useApi'
import { FiTrash2, FiEdit, FiPlus, FiLogOut } from 'react-icons/fi'

const EMPTY = { title: '', description: '', tags: '', github: '', live: '', image: '' }

export default function Admin() {
  const { token, isAdmin, login, logout } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [projects, setProjects] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')

  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (isAdmin) fetchProjects()
  }, [isAdmin])

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

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce projet ?')) return
    await API.delete(`/api/projects/${id}`, { headers })
    fetchProjects()
  }

  const startEdit = (p) => {
    setEditing(p.id)
    setForm({ ...p, tags: p.tags.join(', ') })
  }

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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Panneau Admin</h1>
          <button onClick={logout} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <FiLogOut size={16} /> Déconnexion
          </button>
        </div>

        {/* Form */}
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

        {/* Projects list */}
        <div className="flex flex-col gap-3">
          {projects.map(p => (
            <div key={p.id} className="bg-gray-900 rounded-xl p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold">{p.title}</p>
                <p className="text-sm text-gray-400">{p.tags.join(', ')}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(p)} className="p-2 text-gray-400 hover:text-violet-400 transition-colors"><FiEdit size={16} /></button>
                <button onClick={() => handleDelete(p.id)} className="p-2 text-gray-400 hover:text-red-400 transition-colors"><FiTrash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}