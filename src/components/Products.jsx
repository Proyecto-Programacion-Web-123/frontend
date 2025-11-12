import { useEffect, useState } from 'react'

export default function Products() {
  const [items, setItems] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        setError(null)

        // Usa la URL completa o configura proxy
        const res = await fetch('http://localhost:3001/products')
        
        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`)
        }

        const data = await res.json()
        if (!cancelled) {
          setItems(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        if (!cancelled) {
          setItems([])
          setError(err.message || 'Error al cargar productos')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [isClient])

  if (!isClient || loading) return <p>Loading…</p>

  return (
    <div>
      {error && <div role="alert" style={{color: 'red'}}>{error}</div>}
      
      {/* Ejemplo de uso de imágenes */}
      <img src="/ilustracion.png" alt="Ilustración" style={{width: '100px'}} />
      <img src="/rpg.png" alt="RPG" style={{width: '100px'}} />
      
      <ul>
        {items.map(p => (
          <li key={p.id}>{p.name} - ${p.price}</li>
        ))}
      </ul>
    </div>
  )
}