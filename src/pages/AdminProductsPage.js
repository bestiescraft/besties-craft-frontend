import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { AdminLayout } from '@/components/AdminLayout';

const API = process.env.REACT_APP_API_URL || 'https://besties-craft-backend-1.onrender.com';

const CATEGORIES = [
  { label: 'Bracelets',        value: 'bracelets', emoji: '📿' },
  { label: 'Handmade Flowers', value: 'scarves',   emoji: '🌸' },
  { label: 'Keychains',        value: 'blankets',  emoji: '🔑' },
  { label: 'Hair Accessories', value: 'bags',      emoji: '🎀' },
  { label: 'Gifting Items',    value: 'wool',      emoji: '🎁' },
  { label: 'Crafts',           value: 'crafts',    emoji: '🎨' },
  { label: 'Handmade',         value: 'handmade',  emoji: '🤲' },
  { label: 'General',          value: 'general',   emoji: '📦' },
];

const PRESET_COLORS = [
  { name: 'Red',      hex: '#EF4444' }, { name: 'Pink',     hex: '#EC4899' },
  { name: 'Purple',   hex: '#A855F7' }, { name: 'Blue',     hex: '#3B82F6' },
  { name: 'Sky Blue', hex: '#38BDF8' }, { name: 'Green',    hex: '#22C55E' },
  { name: 'Yellow',   hex: '#EAB308' }, { name: 'Orange',   hex: '#F97316' },
  { name: 'White',    hex: '#F8FAFC' }, { name: 'Black',    hex: '#1E293B' },
  { name: 'Brown',    hex: '#92400E' }, { name: 'Beige',    hex: '#D4C5A9' },
  { name: 'Grey',     hex: '#94A3B8' }, { name: 'Cream',    hex: '#FFFBEB' },
  { name: 'Maroon',   hex: '#7F1D1D' }, { name: 'Navy',     hex: '#1E3A5F' },
];

// Fix relative image URLs from old uploads
const fixImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${API}${url}`;
};

function AdminProductsPage() {
  const [products,        setProducts]        = useState([]);
  const [isModalOpen,     setIsModalOpen]     = useState(false);
  const [editingProduct,  setEditingProduct]  = useState(null);
  const [formData,        setFormData]        = useState({ name: '', description: '', base_price: '', category: '', stock: '', colors: [] });
  const [imagePreviews,   setImagePreviews]   = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [searchTerm,      setSearchTerm]      = useState('');
  const [filterCat,       setFilterCat]       = useState('');

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const adminToken = localStorage.getItem('admin_token');
      if (!adminToken) { toast.error('Please login as admin first'); setProducts([]); return; }
      const response = await axios.get(`${API}/api/admin/products`, {
        headers: { 'admin-token': adminToken }
      });
      const fetched = response.data.products || response.data || [];
      setProducts(Array.isArray(fetched) ? fetched : []);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to fetch products');
      setProducts([]);
    } finally { setLoading(false); }
  };

  const openEditModal = (product) => {
    if (!product?._id) { toast.error('Invalid product data'); return; }
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      base_price: product.base_price ? parseFloat(product.base_price).toString() : '0',
      category: product.category || '',
      stock: product.stock !== undefined ? String(product.stock) : '0',
      colors: product.colors || [],
    });
    setImagePreviews(
      product.images?.length > 0
        ? product.images.map(img => ({ url: fixImageUrl(img.url), uploaded: true }))
        : []
    );
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ name: '', description: '', base_price: '', category: '', stock: '', colors: [] });
    setImagePreviews([]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({ name: '', description: '', base_price: '', category: '', stock: '', colors: [] });
    setImagePreviews([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files);
    if (imagePreviews.length + files.length > 5) { toast.error('Maximum 5 images allowed'); return; }
    files.forEach(file => {
      if (!file.type.startsWith('image/')) { toast.error(`${file.name} is not an image`); return; }
      if (file.size > 5 * 1024 * 1024) { toast.error(`${file.name} exceeds 5MB`); return; }
      const reader = new FileReader();
      reader.onloadend = () => setImagePreviews(prev => [...prev, { url: reader.result, uploaded: false, file }]);
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeImage = (index) => setImagePreviews(prev => prev.filter((_, i) => i !== index));

  const toggleColor = (colorName) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.includes(colorName)
        ? prev.colors.filter(c => c !== colorName)
        : [...prev.colors, colorName]
    }));
  };

  const uploadSingleImage = async (file, adminToken) => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await axios.post(`${API}/api/upload-image`, fd, {
      headers: { 'admin-token': adminToken, 'Content-Type': 'multipart/form-data' }, timeout: 30000
    });
    return res.data.image_url;
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.base_price || formData.stock === '') { toast.error('Please fill in all required fields'); return; }
    const stockValue = parseInt(formData.stock, 10);
    if (isNaN(stockValue)) { toast.error('Stock must be a valid number'); return; }
    const adminToken = localStorage.getItem('admin_token');
    if (!adminToken) { toast.error('Admin session expired'); return; }

    let finalImages = imagePreviews
      .filter(p => p.uploaded)
      .map((p, i) => ({ url: p.url, alt_text: formData.name, is_primary: i === 0 }));

    const newFiles = imagePreviews.filter(p => !p.uploaded && p.file);
    if (newFiles.length > 0) {
      try {
        setUploadingImages(true);
        toast.info('Uploading images…');
        for (const item of newFiles) {
          const url = await uploadSingleImage(item.file, adminToken);
          finalImages.push({ url, alt_text: formData.name, is_primary: finalImages.length === 0 });
        }
      } catch (err) {
        toast.error('Image upload failed: ' + (err.response?.data?.detail || err.message));
        setUploadingImages(false); return;
      } finally { setUploadingImages(false); }
    }

    const productData = {
      name: formData.name.trim(),
      description: formData.description.trim() || '',
      base_price: parseFloat(formData.base_price),
      images: finalImages,
      category: formData.category || 'general',
      stock: stockValue,
      colors: formData.colors,
      variants: [], skus: []
    };

    try {
      const config = { headers: { 'admin-token': adminToken, 'Content-Type': 'application/json' } };
      if (editingProduct?._id) {
        await axios.put(`${API}/api/admin/products/${editingProduct._id}`, productData, config);
        toast.success('Product updated!');
      } else {
        await axios.post(`${API}/api/admin/products`, productData, config);
        toast.success('Product created!');
      }
      closeModal();
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save product');
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      const adminToken = localStorage.getItem('admin_token');
      await axios.delete(`${API}/api/admin/products/${productId}`, { headers: { 'admin-token': adminToken } });
      toast.success('Product deleted');
      fetchProducts();
    } catch { toast.error('Failed to delete product'); }
  };

  const displayed = products.filter(p => {
    const matchSearch = !searchTerm || p.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = !filterCat || p.category === filterCat;
    return matchSearch && matchCat;
  });

  const getCatLabel = (v) => CATEGORIES.find(c => c.value === v)?.label || v;
  const getCatEmoji = (v) => CATEGORIES.find(c => c.value === v)?.emoji || '📦';

  // Stock badge colours
  const stockClass = (stock) =>
    stock === 0 ? 'bg-red-100 text-red-700' :
    stock < 5   ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700';

  return (
    <AdminLayout>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-serif font-semibold text-stone-900 mb-1">Products</h1>
          <p className="text-stone-500 text-sm">Manage your handcrafted product catalogue</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-stone-900 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-stone-700 transition-colors shadow-sm"
        >
          + Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Products', value: products.length,                                                       sub: 'in catalogue' },
          { label: 'In Stock',       value: products.filter(p => (p.stock||0) > 0).length,                        sub: 'available now' },
          { label: 'Out of Stock',   value: products.filter(p => (p.stock||0) === 0).length,                      sub: 'need restocking' },
          { label: 'Low Stock',      value: products.filter(p => (p.stock||0) > 0 && (p.stock||0) < 5).length,   sub: 'less than 5 units' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">{s.label}</p>
            <p className="text-3xl font-serif font-semibold text-stone-900">{s.value}</p>
            <p className="text-xs text-stone-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <div className="relative flex-1 min-w-[180px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm pointer-events-none">🔍</span>
          <input
            type="text"
            placeholder="Search products…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-4 py-2.5 border border-stone-200 rounded-xl text-sm bg-white text-stone-800 outline-none focus:border-stone-400 transition-colors"
          />
        </div>
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          className="px-4 py-2.5 border border-stone-200 rounded-xl text-sm bg-white text-stone-800 outline-none focus:border-stone-400 cursor-pointer"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>)}
        </select>
        <span className="text-xs text-stone-400 whitespace-nowrap">{displayed.length} of {products.length} products</span>
      </div>

      {/* Products table */}
      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm">
        {loading ? (
          <div className="text-center py-16 text-stone-400 text-sm">Loading products…</div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📦</p>
            <p className="text-stone-400 text-sm">{products.length === 0 ? 'No products yet. Add your first!' : 'No products match your filters.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-100">
                <tr>
                  {['Product', 'Category', 'Price', 'Stock', 'Colours', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-stone-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {displayed.map(product => {
                  const stock = product.stock || 0;
                  const primaryImg = product.images?.[0]?.url ? fixImageUrl(product.images[0].url) : null;
                  return (
                    <tr key={product._id} className="hover:bg-stone-50 transition-colors">
                      {/* Product */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {primaryImg ? (
                            <img src={primaryImg} alt={product.name}
                              className="w-12 h-12 rounded-xl object-cover border border-stone-100 flex-shrink-0"
                              onError={e => { e.target.style.display='none'; }} />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-xl flex-shrink-0">
                              {getCatEmoji(product.category)}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-stone-900 text-sm">{product.name}</p>
                            <p className="text-xs text-stone-400">{product.images?.length || 0} photo{product.images?.length !== 1 ? 's' : ''}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 bg-stone-100 text-stone-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                          {getCatEmoji(product.category)} {getCatLabel(product.category)}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-5 py-4 font-semibold text-stone-700 text-sm">
                        ₹{parseFloat(product.base_price).toLocaleString('en-IN')}
                      </td>

                      {/* Stock */}
                      <td className="px-5 py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${stockClass(stock)}`}>
                          {stock} units
                        </span>
                      </td>

                      {/* Colours */}
                      <td className="px-5 py-4">
                        <div className="flex gap-1 flex-wrap">
                          {product.colors?.length > 0
                            ? product.colors.map(c => {
                                const p = PRESET_COLORS.find(x => x.name === c);
                                return p ? <div key={c} title={c} className="w-4 h-4 rounded-full border border-black/10" style={{ background: p.hex }} /> : null;
                              })
                            : <span className="text-stone-300 text-sm">—</span>
                          }
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => openEditModal(product)}
                            className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors">
                            Edit
                          </button>
                          <button onClick={() => handleDelete(product._id)}
                            className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>

            {/* Modal header */}
            <div className="sticky top-0 bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <div className="flex items-center gap-3">
                <button onClick={closeModal} className="flex items-center gap-1.5 text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">
                  ← Back
                </button>
                <h2 className="font-serif text-xl font-semibold text-stone-900">
                  {editingProduct ? '✏️ Edit Product' : '✨ Add New Product'}
                </h2>
              </div>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition-colors text-sm">✕</button>
            </div>

            <div className="p-6 space-y-7">
              {/* Basic info */}
              <section>
                <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4 pb-2 border-b border-stone-100">Basic Information</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">Product Name *</label>
                    <input className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm bg-stone-50 text-stone-900 outline-none focus:border-stone-400 focus:bg-white transition-colors"
                      type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Handmade Rose Bracelet" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">Description</label>
                    <textarea className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm bg-stone-50 text-stone-900 outline-none focus:border-stone-400 focus:bg-white transition-colors resize-none"
                      name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe your product…" rows="3" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-1.5">Price (₹) *</label>
                      <input className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm bg-stone-50 text-stone-900 outline-none focus:border-stone-400 focus:bg-white transition-colors"
                        type="number" name="base_price" value={formData.base_price} onChange={handleInputChange} placeholder="0.00" step="0.01" min="0" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-1.5">Stock Quantity *</label>
                      <input className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm bg-stone-50 text-stone-900 outline-none focus:border-stone-400 focus:bg-white transition-colors"
                        type="number" name="stock" value={formData.stock} onChange={handleInputChange} placeholder="0" min="0" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Category */}
              <section>
                <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4 pb-2 border-b border-stone-100">Category</p>
                <div className="grid grid-cols-4 gap-2">
                  {CATEGORIES.map(cat => (
                    <button key={cat.value} type="button"
                      onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-center transition-all text-xs font-semibold ${
                        formData.category === cat.value
                          ? 'border-stone-900 bg-stone-900 text-white'
                          : 'border-stone-200 bg-stone-50 text-stone-600 hover:border-stone-400'
                      }`}>
                      <span className="text-xl">{cat.emoji}</span>
                      <span className="leading-tight">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Photos */}
              <section>
                <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4 pb-2 border-b border-stone-100">
                  Product Photos ({imagePreviews.length}/5)
                </p>
                <div className="grid grid-cols-5 gap-2 mb-2">
                  {imagePreviews.map((img, i) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden border border-stone-200 relative group">
                      <img src={fixImageUrl(img.url)} alt={`Preview ${i+1}`} className="w-full h-full object-cover"
                        onError={e => { e.target.src='https://via.placeholder.com/200x200/f5f5f5/999?text=Err'; }} />
                      {i === 0 && <span className="absolute top-1 left-1 bg-stone-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">MAIN</span>}
                      <button onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                    </div>
                  ))}
                  {imagePreviews.length < 5 && (
                    <label className="aspect-square rounded-xl border-2 border-dashed border-stone-200 flex flex-col items-center justify-content-center cursor-pointer hover:border-stone-400 hover:bg-stone-50 transition-all flex items-center justify-center gap-1">
                      <span className="text-xl text-stone-300">+</span>
                      <span className="text-[10px] text-stone-400 font-medium">Add</span>
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handleFilesChange} />
                    </label>
                  )}
                </div>
                <p className="text-xs text-stone-400">First photo = main image. Up to 5 photos.</p>
              </section>

              {/* Colors */}
              <section>
                <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4 pb-2 border-b border-stone-100">Available Colours</p>
                <div className="grid grid-cols-8 gap-2">
                  {PRESET_COLORS.map(color => {
                    const selected = formData.colors.includes(color.name);
                    return (
                      <button key={color.name} type="button" title={color.name}
                        onClick={() => toggleColor(color.name)}
                        className="flex flex-col items-center gap-1">
                        <div className={`w-7 h-7 rounded-full transition-all ${selected ? 'ring-2 ring-offset-2 ring-stone-900 scale-110' : 'hover:scale-105'}`}
                          style={{ background: color.hex, boxShadow: '0 0 0 1.5px rgba(0,0,0,0.08)' }}>
                          {selected && <span className="w-full h-full flex items-center justify-center text-white text-xs font-bold" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>✓</span>}
                        </div>
                        <span className="text-[9px] text-stone-400 text-center leading-tight">{color.name}</span>
                      </button>
                    );
                  })}
                </div>
                {formData.colors.length > 0 && (
                  <p className="mt-3 text-xs text-stone-600 bg-stone-50 border border-stone-200 px-3 py-2 rounded-lg">
                    ✓ Selected: {formData.colors.join(' · ')}
                  </p>
                )}
              </section>
            </div>

            {/* Modal footer */}
            <div className="sticky bottom-0 bg-white border-t border-stone-100 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
              <button onClick={closeModal}
                className="px-5 py-2.5 bg-stone-100 text-stone-700 rounded-xl text-sm font-semibold hover:bg-stone-200 transition-colors">
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={uploadingImages}
                className="px-6 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {uploadingImages ? 'Uploading…' : editingProduct ? 'Save Changes' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminProductsPage;