import { useState } from 'react';
import { login } from '../api/auth';
import { saveUser } from '../api/session';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('test@mail.com');
  const [password, setPassword] = useState('S3guro_123');
  const [msg, setMsg] = useState('');
  const router = useRouter();

  async function onSubmit(e) {
    e.preventDefault();
    setMsg('...');
    try {
      const user = await login({ email, password });
      saveUser(user); // guardarlo localmente
      setMsg(`Bienvenido, ${user.email}`);
      router.push('/'); // navegar al home
    } catch (e) {
      setMsg('Credenciales inválidas');
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h2>Iniciar sesión</h2>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 10 }}>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Entrar</button>
        <div>{msg}</div>
      </form>
    </div>
  );
}
