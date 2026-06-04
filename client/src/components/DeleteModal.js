import React, { useState } from 'react';

export default function DeleteModal({ product, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await onConfirm(product);
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal delete-modal">
        <div className="modal-header">
          <h2 className="modal-title">Delete Product</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <p>
          Are you sure you really want to delete this Product{' '}
          <strong>"{product?.name}"</strong> ?
        </p>
        <div className="delete-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-delete" onClick={handleDelete} disabled={loading}>
            {loading ? <span className="spinner" /> : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
