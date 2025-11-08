'use client'

import './stylesHistory.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadUser } from '../../api/session';
import { api } from '../../api/client';
import Header from "../../components/header"
import Footer from "../../components/footer"

export default function PurchaseHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const user = loadUser();
    if (!user) {
      router.push('/login');
      return;
    }

    async function fetchHistory() {
      try {
        const data = await api(`/orders/user`);
        if (data.error) {
          setError(data.error);
          setHistory([]);
        } else if (Array.isArray(data)) {
          setHistory(data);
        } else {
          setError('Invalid data format');
          setHistory([]);
        }
      } catch (err: any) {
        setError(err.message || 'Error loading purchase history');
        setHistory([]);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [router]);

  if (loading) return <p className="loading-text">Loading...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (history.length === 0) return <p className="empty-text">You haven’t made any purchases yet.</p>;

  return (
    <>
      <Header />
      <section className="history">
        <div className="history-container">
          <h1 className="history-title">P U R C H A S E -  H I S T O R Y</h1>

          <div className="history-grid">
            {history.map(order => (
              <div key={order.id_order} className="history-card">
                <img src="/img/ilustracion2.png" className="history-cover" alt="game" />
                <h2 className="history-game">Order #{order.id_order}</h2>
                <p><strong>Total:</strong> Q{order.total}</p>
                <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer topDivider />
    </>
  );
}