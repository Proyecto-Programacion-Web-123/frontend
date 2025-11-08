// Proyecto/frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';        // crea este si aún no existe
import Login from './pages/Login';      // crea este si aún no existe
import AuthDemo from './pages/AuthDemo';

export default function App() {
  return (
    <BrowserRouter>
        <nav style={{ display: 'flex', gap: 12, fontFamily: 'system-ui' }}>
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/auth-demo">Auth Demo</Link>
        </nav>


      <main style={{ fontFamily: 'system-ui' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth-demo" element={<AuthDemo />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
