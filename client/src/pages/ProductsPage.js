import React, { useState, useEffect, useCallback } from 'react';
import API from '../utils/api';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import DeleteModal from '../components/DeleteModal';
import { useToast } from '../hooks/useToast';

const EmptyProducts = ({ onAdd }) => (
  <div className="empty-state">
    <svg style={{ width: 52, height: 52, color: '#2a3eb1', opacity: 0.4 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="17" y="17" width="4" height="4" rx="0.5"/>
      <line x1="17" y1="14" x2="21" y2="14"/><line x1="19" y1="14" x2="19" y2="17"/>
    </svg>
    <div className="empty-title">Feels a little empty over here...</div>
    <div className="empty-desc">You can create products without connecting store,<br />you can add products to store anytime</div>
    <button className="btn-primary" style={{ marginTop: 4 }} onClick={onAdd}>Add your Products</button>
  </div>
);

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const { addToast } = useToast();

  const fetchProducts = useCallback(async () => {
    try {
      const res = await API.get('/products');
      setProducts(res.data);
    } catch {
      addToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSave = (product, isEdit) => {
    if (isEdit) {
      setProducts(prev => prev.map(p => p._id === product._id ? product : p));
    } else {
      setProducts(prev => [product, ...prev]);
    }
  };

  const handleTogglePublish = async (product) => {
    try {
      const res = await API.put(`/products/${product._id}/publish`);
      addToast(`Product ${res.data.isPublished ? 'published' : 'unpublished'} successfully`);
      setProducts(prev => prev.map(p => p._id === product._id ? res.data : p));
    } catch {
      addToast('Failed to update product', 'error');
    }
  };

  const handleDelete = async (product) => {
    try {
      await API.delete(`/products/${product._id}`);
      addToast('Product Deleted Successfully');
      setProducts(prev => prev.filter(p => p._id !== product._id));
      setDeleteProduct(null);
    } catch {
      addToast('Failed to delete product', 'error');
    }
  };

  return (
    <>
      <div className="products-header">
        <h1 className="products-title">Products</h1>
        <button className="btn-add" onClick={() => setShowAdd(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Products
        </button>
      </div>

      {loading ? (
        <div className="loading-center">
          <span className="spinner spinner-dark" />
        </div>
      ) : products.length === 0 ? (
        <EmptyProducts onAdd={() => setShowAdd(true)} />
      ) : (
        <div className="products-grid">
          {products.map(p => (
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
