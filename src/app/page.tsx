'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import './stylesHome.css'
import { loadUser, clearUser } from '../api/session'
import { logoutAll } from '../api/auth'
import { setAccessToken } from '../api/client'
import Header from "../components/header"
import Footer from "../components/footer"
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

export default function Home() {
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
    <>
    <Header />


<section className="begin">
  <div className="begin-content">
    <section className="home" id="home">
      <img src="/img/logo.png" className="logo" alt="Logo TERMN"/>
    </section>

    <div className="marquee-container">
      <div className="marquee-track">
    <div className="marquee-text">IT'S DANGEROUS TO GO ALONE TAKE THIS • DO A BARREL ROLL • WAR NEVER CHANGES • FINISH HIM • HADOUKEN • PRAISE THE SUN • FUS RO DAH • WOULD YOU KINDLY • THE CAKE IS A LIE • SNAKE SNAAAAKE • GET OVER HERE • I'M COMMANDER SHEPARD • OBJECTION • NOTHING IS TRUE EVERYTHING IS PERMITTED • KEPT YOU WAITING HUH • GROVE STREET HOME • WELCOME TO THE WORLD OF SURVIVAL HORROR</div>
      <div className="marquee-text">IT'S DANGEROUS TO GO ALONE TAKE THIS • DO A BARREL ROLL • WAR NEVER CHANGES • FINISH HIM • HADOUKEN • PRAISE THE SUN • FUS RO DAH • WOULD YOU KINDLY • THE CAKE IS A LIE • SNAKE SNAAAAKE • GET OVER HERE • I'M COMMANDER SHEPARD • OBJECTION • NOTHING IS TRUE EVERYTHING IS PERMITTED • KEPT YOU WAITING HUH • GROVE STREET HOME • WELCOME TO THE WORLD OF SURVIVAL HORROR</div>
     </div>
    </div>

    <div className="marquee-container">
      <div className="marquee-track reverse">
      <div className="marquee-text">NES • SEGA GENESIS • SUPER NINTENDO • VIRTUAL BOY • NINTENDO 64 • DUALSHOCK • DREAMCAST • GAMECUBE • EYE TOY • WII REMOTE • XBOX 360 • PLAYSTATION MOVE • PS VITA • KINECT • STEAM DECK • POWER GLOVE • NINTENDO LABO • GAME BOY ADVANCE SP • LIGHT GUN • DDR DANCE PAD • ANALOG POCKET • ATARI LYNX • RAZER HYDRA • SIXAXIS • JAGUAR CONTROLLER</div>
      <div className="marquee-text">NES • SEGA GENESIS • SUPER NINTENDO • VIRTUAL BOY • NINTENDO 64 • DUALSHOCK • DREAMCAST • GAMECUBE • EYE TOY • WII REMOTE • XBOX 360 • PLAYSTATION MOVE • PS VITA • KINECT • STEAM DECK • POWER GLOVE • NINTENDO LABO • GAME BOY ADVANCE SP • LIGHT GUN • DDR DANCE PAD • ANALOG POCKET • ATARI LYNX • RAZER HYDRA • SIXAXIS • JAGUAR CONTROLLER</div>
     </div>
    </div>

    <section className="hero-section" id="hero">
      <p className="hero-text">WHERE ALL GAMES CONVERGE • A TERMINAL BETWEEN WORLDS • ACCESS ALL KINDS OF GAMING CONTENT</p>
      <a href="#hab" className="btn-discover">DISCOVER GAMES</a>
    </section>
  </div>


  <div className="begin-image">
  <img src="/img/ilustracion.png" alt="Ilustración Elden Ring" className="eldenring"/>
  </div>
</section>

<section className="trending" id="trending">
  <h2 className="trendingtittle">T R E N D I N G</h2>
  <p className="subtrending">Discover the most relevant titles right now</p>

  {loading ? (
    <div className="loading-container">
      <p>Loading products...</p>
    </div>
  ) : (
    <div className="trending-grid">
      {trendingProducts.slice(0, 4).map(product => (
        <div key={product.id_product} className="card">
          <Link href={`/product/${product.id_product}`}>
          <div className="cardimg">
            {product.discount && <div className="discount-badge">-{product.discount}%</div>}
            {product.is_new && <div className="new-badge">NEW</div>}
            <img src={product.image_url} className="doom-eternal" alt={product.name} />
          </div>

          <div className="cardtext">
            <div className="titelcard">
              <div className="Gamename">{product.name}</div>
              <div className="price-group">
                <div className="price">Q{product.price}</div>
                {product.old_price && <div className="oldprice">Q{product.old_price}</div>}
              </div>
            </div>
            <div className="Gameinfo">{product.description}</div>
          </div>
</Link>
          <div className="cardbutton">
            <button
              className="btn-cart"
              onClick={() => {
                const user = loadUser()
                if (!user) {
                  alert('Debes iniciar sesión para comprar')
                  window.location.href = '/login'
                  return
                }
                window.location.href = `/buy/${product.id_product}`
              }}
            >
              ADD TO CART <i className="fa-solid fa-circle-plus" style={{ color: '#F9F91C' }}></i>
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</section>



<section className="discount">
  <div className="discountcard">
    <div className="cardimg">
      <div className="off-badge">35% OFF</div>
      <img src="/img/kingdom.png" className="doom-eternal"/>
    </div>
    <div className="discountcardbutton">
      <a href="#hab" className="btn-discount">SHOW MORE &gt;&gt; </a>
    </div>
  </div>
</section>

<section className="features" id="features">
  <div className="features-header">
     <h2 className="featuretittle">C A T E G O R I E S</h2>
 <p className="subfeature">Explore our main gaming categories</p>
  </div>

  <div className="features-grid">
    <div className="feature-card">
      <div className="feature-img-container">
        <img src="/img/accion.png" alt="Action games" className="feature-img"/>
      </div>
      <div className="feature-content">
        <h3 className="feature-name">ACTION</h3>
      </div>
    </div>

    <div className="feature-card">
      <div className="feature-img-container">
        <img src="/img/aventura.png" alt="Adventure games" className="feature-img"/>
      </div>
      <div className="feature-content">
        <h3 className="feature-name">ADVENTURE</h3>
      </div>
    </div>

    <div className="feature-card">
      <div className="feature-img-container">
        <img src="/img/estrategia.png" alt="Strategy games" className="feature-img"/>
      </div>
      <div className="feature-content">
        <h3 className="feature-name">STRATEGY</h3>
      </div>
    </div>

    <div className="feature-card">
      <div className="feature-img-container">
        <img src="/img/rpg.png" alt="RPG games" className="feature-img"/>
      </div>
      <div className="feature-content">
        <h3 className="feature-name">ROLEPLAYING</h3>
      </div>
    </div>


    <div className="feature-card">
      <div className="feature-img-container">
        <img src="/img/signalis.png" alt="RPG games" className="feature-img"/>
      </div>
      <div className="feature-content">
        <h3 className="feature-name">HORROR</h3>
      </div>
    </div>

    
    <div className="feature-card">
      <div className="feature-img-container">
        <img src="/img/art.png" alt="RPG games" className="feature-img"/>
      </div>
      <div className="feature-content">
        <h3 className="feature-name">RACING</h3>
      </div>
    </div>

    
  
  </div>
</section>


  <section className="indies-container" id="indie">
    <section className="higlight-container-faq" id="hcf">
      <h2 className="hcf-tittle">Indie Games</h2>
      <img src="/img/Imagen Faqs.png" alt="sifu" className="JuegoIndie"/>
      <button className="hcf-button">Find our Titles</button>
      </section>
    </section>

    <section className="faq-container" id="faq">
  <h2 className="faq-title">FAQ</h2>

  <div className="faq-content">
    <div className="faq-categories">
      <button className="faq-category active">Accounts</button>
      <button className="faq-category">Purchases</button>
      <button className="faq-category">Delivery & Keys</button>
    </div>

    <div className="faq-list">
      <div className="faq-item">
        <div className="faq-question">
          <span>Do I need an account to buy games?</span>
          <span className="faq-toggle">−</span>
        </div>
        <div className="faq-answer">
          Yes, you need to create an account to complete your purchase and access your game keys.
        </div>
      </div>

      <div className="faq-item">
        <div className="faq-question">
          <span>Can I request a refund?</span>
          <span className="faq-toggle">+</span>
        </div>
        <div className="faq-answer hidden">
          Refunds are available within 14 days of purchase, as long as the game key hasn't been redeemed.
        </div>
      </div>

      <div className="faq-item">
        <div className="faq-question">
          <span>What payment methods do you accept?</span>
          <span className="faq-toggle">+</span>
        </div>
        <div className="faq-answer hidden">
          We accept credit/debit cards, PayPal, and other local payment methods depending on your region.
        </div>
      </div>

      <div className="faq-item">
        <div className="faq-question">
          <span>How will I receive my game after purchase?</span>
          <span className="faq-toggle">+</span>
        </div>
        <div className="faq-answer hidden">
          Game keys are delivered instantly via email and will also be available in your account dashboard.
        </div>
      </div>

      <div className="faq-item">
        <div className="faq-question">
          <span>What platforms are the game keys for?</span>
          <span className="faq-toggle">+</span>
        </div>
        <div className="faq-answer hidden">
          Each product page specifies the platform (e.g. Steam, Epic Games, Origin). Please check before purchasing.
        </div>
      </div>
    </div>
  </div>
</section>


<Footer/>
    </>
  )
}
