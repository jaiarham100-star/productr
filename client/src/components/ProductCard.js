import React, { useState } from 'react';

const API_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

const PlaceholderIcon = () => (
  <svg className="product-card-img-placeholder" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/>
    <rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/>
  </svg>
);

export default function ProductCard({ product, onEdit, onDelete, onTogglePublish }) {
  const [imgIdx, setImgIdx] = useState(0);
  const hasImages = product.images && product.images.length > 0;

  return (
    <div className="product-card">
      <div className="product-card-img">
        {hasImages ? (
          <>
            <img
              src={`${API_BASE}${product.images[imgIdx]}`}
              alt={product.name}
              onError={e => e.target.style.display = 'none'}
            />
            {product.images.length > 1 && (
              <div className="img-dots">
                {product.images.map((_, i) => (
                  <span
                    key={i}
                    className={`img-dot${i === imgIdx ? ' active' : ''}`}
                    onClick={() => setImgIdx(i)}
                    style={{ cursor: 'pointer' }}
                  />
                ))}
              </div>
            )}
          </>
        ) : <PlaceholderIcon />}
      </div>
      <div className="product-card-body">
        <div className="product-card-name">{product.name}</div>
        <div className="product-meta">
          <div className="product-meta-item">
            <span className="product-meta-label">Product type</span>
            <span className="product-meta-value">{product.productType}</span>
          </div>
          <div className="product-meta-item">
            <span className="product-meta-label">Quantity Stock</span>
            <span className="product-meta-value">{product.quantityStock}</span>
          </div>
          <div className="product-meta-item">
            <span className="product-meta-label">MRP</span>
            <span className="product-meta-value">₹ {product.mrp}</span>
          </div>
          <div className="product-meta-item">
            <span className="product-meta-label">Selling Price</span>
            <span className="product-meta-value">₹ {product.sellingPrice}</span>
          </div>
          <div className="product-meta-item">
            <span className="product-meta-label">Brand Name</span>
            <span className="product-meta-value">{product.brandName || '—'}</span>
          </div>
          <div className="product-meta-item">
            <span className="product-meta-label">Total Number of Images</span>
            <span className="product-meta-value">{product.images?.length || 0}</span>
          </div>
          <div className="product-meta-item" style={{ gridColumn: '1/-1' }}>
            <span className="product-meta-label">Exchange Eligibility</span>
            <span className="product-meta-value">{product.exchangeEligible ? 'YES' : 'NO'}</span>
          </div>
        </div>
        <div className="product-card-actions">
          {product.isPublished ? (
            <button className="btn-unpublish" onClick={() => onTogglePublish(product)}>
              Unpublish
            </button>
          ) : (
            <button className="btn-publish" onClick={() => onTogglePublish(product)}>
              Publish
            </button>
          )}
          <button className="btn-edit" onClick={() => onEdit(product)}>Edit</button>
          <button className="btn-icon" title="Delete" onClick={() => onDelete(product)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
