import React, { useState, useRef, useEffect } from 'react';
import API from '../utils/api';
import { useToast } from '../hooks/useToast';

const PRODUCT_TYPES = ['Foods', 'Electronics', 'Clothes', 'Beauty Products', 'Others'];

export default function ProductModal({ product, onClose, onSave }) {
  const { addToast } = useToast();
  const isEdit = !!product;
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    name: product?.name || '',
    productType: product?.productType || '',
    quantityStock: product?.quantityStock ?? '',
    mrp: product?.mrp ?? '',
    sellingPrice: product?.sellingPrice ?? '',
    brandName: product?.brandName || '',
    exchangeEligible: product?.exchangeEligible !== false ? 'Yes' : 'No',
  });
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState(product?.images || []);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Please enter product name';
    if (!form.productType) errs.productType = 'Select product type';
    if (!form.quantityStock) errs.quantityStock = 'Enter quantity';
    if (!form.mrp) errs.mrp = 'Enter MRP';
    if (!form.sellingPrice) errs.sellingPrice = 'Enter selling price';
    return errs;
  };

  const handleChange = (field, val) => {
    setForm(prev => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleFiles = (files) => {
    const arr = Array.from(files).slice(0, 10 - existingImages.length - images.length);
    setImages(prev => [...prev, ...arr]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('productType', form.productType);
      fd.append('quantityStock', form.quantityStock);
      fd.append('mrp', form.mrp);
      fd.append('sellingPrice', form.sellingPrice);
      fd.append('brandName', form.brandName);
      fd.append('exchangeEligible', form.exchangeEligible === 'Yes');
      if (isEdit) fd.append('keepImages', JSON.stringify(existingImages));
      images.forEach(img => fd.append('images', img));

      const res = isEdit
        ? await API.put(`/products/${product._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        : await API.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });

      addToast(`Product ${isEdit ? 'updated' : 'added'} Successfully`);
      onSave(res.data, isEdit);
      onClose();
    } catch (err) {
      addToast(err.response?.data?.message || 'Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? 'Edit Product' : 'Add Product'}</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="form-group">
          <label className="form-label">Product Name</label>
          <input
            className={`form-input${errors.name ? ' error' : ''}`}
            placeholder="Please enter product name"
            value={form.name}
            onChange={e => handleChange('name', e.target.value)}
          />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Product Type</label>
          <select
            className={`form-select${errors.productType ? ' error' : ''}`}
            value={form.productType}
            onChange={e => handleChange('productType', e.target.value)}
          >
            <option value="">Select product type</option>
            {PRODUCT_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
          {errors.productType && <p className="field-error">{errors.productType}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Quantity Stock</label>
          <input
            className={`form-input${errors.quantityStock ? ' error' : ''}`}
            type="number"
            placeholder="Total numbers of Stock available"
            value={form.quantityStock}
            onChange={e => handleChange('quantityStock', e.target.value)}
          />
          {errors.quantityStock && <p className="field-error">{errors.quantityStock}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">MRP</label>
          <input
            className={`form-input${errors.mrp ? ' error' : ''}`}
            type="number"
            placeholder="Total numbers of Stock available"
            value={form.mrp}
            onChange={e => handleChange('mrp', e.target.value)}
          />
          {errors.mrp && <p className="field-error">{errors.mrp}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Selling Price</label>
          <input
            className={`form-input${errors.sellingPrice ? ' error' : ''}`}
            type="number"
            placeholder="Total numbers of Stock available"
            value={form.sellingPrice}
            onChange={e => handleChange('sellingPrice', e.target.value)}
          />
          {errors.sellingPrice && <p className="field-error">{errors.sellingPrice}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Brand Name</label>
          <input
            className="form-input"
            placeholder="Total numbers of Stock available"
            value={form.brandName}
            onChange={e => handleChange('brandName', e.target.value)}
          />
        </div>

        <div className="form-group">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <label className="form-label" style={{ marginBottom: 0 }}>Upload Product Images</label>
            {(existingImages.length > 0 || images.length > 0) && (
              <button className="add-more-photos" onClick={() => fileRef.current?.click()}>
                Add More Photos
              </button>
            )}
          </div>
          {(existingImages.length === 0 && images.length === 0) ? (
            <div
              className="upload-area"
              onClick={() => fileRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
            >
              <p className="upload-area-desc">Enter Description</p>
              <span className="upload-area-link">Browse</span>
            </div>
          ) : (
            <div className="upload-preview">
              {existingImages.map((img, i) => (
                <img
                  key={i}
                  src={`${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${img}`}
                  alt=""
                  className="upload-preview-img"
                />
              ))}
              {images.map((img, i) => (
                <img key={i} src={URL.createObjectURL(img)} alt="" className="upload-preview-img" />
              ))}
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={e => handleFiles(e.target.files)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Exchange or return eligibility</label>
          <select
            className="form-select"
            value={form.exchangeEligible}
            onChange={e => handleChange('exchangeEligible', e.target.value)}
          >
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <span className="spinner" /> : (isEdit ? 'Update' : 'Create')}
          </button>
        </div>
      </div>
    </div>
  );
}
