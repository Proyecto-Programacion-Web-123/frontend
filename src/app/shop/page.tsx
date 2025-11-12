'use client'

import { FC, useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons'
import { loadUser, clearUser } from '../../api/session'
import FilterSelect from "../shop/FilterSelect";
import Header from "../../components/header"
import Footer from "../../components/footer"
import './stylesShop.css';

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

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const Shop: FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API}/products`);
      const data = await res.json();

      const proc = data.map((p: any) => {
        let url = p.image_url || "default-image.png";
        if (url.startsWith('/img/')) url = url.replace('/img/', '');
        return { ...p, image_url: url };
      });

      setProducts(proc);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <Header />

      <section className="trending2" id="trending2">
        <h2 className="trendingtittle2">S H O P</h2>

        <section className="search-bar">
          <div className="search-container">
            <input type="text" placeholder="Search games..." className="search-input" />
            <div className="filters">
              <FilterSelect options={["Filter by", "Discount", "Price: Low", "Price: High"]}/>
              <FilterSelect options={["Sort by", "A - Z", "Z - A", "Newest"]}/>
            </div>
          </div>
        </section>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="trending-grid2">
            {products.map(product => (
              <div key={product.id_product} className="card">
                <Link href={`/product/${product.id_product}`}>
                  <div className="cardimg">
                    {product.discount && <div className="discount-badge">-{product.discount}%</div>}
                    {product.is_new && <div className="new-badge">NEW</div>}
                    <img src={product.image_url} className="doom-eternal" alt={product.name}/>
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
            ))}
          </div>
        )}
      </section>

      <Footer topDivider />
    </>
  );
};

export default Shop;
