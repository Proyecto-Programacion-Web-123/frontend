"use client"
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import './stylescheckout.css';
import { getAccessToken, api } from '../../api/client';
import { loadUser } from '../../api/session';
import Header from "../../components/header"

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams?.get('id');
  const quantityParam = searchParams?.get('quantity');
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showThanks, setShowThanks] = useState(false);
  const [quantity, setQuantity] = useState(1); // ← State para cantidad

  // ✅ Inicializar cantidad desde parámetro URL
  useEffect(() => {
    if (quantityParam) {
      setQuantity(Number(quantityParam));
    }
  }, [quantityParam]);

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
        const data = await api(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        alert('Error loading product');
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
        router.push("/login");
        return;
      }

      // ✅ Calcular total basado en cantidad
      const unitPrice = parseFloat(product.price);
      const total = unitPrice * quantity;

      const orderData = {
        id_user: user.id_user,
        date: new Date().toISOString().split("T")[0],
        total: total,
        items: [
          {
            id_product: product.id_product,
            name: product.name,
            image_url: product.image_url,
            unit_price: unitPrice,
            quantity: quantity, // ← Usar la cantidad seleccionada
            subtotal: total,
          }
        ],
      };

      console.log('📦 Order data:', orderData);

      const orderResult = await api('/orders', {
        method: "POST",
        body: orderData,
      });

      console.log('✅ Order created:', orderResult);
      setShowThanks(true);
    } catch (error) {
      console.error('💥 Error creating order:', error);
      alert("Error creating order: " + error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleConfirm();
  };

  // ✅ Calcular precio total dinámicamente
  const totalPrice = product ? (parseFloat(product.price) * quantity).toFixed(2) : '0.00';

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
              
              {/* ✅ Mostrar información de cantidad y precio */}
              <div className="quantity-section">
                <p><strong>Unit Price:</strong> Q{product.price}</p>
                
                <div className="quantity-selector" style={{ margin: '10px 0' }}>
                  <label htmlFor="checkout-quantity"><strong>Quantity:</strong></label>
                  <select 
                    id="checkout-quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    style={{
                      marginLeft: '10px',
                      backgroundColor: 'black',
                      color: '#F9F91C',
                      border: '1px solid #F9F91C',
                      padding: '5px',
                      borderRadius: '4px'
                    }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                
                <p className="total-price"><strong>Total: Q{totalPrice}</strong></p>
              </div>
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
                Confirm Purchase (Q{totalPrice})
              </button>
            </form>
          </div>

          {showThanks && (
            <div className="thanks-popup">
              <div className="thanks-content">
                <h2>Thank you for your purchase!</h2>
                <p>You bought {quantity} copy(s) of {product.name}</p>
                <p>The game key(s) has been sent to your email.</p>
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