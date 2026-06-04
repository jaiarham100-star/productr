import React, { useState, useEffect, useCallback } from 'react';
import API from '../utils/api';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import DeleteModal from '../components/DeleteModal';
import { useToast } from '../hooks/useToast';

const EmptyState = ({ isPublished }) => (
  <div className="empty-state">
    <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="17" y="17" width="4" height="4" rx="0.5"/>
      <line x1="17" y1="14" x2="21" y2="14"/><line x1="19" y1="14" x2="19" y2="17"/>
    </svg>
    <div className="empty-title">
      {isPublished ? 'No Published Products' : 'No Unpublished Products'}
    </div>
    <div className="empty-desc">
      {isPublished
        ? 'Your Published Products will appear here\nCreate your first product to publish'
        : 'Your Unpublished Products will appear here\nCreate your first product to publish'}
    </div>
  </div>
);

export default function HomePage() {
  const [tab, setTab] = useState('published');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const { addToast } = useToast();

  const fetchProducts = useCallback(async () => {
    try {
      const res = await API.get(`/products?published=${tab === 'published'}`);
      setProducts(res.data);
    } catch (err) {
      addToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    setLoading(true);
    fetchProducts();
  }, [fetchProducts]);

  const handleSave = (product, isEdit) => {
    if (isEdit) {
      setProducts(prev => prev.map(p => p._id === product._id ? product : p).filter(p => {
        return tab === 'published' ? p.isPublished : !p.isPublished;
      }));
    } else {
      fetchProducts();
    }
  };

  const handleTogglePublish = async (product) => {
    try {
      const res = await API.put(`/products/${product._id}/publish`);
      addToast(`Product ${res.data.isPublished ? 'published' : 'unpublished'} successfully`);
      setProducts(prev => prev.filter(p => p._id !== product._id));
    } catch (err) {
      addToast('Failed to update product', 'error');
    }
  };

  const handleDelete = async (product) => {
    try {
      await API.delete(`/products/${product._id}`);
      addToast('Product Deleted Successfully');
      setProducts(prev => prev.filter(p => p._id !== product._id));
      setDeleteProduct(null);
    } catch (err) {
      addToast('Failed to delete product', 'error');
    }
  };

  const filtered = products;

  return (
    <>
      <div className="tabs">
        <button className={`tab-btn${tab === 'published' ? ' active' : ''}`} onClick={() => setTab('published')}>
          Published
        </button>
        <button className={`tab-btn${tab === 'unpublished' ? ' active' : ''}`} onClick={() => setTab('unpublished')}>
          Unpublished
        </button>
      </div>

      {loading ? (
        <div className="loading-center">
          <span className="spinner spinner-dark" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState isPublished={tab === 'published'} />
      ) : (
        <div className="products-grid">
          {filtered.map(p => (
            <ProductCard
              key={p._id}
              product={p}
              onEdit={setEditProduct}
              onDelete={setDeleteProduct}
              onTogglePublish={handleTogglePublish}
            />
          ))}
        </div>
      )}

      {(showAdd || editProduct) && (
        <ProductModal
          product={editProduct}
          onClose={() => { setShowAdd(false); setEditProduct(null); }}
          onSave={handleSave}
        />
      )}

      {deleteProduct && (
        <DeleteModal
          product={deleteProduct}
          onClose={() => setDeleteProduct(null)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
