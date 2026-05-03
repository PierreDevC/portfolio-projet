import { useState, useEffect } from 'react'
import axios from 'axios'

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001' })

export function useApi(endpoint) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    API.get(endpoint)
      .then(r => setData(r.data))
      .catch(e => {
        console.error(`[useApi] GET ${endpoint} failed:`, e.message)
        setError(e.message)
      })
      .finally(() => setLoading(false))
  }, [endpoint])

  return { data, loading, error }
}

export default API