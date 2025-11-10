
import { useEffect, useState } from 'react'

export default function Products() {
  const [items, setItems] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch('/api/products')
        if (!res.ok) {
          const msg = `Error al cargar productos (HTTP ${res.status})`
          if (!cancelled) {
            setItems([])        // evita romper map()
            setError(msg)       // UI de error
          }
          return
        }

        const data = await res.json()
        const list = Array.isArray(data) ? data : []
        if (!cancelled) setItems(list)
      } catch (_e) {
        if (!cancelled) {
          setItems([])          // evita romper map()
          setError('Error de red o parseo')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  if (loading) return <p>Loading…</p>

  return (
    <div>
      {error && <div role="alert">{error}</div>}
      <ul>
        {items.map(p => <li key={p.id}>{p.name}</li>)}
      </ul>
    </div>
  )
}
