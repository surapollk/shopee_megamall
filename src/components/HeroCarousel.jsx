'use client';

import { useState, useEffect } from 'react';

export default function HeroCarousel({ products }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!products || products.length === 0) return;
    
    // Rotate every 4 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [products]);

  if (!products || products.length === 0) return null;

  const activeProduct = products[currentIndex];

  return (
    <div className="hero-carousel-container">
      <div className="hero-carousel-wrapper">
        {products.map((product, index) => {
          let className = 'hero-product-card';
          if (index === currentIndex) className += ' active';
          else if (index === (currentIndex - 1 + products.length) % products.length) className += ' prev';
          else className += ' next';

          return (
            <a 
              key={product.id} 
              href={product.product_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className={className}
            >
              <div className="hero-product-badge">🔥 สินค้าขายดี</div>
              <div className="hero-product-image-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.image_link} alt={product.title} className="hero-product-image" />
              </div>
              <div className="hero-product-info">
                <h4 className="hero-product-title">{product.title}</h4>
                <div className="hero-product-bottom">
                  <span className="hero-product-price">฿{product.price.toLocaleString('th-TH')}</span>
                  <span className="hero-product-sold">ขายแล้ว {(product.item_sold / 1000).toFixed(1)}k ชิ้น</span>
                </div>
              </div>
            </a>
          );
        })}
      </div>
      
      <div className="hero-carousel-indicators">
        {products.map((_, index) => (
          <button 
            key={index} 
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
