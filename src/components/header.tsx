'use client'
import { useState, useEffect } from 'react'
import Link from "next/link";
import './stylesComponents.css';
import { loadUser, clearUser } from '../api/session'
import { logoutAll } from '../api/auth'
import { setAccessToken } from '../api/client'

interface Product {
  id_product: number;
  name: string;
  price: number;
  description: string;
  image_url: string;
  release_date: string;
  old_price?: number | null;
  discount?: number | null;
  is_new?: boolean;
}

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
export default function Header() {

  const [activeFaq, setActiveFaq] = useState<number | null>(0)
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // ====== sesión (usuario logueado) ======
  const [user, setUser] = useState<any | null>(null)

  const fetchTrendingProducts = async () => {
    try {
      const response = await fetch(`${API}/products`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      const processedProducts = data.map((product: any) => {
        let imageUrl = product.image_url || 'default-image.png';
        if (imageUrl && imageUrl.startsWith('/img/')) imageUrl = imageUrl.replace('/img/', '');
        return { ...product, image_url: imageUrl };
      });

      setTrendingProducts(processedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index)
  }

  useEffect(() => {
    // cargar usuario guardado
    setUser(loadUser());

    // sincronizar entre pestañas
    const onStorage = () => setUser(loadUser());
    window.addEventListener('storage', onStorage);

    fetchTrendingProducts();

    return () => window.removeEventListener('storage', onStorage);
  }, [])

  // cerrar sesión
  async function handleLogout() {
    try { await logoutAll(); } catch {}
    setAccessToken('')
    clearUser();
    setUser(null);
  }
  return (
    <header className="header">
  <img src="/img/icono2.png" className="icon2" alt="icon2term" />
      <nav className="nav-desktop">
        <ul>
         <li><Link href="/">HOME</Link></li>
          <li><Link href="/shop">SHOP</Link></li>
          <li><a href="#">ABOUT US</a></li>
          <li><a href="#">BLOG</a></li>
        </ul>
      </nav>

      <div id="menuToggle">
        <input type="checkbox" id="menuCheckbox" />
        <span></span>
        <span></span>
        <span></span>
        <ul id="menu">
          <li><a><Link href="/"><label htmlFor="menuCheckbox">HOME</label></Link></a></li>
          <li><a><Link href="/shop"><label htmlFor="menuCheckbox">SHOP</label></Link></a></li>
          <li><a><label htmlFor="menuCheckbox">ABOUT US</label></a></li>
          <li><a><label htmlFor="menuCheckbox">BLOG</label></a></li>
          <li className="menulogin">
            {user ? (
              <label htmlFor="menuCheckbox">
                <button onClick={handleLogout} className="logout">
                  <a className="login-btn">LOG OUT</a>
                </button>
              </label>
            ) : (
              <Link href="/login">
                <label htmlFor="menuCheckbox">
                  <a className="login-btn">LOG IN</a>
                </label>
              </Link>
            )}
          </li>
        </ul>
      </div>

 <img src="/img/icono2.png" className="icon" alt="icon term" />
      <div>
        {user ? (
     <button onClick={async () => { await handleLogout();window.location.reload();}}className="btn-log-nav">LOG OUT</button>
        ) : (
          <Link href="/login" className="btn-log-nav">LOG IN</Link>
        )}
      </div>

      <Link href="/history">
        <i className="fa-solid fa-bag-shopping shop-icon" aria-hidden="true"></i>
      </Link>
    </header>
  );
}
