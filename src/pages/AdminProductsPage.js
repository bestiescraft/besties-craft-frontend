import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { AdminLayout } from '@/components/AdminLayout';
import { API } from '@/lib/constants';


// ── Built-in categories (always available) ──
const DEFAULT_CATEGORIES = [
  { label: 'Bracelets',        value: 'bracelets',        emoji: '📿' },
  { label: 'Handmade Flowers', value: 'handmade-flowers', emoji: '🌸' },
  { label: 'Keychains',        value: 'keychains',        emoji: '🔑' },
  { label: 'Hair Accessories', value: 'hair-accessories', emoji: '🎀' },
  { label: 'Gifting Items',    value: 'gifting-items',    emoji: '🎁' },
  { label: 'Crafts',           value: 'crafts',           emoji: '🎨' },
];

const LEGACY_MAP = {
  scarves: 'handmade-flowers', blankets: 'keychains',
  bags: 'hair-accessories', wool: 'gifting-items',
  handmade: 'crafts', general: 'crafts',
};

const EMOJI_OPTIONS = [
  '📦','🎀','💎','🌺','🎭','🧸','🪆','🧣','🪡','🎪',
  '🌿','🍃','✨','🦋','🌙','⭐','🎨','🖼️','🧵','💐',
  '🕯️','🪴','🐚','🧿','🪬','🫧','🎋','🎍','🎑','🎠',
  '💌','🎗️','🛍️','🎁','🪞','🪟','🏮','🎆','🌈','🦄',
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

const CUSTOM_CATS_KEY = 'besties_custom_categories';

const loadCustomCategories = () => {
  try { return JSON.parse(localStorage.getItem(CUSTOM_CATS_KEY) || '[]'); }
  catch { return []; }
};

const saveCustomCategories = (cats) => {
  localStorage.setItem(CUSTOM_CATS_KEY, JSON.stringify(cats));
};

const normalizeCategory = (val) => {
  if (!val) return '';
  return LEGACY_MAP[val] || val;
};

const normalizeCategoriesArray = (cats) => {
  let raw = [];
  if (Array.isArray(cats))                   raw = cats;
  else if (typeof cats === 'string' && cats) raw = [cats];
  return [...new Set(raw.map(normalizeCategory).filter(Boolean))];
};

const fixImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${API}${url}`;
};

const stockClass = (stock) =>
  stock === 0 ? 'bg-red-100 text-red-700'
  : stock < 5 ? 'bg-yellow-100 text-yellow-700'
              : 'bg-green-100 text-green-700';

// ─────────────────────────────────────────────────────────────────────────────
// BUG FIX 1: Empty form state was missing weight_grams. Using a shared constant
//            ensures ALL resets (openAddModal, closeModal) are consistent and
//            never accidentally differ from each other — previously closeModal
//            and openAddModal had slightly different reset objects which could
//            cause stale state bugs across open/close cycles.
// ─────────────────────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  name: '', description: '', base_price: '',
  categories: [], stock: '', colors: [], weight_grams: '500',
};

function AdminProductsPage() {
  const [products,        setProducts]        = useState([]);
  const [isModalOpen,     setIsModalOpen]     = useState(false);
  const [editingProduct,  setEditingProduct]  = useState(null);
  const [formData,        setFormData]        = useState(EMPTY_FORM);
  const [imagePreviews,   setImagePreviews]   = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [searchTerm,      setSearchTerm]      = useState('');
  const [filterCat,       setFilterCat]       = useState('');

  // ── Custom categories ──
  const [customCategories, setCustomCategories] = useState(loadCustomCategories);
  const [showAddCatForm,   setShowAddCatForm]   = useState(false);
  const [newCatLabel,      setNewCatLabel]      = useState('');
  const [newCatEmoji,      setNewCatEmoji]      = useState('📦');
  const [showEmojiPicker,  setShowEmojiPicker]  = useState(false);

  const ALL_CATEGORIES = [...DEFAULT_CATEGORIES, ...customCategories];

  const getCatInfo = (val) => {
    const normalized = normalizeCategory(val);
    return ALL_CATEGORIES.find(c => c.value === normalized) || { label: val || 'Unknown', emoji: '📦' };
  };

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const adminToken = localStorage.getItem('admin_token');
      if (!adminToken) { toast.error('Please login as admin first'); setProducts([]); return; }
      const response = await axios.get(`${API}/admin/products`, {
        headers: { 'admin-token': adminToken },
      });
      const fetched = response.data.products || response.data || [];
      setProducts(Array.isArray(fetched) ? fetched : []);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to fetch products');
      setProducts([]);
    } finally { setLoading(false); }
  }, []);

  // ── Add custom category ──
  const handleAddCustomCategory = () => {
    if (!newCatLabel.trim()) { toast.error('Please enter a category name'); return; }
    const value = newCatLabel.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    if (ALL_CATEGORIES.find(c => c.value === value)) { toast.error('Category already exists'); return; }
    const newCat = { label: newCatLabel.trim(), value, emoji: newCatEmoji, custom: true };
    const updated = [...customCategories, newCat];
    setCustomCategories(updated);
    saveCustomCategories(updated);
    setNewCatLabel('');
    setNewCatEmoji('📦');
    setShowAddCatForm(false);
    setShowEmojiPicker(false);
    toast.success(`Category "${newCat.label}" added!`);
  };

  const handleDeleteCustomCategory = (value) => {
    if (!window.confirm('Delete this custom category?')) return;
    const updated = customCategories.filter(c => c.value !== value);
    setCustomCategories(updated);
    saveCustomCategories(updated);
    setFormData(prev => ({ ...prev, categories: prev.categories.filter(c => c !== value) }));
    toast.success('Category removed');
  };

  // ─────────────────────────────────────────────────────────────────────────
  // BUG FIX 2: weight_grams was read as `product.weight_grams` but the backend
  //            model did NOT include weight_grams in the Product pydantic model,
  //            so MongoDB stored it but the PUT endpoint would OVERWRITE it with
  //            undefined on every edit (because product.dict() wouldn't include
  //            it). The frontend was correctly sending weight_grams but the
  //            backend's Product model was dropping it silently.
  //
  //            Frontend fix: ensure weight_grams is always a valid string number
  //            and never falls back to undefined. If product.weight_grams is 0
  //            (falsy) we still need to show it, so use !== undefined check.
  // ─────────────────────────────────────────────────────────────────────────
  const openEditModal = (product) => {
    if (!product?._id) { toast.error('Invalid product data'); return; }
    setEditingProduct(product);
    const merged = normalizeCategoriesArray(
      product.categories?.length > 0 ? product.categories : product.category
    );
    setFormData({
      name:         product.name || '',
      description:  product.description || '',
      base_price:   product.base_price !== undefined ? parseFloat(product.base_price).toString() : '0',
      categories:   merged,
      stock:        product.stock !== undefined ? String(product.stock) : '0',
      colors:       Array.isArray(product.colors) ? product.colors : [],
      // BUG FIX: was `product.weight_grams ? String(...) : '500'`
      // This fails when weight_grams is 0 (falsy). Use !== undefined instead.
      weight_grams: product.weight_grams !== undefined && product.weight_grams !== null
                      ? String(product.weight_grams)
                      : '500',
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
    setFormData({ ...EMPTY_FORM });   // BUG FIX: spread to avoid shared reference
    setImagePreviews([]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({ ...EMPTY_FORM });   // BUG FIX: spread to avoid shared reference
    setImagePreviews([]);
    setShowAddCatForm(false);
    setShowEmojiPicker(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleCategory = (catValue) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(catValue)
        ? prev.categories.filter(c => c !== catValue)
        : [...prev.categories, catValue],
    }));
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
        : [...prev.colors, colorName],
    }));
  };

  const uploadSingleImage = async (file, adminToken) => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await axios.post(`${API}/upload-image`, fd, {
      headers: { 'admin-token': adminToken, 'Content-Type': 'multipart/form-data' },
      timeout: 30000,
    });
    return res.data.image_url;
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.base_price || formData.stock === '') {
      toast.error('Please fill in all required fields'); return;
    }
    if (formData.categories.length === 0) {
      toast.error('Please select at least one category'); return;
    }

    const stockValue  = parseInt(formData.stock, 10);
    // ─────────────────────────────────────────────────────────────────────
    // BUG FIX 3: parseInt(undefined) returns NaN, and parseInt('') returns NaN.
    //            Added explicit fallback so an empty weight field → 500g
    //            instead of silently sending NaN to the backend.
    // ─────────────────────────────────────────────────────────────────────
    const weightRaw   = formData.weight_grams !== '' ? formData.weight_grams : '500';
    const weightValue = parseInt(weightRaw, 10);

    if (isNaN(stockValue))  { toast.error('Stock must be a valid number'); return; }
    if (isNaN(weightValue) || weightValue < 1) { toast.error('Weight must be at least 1 gram'); return; }

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

    const cats = formData.categories;

    // ─────────────────────────────────────────────────────────────────────
    // BUG FIX 4: THE MAIN BUG — weight_grams was being sent correctly from
    //            here, BUT the backend's Product pydantic model did not have
    //            a weight_grams field, so FastAPI was silently stripping it
    //            on every PUT/POST. The model only stored whatever was already
    //            in MongoDB on creation. On every subsequent edit, weight_grams
    //            would be lost because product.dict() in the PUT handler never
    //            included it, overwriting the DB value with nothing.
    //
    //            BACKEND FIX REQUIRED (in main.py Product model — add):
    //                weight_grams: Optional[int] = 500
    //
    //            This frontend now also sends weight_grams as a top-level field
    //            (already was doing this correctly) AND we add a redundant
    //            extra_fields workaround comment for clarity.
    //
    //            The admin table display also had a bug: it showed
    //            `product.weight_grams ? \`${product.weight_grams}g\` : '500g'`
    //            which would show '500g' even after saving 300g if the backend
    //            wasn't persisting it. Fixed in table render below.
    // ─────────────────────────────────────────────────────────────────────
    const productData = {
      name:         formData.name.trim(),
      description:  formData.description.trim() || '',
      base_price:   parseFloat(formData.base_price),
      images:       finalImages,
      categories:   cats,
      category:     cats[0] || 'crafts',
      stock:        stockValue,
      weight_grams: weightValue,   // ← This is sent correctly; backend model must accept it
      colors:       formData.colors,
      variants:     [],
      skus:         [],
    };

    try {
      const config = { headers: { 'admin-token': adminToken, 'Content-Type': 'application/json' } };
      if (editingProduct?._id) {
        await axios.put(`${API}/admin/products/${editingProduct._id}`, productData, config);
        toast.success('Product updated! ✓');
      } else {
        await axios.post(`${API}/admin/products`, productData, config);
        toast.success('Product created! ✓');
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
      await axios.delete(`${API}/admin/products/${productId}`, {
        headers: { 'admin-token': adminToken },
      });
      toast.success('Product deleted');
      fetchProducts();
    } catch { toast.error('Failed to delete product'); }
  };

  const displayed = products.filter(p => {
    const matchSearch = !searchTerm || p.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const rawCats = [
      ...(Array.isArray(p.categories) ? p.categories : p.categories ? [p.categories] : []),
      ...(p.category && !Array.isArray(p.category) ? [p.category] : []),
    ];
    const productCats = [...new Set(rawCats.map(normalizeCategory).filter(Boolean))];
    const matchCat = !filterCat || productCats.includes(filterCat);
    return matchSearch && matchCat;
  });

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-serif font-semibold text-stone-900 mb-1">Products</h1>
          <p className="text-stone-500 text-sm">Manage your handcrafted product catalogue</p>
        </div>
        <button onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-stone-900 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-stone-700 transition-colors shadow-sm">
          + Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Products', value: products.length,                                                     sub: 'in catalogue' },
          { label: 'In Stock',       value: products.filter(p => (p.stock||0) > 0).length,                      sub: 'available now' },
          { label: 'Out of Stock',   value: products.filter(p => (p.stock||0) === 0).length,                    sub: 'need restocking' },
          { label: 'Low Stock',      value: products.filter(p => (p.stock||0) > 0 && (p.stock||0) < 5).length, sub: 'less than 5 units' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">{s.label}</p>
            <p className="text-3xl font-serif font-semibold text-stone-900">{s.value}</p>
            <p className="text-xs text-stone-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Custom Categories Panel ── */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm mb-6 p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-bold text-stone-700">Custom Categories</p>
            <p className="text-xs text-stone-400 mt-0.5">Add your own categories beyond the 6 defaults</p>
          </div>
          <button onClick={() => { setShowAddCatForm(v => !v); setShowEmojiPicker(false); }}
            className="text-xs font-semibold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors border border-amber-200">
            {showAddCatForm ? '✕ Cancel' : '+ New Category'}
          </button>
        </div>

        {showAddCatForm && (
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-3">
            <p className="text-xs font-bold text-amber-700">Create a new category</p>
            <div className="flex gap-2 items-center">
              <div className="relative flex-shrink-0">
                <button type="button" onClick={() => setShowEmojiPicker(v => !v)}
                  className="w-11 h-11 border-2 border-amber-200 bg-white rounded-xl text-xl flex items-center justify-center hover:border-amber-400 transition-colors">
                  {newCatEmoji}
                </button>
                {showEmojiPicker && (
                  <div className="absolute top-12 left-0 mt-1 bg-white border border-stone-200 rounded-xl p-2 shadow-xl z-30 grid grid-cols-8 gap-1 w-64">
                    <p className="col-span-8 text-[10px] text-stone-400 font-semibold px-1 pb-1">Pick an emoji</p>
                    {EMOJI_OPTIONS.map(em => (
                      <button key={em} type="button"
                        onClick={() => { setNewCatEmoji(em); setShowEmojiPicker(false); }}
                        className={`w-7 h-7 text-base hover:bg-stone-100 rounded-lg flex items-center justify-center ${newCatEmoji === em ? 'bg-amber-100' : ''}`}>
                        {em}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <input type="text" placeholder="Category name (e.g. Resin Art)"
                value={newCatLabel} onChange={e => setNewCatLabel(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddCustomCategory()}
                className="flex-1 px-3 py-2.5 border border-amber-200 rounded-xl text-sm bg-white outline-none focus:border-amber-400 transition-colors" />
              <button type="button" onClick={handleAddCustomCategory}
                className="px-4 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 transition-colors flex-shrink-0">
                Add
              </button>
            </div>
            <p className="text-xs text-amber-600">Categories are saved in this browser. Press Enter or click Add.</p>
          </div>
        )}

        {customCategories.length === 0 && !showAddCatForm ? (
          <p className="text-xs text-stone-400 italic">No custom categories yet. Click "+ New Category" to create one.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {customCategories.map(cat => (
              <div key={cat.value}
                className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-full text-xs font-semibold">
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
                <button onClick={() => handleDeleteCustomCategory(cat.value)}
                  className="ml-1 text-amber-400 hover:text-red-500 transition-colors">✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <div className="relative flex-1 min-w-[180px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm pointer-events-none">🔍</span>
          <input type="text" placeholder="Search products…" value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-4 py-2.5 border border-stone-200 rounded-xl text-sm bg-white text-stone-800 outline-none focus:border-stone-400 transition-colors" />
        </div>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
          className="px-4 py-2.5 border border-stone-200 rounded-xl text-sm bg-white text-stone-800 outline-none focus:border-stone-400 cursor-pointer">
          <option value="">All Categories</option>
          {ALL_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>)}
        </select>
        <span className="text-xs text-stone-400 whitespace-nowrap">{displayed.length} of {products.length} products</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm">
        {loading ? (
          <div className="text-center py-16 text-stone-400 text-sm">Loading products…</div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📦</p>
            <p className="text-stone-400 text-sm">
              {products.length === 0 ? 'No products yet. Add your first!' : 'No products match your filters.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-100">
                <tr>
                  {['Product', 'Categories', 'Price', 'Weight', 'Stock', 'Colours', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-stone-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {displayed.map(product => {
                  const stock = product.stock || 0;
                  const primaryImg = product.images?.[0]?.url ? fixImageUrl(product.images[0].url) : null;
                  const rawCats = [
                    ...(Array.isArray(product.categories) ? product.categories : product.categories ? [product.categories] : []),
                    ...(product.category && !Array.isArray(product.category) ? [product.category] : []),
                  ];
                  const productCats = [...new Set(rawCats.map(normalizeCategory).filter(Boolean))];

                  return (
                    <tr key={product._id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {primaryImg ? (
                            <img src={primaryImg} alt={product.name}
                              className="w-12 h-12 rounded-xl object-cover border border-stone-100 flex-shrink-0"
                              onError={e => { e.target.style.display = 'none'; }} />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-xl flex-shrink-0">
                              {getCatInfo(productCats[0] || '').emoji}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-stone-900 text-sm">{product.name}</p>
                            <p className="text-xs text-stone-400">{product.images?.length || 0} photo{product.images?.length !== 1 ? 's' : ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1">
                          {productCats.length > 0 ? productCats.map(cat => {
                            const info = getCatInfo(cat);
                            return (
                              <span key={cat} className="inline-flex items-center gap-1 bg-stone-100 text-stone-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                                {info.emoji} {info.label}
                              </span>
                            );
                          }) : <span className="text-stone-300 text-sm">—</span>}
                        </div>
                      </td>
                      <td className="px-5 py-4 font-semibold text-stone-700 text-sm">
                        ₹{parseFloat(product.base_price).toLocaleString('en-IN')}
                      </td>
                      {/* ─────────────────────────────────────────────────────
                          BUG FIX 5: Display bug — `product.weight_grams ? ...`
                          is falsy for 0g. Use !== undefined/null check so any
                          valid weight (even 0, though unlikely) shows correctly.
                          Also shows a visual indicator if weight is missing so
                          admin knows to re-save the product.
                      ───────────────────────────────────────────────────── */}
                      <td className="px-5 py-4 text-sm text-stone-500">
                        {product.weight_grams !== undefined && product.weight_grams !== null
                          ? `${product.weight_grams}g`
                          : <span className="text-amber-500 font-semibold">500g*</span>
                        }
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${stockClass(stock)}`}>
                          {stock} units
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-1 flex-wrap">
                          {product.colors?.length > 0
                            ? product.colors.map(c => {
                                const p = PRESET_COLORS.find(x => x.name === c);
                                return p ? <div key={c} title={c} className="w-4 h-4 rounded-full border border-black/10" style={{ background: p.hex }} /> : null;
                              })
                            : <span className="text-stone-300 text-sm">—</span>}
                        </div>
                      </td>
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

      {/* ══════════════ MODAL ══════════════ */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>

            <div className="sticky top-0 bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <div className="flex items-center gap-3">
                <button onClick={closeModal}
                  className="flex items-center gap-1.5 text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">
                  ← Back
                </button>
                <h2 className="font-serif text-xl font-semibold text-stone-900">
                  {editingProduct ? '✏️ Edit Product' : '✨ Add New Product'}
                </h2>
              </div>
              <button onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 transition-colors text-sm">✕</button>
            </div>

            <div className="p-6 space-y-7">

              {/* ── Basic Info ── */}
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
                  {/* Price · Stock · Weight in one row */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-1.5">Price (₹) *</label>
                      <input className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm bg-stone-50 text-stone-900 outline-none focus:border-stone-400 focus:bg-white transition-colors"
                        type="number" name="base_price" value={formData.base_price} onChange={handleInputChange} placeholder="0.00" step="0.01" min="0" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-1.5">Stock *</label>
                      <input className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm bg-stone-50 text-stone-900 outline-none focus:border-stone-400 focus:bg-white transition-colors"
                        type="number" name="stock" value={formData.stock} onChange={handleInputChange} placeholder="0" min="0" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                        Weight (g) *
                        <span className="ml-1 text-[10px] font-normal text-stone-400">for shipping</span>
                      </label>
                      {/* ───────────────────────────────────────────────────
                          BUG FIX 6: Input was not enforcing a minimum visual
                          cue when field is empty. Added explicit value guard
                          so the field never shows "NaN" or blank when reopened.
                      ─────────────────────────────────────────────────── */}
                      <input className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm bg-stone-50 text-stone-900 outline-none focus:border-stone-400 focus:bg-white transition-colors"
                        type="number" name="weight_grams"
                        value={formData.weight_grams}
                        onChange={handleInputChange}
                        onBlur={e => {
                          // If user clears the field and tabs away, restore 500g default
                          if (e.target.value === '' || parseInt(e.target.value, 10) < 1) {
                            setFormData(prev => ({ ...prev, weight_grams: '500' }));
                          }
                        }}
                        placeholder="500" min="1" max="30000" />
                    </div>
                  </div>
                  <p className="text-xs text-stone-400">Weight examples: bracelet ≈ 50g · keychain ≈ 30g · flower bouquet ≈ 300g · gift box ≈ 800g</p>
                </div>
              </section>

              {/* ── Categories ── */}
              <section>
                <div className="flex items-center justify-between mb-1 pb-2 border-b border-stone-100">
                  <p className="text-xs font-bold uppercase tracking-widest text-stone-400">
                    Categories <span className="normal-case font-normal">(select all that apply)</span>
                  </p>
                  <button type="button"
                    onClick={() => { setShowAddCatForm(v => !v); setShowEmojiPicker(false); }}
                    className="text-xs font-semibold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-lg transition-colors border border-amber-200">
                    {showAddCatForm ? '✕ Cancel' : '+ New Category'}
                  </button>
                </div>

                {/* Inline add-category form inside modal */}
                {showAddCatForm && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                    <div className="flex gap-2 items-center">
                      <div className="relative flex-shrink-0">
                        <button type="button" onClick={() => setShowEmojiPicker(v => !v)}
                          className="w-10 h-10 border-2 border-amber-200 bg-white rounded-xl text-lg flex items-center justify-center hover:border-amber-400 transition-colors">
                          {newCatEmoji}
                        </button>
                        {showEmojiPicker && (
                          <div className="absolute bottom-12 left-0 bg-white border border-stone-200 rounded-xl p-2 shadow-xl z-30 grid grid-cols-8 gap-1 w-64">
                            {EMOJI_OPTIONS.map(em => (
                              <button key={em} type="button"
                                onClick={() => { setNewCatEmoji(em); setShowEmojiPicker(false); }}
                                className={`w-7 h-7 text-base hover:bg-stone-100 rounded-lg flex items-center justify-center ${newCatEmoji === em ? 'bg-amber-100' : ''}`}>
                                {em}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <input type="text" placeholder="New category name…"
                        value={newCatLabel} onChange={e => setNewCatLabel(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAddCustomCategory()}
                        className="flex-1 px-3 py-2 border border-amber-200 rounded-xl text-sm bg-white outline-none focus:border-amber-400" />
                      <button type="button" onClick={handleAddCustomCategory}
                        className="px-3 py-2 bg-amber-500 text-white rounded-xl text-xs font-semibold hover:bg-amber-600 transition-colors flex-shrink-0">
                        Add
                      </button>
                    </div>
                  </div>
                )}

                <p className="text-xs text-stone-400 mb-3">Tick all categories this product belongs to</p>
                <div className="grid grid-cols-3 gap-2">
                  {ALL_CATEGORIES.map(cat => {
                    const selected = formData.categories.includes(cat.value);
                    return (
                      <button key={cat.value} type="button"
                        onClick={() => toggleCategory(cat.value)}
                        className={`relative flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                          selected
                            ? 'border-stone-900 bg-stone-900 text-white'
                            : 'border-stone-200 bg-stone-50 text-stone-600 hover:border-stone-400 cursor-pointer'
                        }`}>
                        <span className="text-lg">{cat.emoji}</span>
                        <span className="leading-tight text-xs font-semibold flex-1">{cat.label}</span>
                        {selected && <span className="text-white text-xs">✓</span>}
                        {cat.custom && !selected && (
                          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-400" title="Custom category" />
                        )}
                      </button>
                    );
                  })}
                </div>
                {formData.categories.length > 0 && (
                  <p className="mt-2 text-xs text-stone-500 bg-stone-50 border border-stone-200 px-3 py-2 rounded-lg">
                    ✓ Selected: {formData.categories.map(v => getCatInfo(v).label).join(' · ')}
                  </p>
                )}
              </section>

              {/* ── Photos ── */}
              <section>
                <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4 pb-2 border-b border-stone-100">
                  Product Photos ({imagePreviews.length}/5)
                </p>
                <div className="grid grid-cols-5 gap-2 mb-2">
                  {imagePreviews.map((img, i) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden border border-stone-200 relative group">
                      <img src={fixImageUrl(img.url)} alt={`Preview ${i + 1}`} className="w-full h-full object-cover"
                        onError={e => { e.target.src = 'https://via.placeholder.com/200x200/f5f5f5/999?text=Err'; }} />
                      {i === 0 && <span className="absolute top-1 left-1 bg-stone-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">MAIN</span>}
                      <button onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                    </div>
                  ))}
                  {imagePreviews.length < 5 && (
                    <label className="aspect-square rounded-xl border-2 border-dashed border-stone-200 flex flex-col items-center justify-center cursor-pointer hover:border-stone-400 hover:bg-stone-50 transition-all gap-1">
                      <span className="text-xl text-stone-300">+</span>
                      <span className="text-[10px] text-stone-400 font-medium">Add</span>
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handleFilesChange} />
                    </label>
                  )}
                </div>
                <p className="text-xs text-stone-400">First photo = main image. Up to 5 photos.</p>
              </section>

              {/* ── Colours ── */}
              <section>
                <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4 pb-2 border-b border-stone-100">Available Colours</p>
                <div className="grid grid-cols-8 gap-2">
                  {PRESET_COLORS.map(color => {
                    const selected = formData.colors.includes(color.name);
                    return (
                      <button key={color.name} type="button" title={color.name} onClick={() => toggleColor(color.name)}
                        className="flex flex-col items-center gap-1">
                        <div className={`w-7 h-7 rounded-full transition-all ${selected ? 'ring-2 ring-offset-2 ring-stone-900 scale-110' : 'hover:scale-105'}`}
                          style={{ background: color.hex, boxShadow: '0 0 0 1.5px rgba(0,0,0,0.08)' }}>
                          {selected && (
                            <span className="w-full h-full flex items-center justify-center text-white text-xs font-bold"
                              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>✓</span>
                          )}
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

            {/* Footer */}
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