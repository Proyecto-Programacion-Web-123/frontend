"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import './stylescheckout.css';
import { getAccessToken } from '../../api/client';
import { loadUser } from '../../api/session';
import Header from "../../components/header"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";


function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams?.get('id');

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showThanks, setShowThanks] = useState(false);

  useEffect(() => {
    const user = loadUser();
    if (!user) {
      alert("You must log in to continue");
      router.push("/login");
      return;
    }

    if (!id) return;

    async function fetchProduct() {
      try {
        const res = await fetch(`${API}/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id, router]);

  const handleConfirm = async () => {
    try {
      const user = loadUser();
      const token = getAccessToken();
      if (!user || !token) {
        alert("Authentication error");
        return;
      }

      const orderRes = await fetch(`${API}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_user: user.id_user,
          date: new Date().toISOString().split("T")[0],
          total: product.price,
          items: [
            {
              id_product: product.id_product,
              name: product.name,
              image_url: product.image_url,
              unit_price: product.price,
              quantity: 1,
              subtotal: product.price,
            }
          ],
        }),
      });

      if (!orderRes.ok) {
        alert("Error creating order");
        return;
      }

      setShowThanks(true);
    } catch {
      alert("Unexpected error");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleConfirm();
  };

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <>
      <Header />

      <section className="checkout">
        <div className="checkout-container">
          <h1 className="checkout-title">C H E C K O U T</h1>

          <div className="checkout-grid">

            <div className="checkout-card">
              <img
                src={product.image_url.startsWith("/img/") ? product.image_url.replace("/img/", "/") : product.image_url}
                alt={product.name}
                className="checkout-cover"
              />
              <h2 className="checkout-game">{product.name}</h2>
              <p><strong>{product.description}</strong></p>
              <p><strong>Price:</strong> Q{product.price}</p>
            </div>

            <form className="checkout-form" onSubmit={handleSubmit}>
              <label>Card Number</label>
              <input type="text" maxLength={16} required />

              <label>Name on Card</label>
              <input type="text" required />

              <div className="card-row">
                <div className="card-field">
                  <label>Expiration</label>
                  <input type="text" placeholder="MM/YY" required />
                </div>
                <div className="card-field">
                  <label>CVV</label>
                  <input type="text" maxLength={3} required />
                </div>
              </div>

              <label>Postal Code</label>
              <input type="text" required />

              <button type="submit" className="checkout-btn">
                Confirm Purchase
              </button>
            </form>
          </div>

          {showThanks && (
            <div className="thanks-popup">
              <div className="thanks-content">
                <h2>Thank you for your purchase</h2>
                <p>The game key has been sent to your email.</p>
                <button onClick={() => router.push("/")}>Close</button>
              </div>
            </div>
          )}
        </div>
      </section>

      <footer className="footer">
        <hr className="footer-divider2"/>
        <p className="footer-copy">2025 Termn. All rights reserved.</p>
      </footer>
    </>
  );
}


export default function Checkout() {
  return (
    <Suspense fallback={<div>Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}