'use client';
import "./StylesBuy.css"
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function BuyPage() {
  const params = useParams() as { id: string };
  const router = useRouter();
  const [status, setStatus] = useState("Preparing your purchase...");
  const [productName, setProductName] = useState("");

  useEffect(() => {
    const id = params.id;
    if (!id) return;

    const fetchProduct = async () => {
      try {
        // etapa 1: delay de preparación
        await new Promise(r => setTimeout(r, 1200)); // editable

        const res = await fetch(`http://localhost:3000/products/${id}`);
        if (!res.ok) throw new Error("Error");

        const data = await res.json();
        setProductName(data.name);

        // etapa 2: delay final antes de guardar y redirigir
        setTimeout(() => {
          localStorage.setItem("checkoutProduct", JSON.stringify(data));
          setStatus(`${data.name} is ready for purchase`);
          
          setTimeout(() => {
            router.push(`/checkout?id=${data.id_product}`);
          }, 2000); // editable

        }, 500); // editable
      } catch {
        setStatus("Error loading product");
      }
    };

    fetchProduct();
  }, [params.id, router]);

return (

  <div className="buying" 
    style={{
           backgroundColor: "black",
      color: "#F9F91C",
      width: "100vw",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: '"Inter", monospace',
      textAlign: "center"
    }}
  >
    <h2>{status}</h2>
  </div>
);
}