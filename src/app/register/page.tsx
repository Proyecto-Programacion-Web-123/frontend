'use client'
import { useState } from 'react'
import './stylesRegister.css'
import Link from 'next/link'
import { register } from '../../api/auth'

export default function RegisterPage() {
  const [first_name, setFirst] = useState('Test')
  const [last_name, setLast]   = useState('User')
  const [email, setEmail]      = useState('test@example.com')
  const [password, setPass]    = useState('Secure_123')
  const [msg, setMsg]          = useState<{text:string,err?:boolean}>({text:''})

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg({text:'...'})
    try {
      await register({ first_name, last_name, email, password })
      setMsg({text:'Account created. You can now log in.'})
    } catch (e:any) {
      setMsg({text: e.message || 'Error', err: true})
    }
  }

  return (
    <main className="auth-wrap">
      <section className="auth-card">
        <h1 className="auth-title">R E G I S T E R</h1>
        <p className="auth-subtitle">Join us to shop and save your shop history</p>

        <form className="auth-form" onSubmit={onSubmit}>
          <label className="auth-label">First name</label>
          <input className="auth-input" value={first_name} onChange={e=>setFirst(e.target.value)} />

          <label className="auth-label">Last name</label>
          <input className="auth-input" value={last_name} onChange={e=>setLast(e.target.value)} />

          <label className="auth-label">Email</label>
          <input className="auth-input" value={email} onChange={e=>setEmail(e.target.value)} />

          <label className="auth-label">Password</label>
          <input type="password" className="auth-input" value={password} onChange={e=>setPass(e.target.value)} />

          <div className="auth-actions">
            <button className="btn-brand" type="submit">Register</button>
            <Link href="/login" className="btn-ghost">I already have an account</Link>
          </div>
        </form>

        <div className={`auth-msg ${msg.err ? 'err':''}`}>{msg.text}</div>
      </section>
    </main>
  )
}
