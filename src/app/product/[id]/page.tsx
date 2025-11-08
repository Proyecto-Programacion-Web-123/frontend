'use client'

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Header from "../../../components/header"
import Footer from "../../../components/footer"
import './stylesProduct.css'
import { loadUser, clearUser } from '../../../api/session'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons'
interface Product {
  id_product: number;
  name: string;
  price: number;
  image_url: string;
  release_date: string;
}

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export default function ProductPage() {
  const params = useParams()
  const id = params?.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProduct = async () => {
    try {
      const res = await fetch(`${API}/products/${id}`)
      const data = await res.json()
let url = data.image_url || "default-image.png"
if (!url.startsWith("/")) url = "/" + url
      setProduct({
        ...data,
        image_url: url
      })
    } catch (e) {
      console.error("Error fetching product:", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [id])

  if (loading) return <div>Loading...</div>
  if (!product) return <div>Product not found</div>

  return (
    <>
      <Header />

<section
  className="product"style={{'--bg-image': `url(${product.image_url})`} as React.CSSProperties}>
        <div className="product-grid">
          <div className="card2">
            <div className="cardimg2">
           <img src={product.image_url} className="doom-eternal" alt={product.name}/>
            </div>

            <div className="cardtext2">
              <div className="titelcard">
                <div className="Gamename2">{product.name}</div>
              </div>
   <div className="Gameinfo2">
                <p>
                  <strong>Publisher:</strong> Bethesda Softworks
                </p>
                <p>
                  <strong>Platform:</strong> PS4
                </p>
              </div>
              <div className="price-group2">
                <div className="price2">Q{product.price}</div>
              </div>
            </div>

                <div className="cardbutton2">
                  <button className="btn-cart"onClick={() => {
                    const user = loadUser();
                      if (!user) {
                        alert('You must be logged in to purchase');
                         window.location.href = '/login';
                          return;}
      window.location.href = `/buy/${product.id_product}`;
    }}
  >
    ADD TO CART <FontAwesomeIcon icon={faCirclePlus} style={{ color: "#F9F91C" }} />
  </button>
</div>
         
          </div>
        </div>
      </section>

      {/* GAME INFORMATION SECTION */}
      <section className="game-info-section">
        <div className="game-info-container">
          <h2>A B O U T</h2>
          <p>
            Doom: The Dark Ages takes you to a brutal medieval era where the
            Slayer faces the roots of Hell in an ancient war. Armed with steel
            and demonic technology, you must master a new arsenal that combines
            brutality and precision — from the shield cannon to the demonic
            crossbow. Unlike previous titles, combat becomes more tactical, with
            large-scale battles and enemies that demand different strategies.
          </p>
          <p>
            Ride an infernal beast to crush legions or pilot a colossal mech in
            sieges that redefine the intensity of combat. Each level is built
            with dark, imposing architecture, filled with secrets, alternate
            routes, and enemies that punish every mistake.
          </p>
          <p>
            More than ever, Doom: The Dark Ages transforms combat speed into an
            act of mastery and control: every hit, shot, and execution
            contributes to a perfectly orchestrated symphony of chaos.
          </p>
        </div>
      </section>


      {/* MECHANICS SECTION */}
      <section className="mechanics-section">
        <h2>K E Y - M E C H A N I C S</h2>
        <div className="mechanics-grid">
          <div className="mechanic-card">
            <img src="/img/doomWeapon.png" alt="Slayer’s Arsenal" />
            <p>Master a heavy weapons arsenal with interchangeable mods.</p>
          </div>

          <div className="mechanic-card">
            <img src="/img/doomMov.png" alt="Mobility" />
            <p>
              Fight mounted on an infernal beast or control a gigantic mech in
              epic-scale battles.
            </p>
          </div>

          <div className="mechanic-card">
            <img src="/img/doomKills.png" alt="Glory Kills" />
            <p>
              Execute enemies to recover health and maintain your offensive
              momentum.
            </p>
          </div>

          <div className="mechanic-card">
            <img src="/img/doomShield.png" alt="Fire and Ice" />
            <p>
              Use your throwable shield to block enemy attacks or hurl it to
              destroy hordes from a distance.
            </p>
          </div>
        </div>
      </section>

         {/* PLATFORM INFORMATION SECTION - DOOM ETERNAL */}
      <section className="platform-section">
        <div className="platform-container">
          <h2>I N F O R M A T I O N</h2>
          <ul className="platform-details">
            <li>
              <strong>Platform:</strong> PS4
            </li>
        <li><strong>Release Date:</strong> {product.release_date  ? new Date(product.release_date).toISOString().split("T")[0]    : ''}</li>
            <li>
              <strong>Publisher:</strong> Bethesda Softworks
            </li>
            <li>
              <strong>Genres:</strong> Action, First-Person Shooter
            </li>
          </ul>

          <p>
            Doom Eternal brings fast-paced and brutal combat to a whole new
            level on PS4. Face demonic hordes in an epic campaign full of
            devastating weapons and hellish environments.
          </p>

          <p>
            This title is compatible with PS5 via backward compatibility, but
            some exclusive PS4 features may not be available. Visit{" "}
            <a
              href="https://www.playstation.com/bc"
              target="_blank"
              rel="noopener noreferrer"
            >
              PlayStation.com/bc
            </a>{" "}
            for more details.
          </p>

          <p>
            A PlayStation Network account is required to access online modes.
            Its use is subject to the{" "}
            <a
              href="https://www.playstationnetwork.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Service
            </a>{" "}
            and privacy policy of your country.
          </p>

          <p>
            © 2020 id Software. Published by Bethesda Softworks. All rights
            reserved. The software is subject to a limited license under the{" "}
            <a
              href="https://www.playstation.com/softwarelicense/sp"
              target="_blank"
              rel="noopener noreferrer"
            >
              PlayStation Terms of Use
            </a>
            .
          </p>
        </div>
      </section>

      <Footer />
    </>
  )
}
