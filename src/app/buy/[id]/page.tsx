'use client';
import "./StylesBuy.css"
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function BuyPage() {
  const params = useParams() as { id: string };
  const router = useRouter();
  const [status, setStatus] = useState("Preparing your purchase...");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState(1); // ← Nueva state para cantidad

  useEffect(() => {
    const id = params.id;
    if (!id) return;

    const fetchProduct = async () => {
      try {
        await new Promise(r => setTimeout(r, 1200));

        const res = await fetch(`http://localhost:3001/products/${id}`);
        if (!res.ok) throw new Error("Error loading product");

        const data = await res.json();
        setProductName(data.name);

        setTimeout(() => {
          // ✅ Guardar producto CON cantidad
          localStorage.setItem("checkoutProduct", JSON.stringify({
            ...data,
            quantity: quantity // ← Guardar cantidad seleccionada
          }));
          setStatus(`${data.name} (x${quantity}) is ready for purchase`);
          
          setTimeout(() => {
            router.push(`/checkout?id=${data.id_product}&quantity=${quantity}`);
          }, 2000);

        }, 500);
      } catch (error) {
        console.error('Fetch error:', error);
        setStatus("Error loading product");
      }
    };

    fetchProduct();
  }, [params.id, router, quantity]); // ← Agregar quantity como dependencia

  return (
    <div className="buying" 
      style={{
        backgroundColor: "black",
        color: "#F9F91C",
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: '"Inter", monospace',
        textAlign: "center"
      }}
    >
      <h2>{status}</h2>
      
      {/* ✅ Selector de cantidad */}
      <div style={{ marginTop: '20px' }}>
        <label htmlFor="quantity" style={{ marginRight: '10px' }}>
          Quantity: 
        </label>
        <select 
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          style={{
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
    </div>
  );
}