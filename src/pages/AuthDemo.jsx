import { useState } from 'react';
import { register, login, refresh, meOrders } from '../api/auth';
import { getAccessToken } from '../api/client';

export default function AuthDemo() {
  const [email, setEmail] = useState('test@mail.com');
  const [password, setPassword] = useState('S3guro_123');
  const [log, setLog] = useState('');

  const logLine = (x) => setLog((p) => `${p}\n${x}`);

  return (
    <div style={{maxWidth:480, margin:'32px auto', fontFamily:'system-ui', display:'grid', gap:10}}>
      <h2>Auth Playground</h2>

      <input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />

      <button onClick={async()=>{
        try { await register({ first_name:'Test', last_name:'User', email, password });
          logLine(' Registered'); } catch(e){ logLine(` Register: ${e.message}`); }
      }}>Register</button>

      <button onClick={async()=>{
        try { const r = await login({ email, password });
          logLine(' Logged in. Access token set');
          logLine('token (first 24): ' + (r.accessToken||'').slice(0,24) + '...');
        } catch(e){ logLine(` Login: ${e.message}`); }
      }}>Login</button>

      <button onClick={async()=>{
        try { const r = await refresh(); logLine(' Refreshed token (first 24): '+(r.accessToken||'').slice(0,24)+'...'); }
        catch(e){ logLine(` Refresh: ${e.message}`); }
      }}>Refresh</button>

      <button onClick={async()=>{
        try { const r = await meOrders(); logLine('📦 My orders: ' + JSON.stringify(r)); }
        catch(e){ logLine(` /orders/my: ${e.message}`); }
      }}>/orders/my</button>

      <div style={{whiteSpace:'pre-wrap', background:'#111', color:'#0f0', padding:12, borderRadius:8, minHeight:120}}>
        <b>Access token?</b> {getAccessToken() ? 'YES' : 'NO'}
        {'\n'}
        {log || 'Log here…'}
      </div>
    </div>
  );
}
