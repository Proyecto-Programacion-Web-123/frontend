'use client'
import { useState } from 'react'
import './globals.css'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { login } from '../../api/auth'
import { saveUser } from '../../api/session'

export default function LoginPage() {
  const [email, setEmail] = useState('test@mail.com')
  const [password, setPassword] = useState('S3guro_123')
  const [msg, setMsg] = useState<{text:string,err?:boolean}>({text:''})
  const router = useRouter()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg({text:'...'})
    try {
      const out = await login({ email, password })
      // save user and go to Home
      if (out?.user) saveUser(out.user)
      setMsg({text:`Welcome, ${out?.user?.email ?? 'user'}`})
      router.push('/') // redirect to home
    } catch (e:any) {
      setMsg({text: e.message || 'Error', err: true})
    }
  }

  return (
    <main className="auth-wrap">
      <section className="auth-card">
        <h1 className="auth-title">L O G - I N</h1>
        <p className="auth-subtitle">Sign in to shop and view your order history</p>

        <form className="auth-form" onSubmit={onSubmit}>
          <label className="auth-label">Email</label>
          <input className="auth-input" value={email} onChange={e=>setEmail(e.target.value)} />

          <label className="auth-label">Password</label>
          <input type="password" className="auth-input" value={password} onChange={e=>setPassword(e.target.value)} />

          <div className="auth-actions">
            <button className="btn-brand" type="submit">Sign in</button>
            <Link href="/register" className="btn-ghost">Create account</Link>
          </div>
        </form>

        <div className={`auth-msg ${msg.err ? 'err':''}`}>{msg.text}</div>
        <p className="auth-small">Forgot your password? <a className="auth-link" href="#">Recover</a></p>
      </section>
    </main>
  )
}
