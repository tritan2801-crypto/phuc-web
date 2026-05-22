import React, { useEffect, useState } from 'react'
import { Package, Search, Plus, Edit2, Trash2, X, AlertTriangle, Loader2 } from 'lucide-react'
import posthog from 'posthog-js'

interface Product {
  id: string
  sku: string
  name: string
  category: string
  subCategory?: string
  brand: string
  price: number
  agentPrice: number
  weight?: string
  image: string
  description: string
  features: string[]
  specs: Record<string, string>
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchVal, setSearchVal] = useState('')
  const [selectedCat, setSelectedCat] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [currentProductId, setCurrentProductId] = useState<string | null>(null)

  // Form Fields
  const [formFields, setFormFields] = useState({
    name: '',
    sku: '',
    brand: 'Khang Phúc',
    category: 'may-moc',
    subCategory: '',
    price: '',
    agentPrice: '',
    weight: '10 kg',
    image: 'construction tool machinery',
    description: '',
    featuresText: '', // text area, split by new lines
    specsText: '' // text area, line: 'Key: Value'
  })

  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/products')
      if (res.ok) {
        const data = await res.json()
        setProducts(data.products || [])
      }
    } catch (e) {
      console.error('Error fetching products', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Reset page when search or category changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchVal, selectedCat])

  const handleOpenCreateModal = () => {
    setModalMode('create')
    setCurrentProductId(null)
    setFormFields({
      name: '',
      sku: '',
      brand: 'Khang Phúc',
      category: 'may-moc',
      subCategory: '',
      price: '',
      agentPrice: '',
      weight: '10 kg',
      image: 'construction tool machinery',
      description: '',
      featuresText: 'Sản phẩm phân phối chính hãng 100%\nBảo hành dài hạn tại công trình',
      specsText: 'Trọng lượng: 10 kg\nXuất xứ: Chính hãng'
    })
    setFormError(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (prod: Product) => {
    setModalMode('edit')
    setCurrentProductId(prod.id)

    // Convert features array back to string
    const fText = Array.isArray(prod.features) ? prod.features.join('\n') : ''

    // Convert specs record back to key-value string
    const sText = prod.specs
      ? Object.entries(prod.specs)
          .map(([k, v]) => `${k}: ${v}`)
          .join('\n')
      : ''

    setFormFields({
      name: prod.name,
      sku: prod.sku,
      brand: prod.brand,
      category: prod.category,
      subCategory: prod.subCategory || '',
      price: String(prod.price),
      agentPrice: String(prod.agentPrice),
      weight: prod.weight || '10 kg',
      image: prod.image,
      description: prod.description || '',
      featuresText: fText,
      specsText: sText
    })
    setFormError(null)
    setIsModalOpen(true)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setFormLoading(true)

    // Parse Features
    const featuresList = formFields.featuresText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    // Parse Specs
    const specsRecord: Record<string, string> = {}
    formFields.specsText
      .split('\n')
      .forEach((line) => {
        const parts = line.split(':')
        if (parts.length >= 2) {
          const key = parts[0].trim()
          const val = parts.slice(1).join(':').trim()
          if (key && val) {
            specsRecord[key] = val
          }
        }
      })

    const payload = {
      name: formFields.name,
      sku: formFields.sku,
      brand: formFields.brand,
      category: formFields.category,
      subCategory: formFields.subCategory,
      price: parseFloat(formFields.price) || 0,
      agentPrice: parseFloat(formFields.agentPrice) || parseFloat(formFields.price) || 0,
      weight: formFields.weight,
      image: formFields.image,
      description: formFields.description,
      features: featuresList,
      specs: specsRecord
    }

    try {
      const url = modalMode === 'create' ? '/api/products' : `/api/products/${currentProductId}`
      const method = modalMode === 'create' ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        setIsModalOpen(false)
        fetchProducts() // reload table
        try {
          const data = await res.json()
          const prod = data.product
          posthog.capture('admin_product_modified', {
            action: modalMode === 'create' ? 'create' : 'update',
            productId: prod?.id || currentProductId || undefined,
            sku: prod?.sku || payload.sku,
            name: prod?.name || payload.name,
            category: prod?.category || payload.category,
            price: prod?.price || payload.price,
            agentPrice: prod?.agentPrice || payload.agentPrice
          })
        } catch (err) {
          posthog.capture('admin_product_modified', {
            action: modalMode === 'create' ? 'create' : 'update',
            productId: currentProductId || undefined,
            sku: payload.sku,
            name: payload.name,
            category: payload.category,
            price: payload.price,
            agentPrice: payload.agentPrice
          })
        }
      } else {
        const data = await res.json()
        setFormError(data.error || 'Đã xảy ra lỗi khi lưu sản phẩm')
      }
    } catch (err) {
      setFormError('Lỗi kết nối máy chủ')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}" không?`)) {
      return
    }

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (res.ok) {
        posthog.capture('admin_product_modified', {
          action: 'delete',
          productId: id,
          name: name
        })
        fetchProducts() // reload table
      } else {
        alert('Xóa sản phẩm thất bại')
      }
    } catch (e) {
      alert('Lỗi kết nối hệ thống')
    }
  }

  // Filter products by search and category
  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchVal.toLowerCase()) ||
                        p.sku.toLowerCase().includes(searchVal.toLowerCase()) ||
                        p.brand.toLowerCase().includes(searchVal.toLowerCase())
    const matchCat = selectedCat ? p.category === selectedCat : true
    return matchSearch && matchCat
  })

  // Calculate pagination parameters
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const activePage = Math.min(currentPage, totalPages || 1)
  const paginatedProducts = filteredProducts.slice(
    (activePage - 1) * ITEMS_PER_PAGE,
    activePage * ITEMS_PER_PAGE
  )

  return (
    <div className="space-y-5 font-sans text-slate-200 selection:bg-teal-505 selection:text-slate-950">
      
      {/* Top filter toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex flex-1 flex-col sm:flex-row gap-3">
          
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Tìm theo tên, SKU, hãng..."
              className="w-full bg-slate-955 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:border-teal-500 focus:outline-none transition-all"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="bg-slate-955 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:border-teal-500 focus:outline-none transition-all cursor-pointer font-semibold"
          >
            <option value="">Tất cả danh mục</option>
            <option value="may-moc">Máy móc thiết bị</option>
            <option value="dia-mai">Đĩa mài & Tools</option>
            <option value="son-hoa-chat">Sơn & Hóa chất</option>
          </select>
        </div>

        {/* Add Product Button */}
        <button
          onClick={handleOpenCreateModal}
          className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md shadow-teal-500/10 hover:shadow-teal-500/20"
        >
          <Plus size={16} />
          <span>THÊM SẢN PHẨM MỚI</span>
        </button>
      </div>

      {/* PRODUCTS TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-slate-400 space-y-3">
            <Loader2 className="animate-spin text-teal-400 mx-auto" size={32} />
            <p className="text-xs font-semibold uppercase tracking-wider">Đang tải danh sách sản phẩm...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-slate-500 space-y-2">
            <Package className="mx-auto text-slate-500" size={48} />
            <p className="text-xs font-bold">Không tìm thấy sản phẩm nào phù hợp</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-850/50 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4 pl-5">Sản phẩm</th>
                    <th className="py-3 px-4">SKU</th>
                    <th className="py-3 px-4">Hãng</th>
                    <th className="py-3 px-4">Danh mục</th>
                    <th className="py-3 px-4 text-right">Đơn giá bán lẻ</th>
                    <th className="py-3 px-4 text-right">Đơn giá đại lý</th>
                    <th className="py-3 px-4 pr-5 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-semibold text-slate-350">
                  {paginatedProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-850/20 transition-colors">
                      <td className="py-2.5 px-4 pl-5 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-[10px] text-teal-400 font-bold overflow-hidden uppercase flex-shrink-0">
                          {prod.brand.slice(0, 2)}
                        </div>
                        <div className="max-w-xs space-y-0.5 animate-fade-in">
                          <span className="text-white font-bold block line-clamp-1">{prod.name}</span>
                          <span className="text-[10px] text-slate-500 block">ID: {prod.id}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 font-mono text-[11px] text-slate-400">{prod.sku}</td>
                      <td className="py-2.5 px-4 text-slate-300">{prod.brand}</td>
                      <td className="py-2.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-bold text-slate-400 uppercase">
                          {prod.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right text-teal-400 font-bold">{prod.price.toLocaleString('vi-VN')} ₫</td>
                      <td className="py-2.5 px-4 text-right text-blue-400 font-bold">{prod.agentPrice.toLocaleString('vi-VN')} ₫</td>
                      <td className="py-2.5 px-4 pr-5 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleOpenEditModal(prod)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-750 text-teal-400 hover:text-teal-300 border border-slate-700 rounded-lg cursor-pointer transition-colors"
                            title="Chỉnh sửa sản phẩm"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id, prod.name)}
                            className="p-1.5 bg-slate-800 hover:bg-red-950/20 text-red-400 hover:text-red-300 border border-slate-700 rounded-lg cursor-pointer transition-colors"
                            title="Xóa sản phẩm"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            {filteredProducts.length > 0 && (
              <div className="border-t border-slate-800 bg-slate-900/50 px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-[11px] font-bold text-slate-500">
                  Hiển thị {Math.min((activePage - 1) * ITEMS_PER_PAGE + 1, filteredProducts.length)}-{Math.min(activePage * ITEMS_PER_PAGE, filteredProducts.length)} trong tổng số {filteredProducts.length} sản phẩm
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={activePage === 1}
                    className="px-2.5 py-1.5 bg-slate-850 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-slate-850 text-slate-300 disabled:text-slate-500 rounded-lg text-[11px] font-extrabold cursor-pointer disabled:cursor-not-allowed transition-all border border-slate-800"
                  >
                    Trước
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                    <button
                      key={pNum}
                      onClick={() => setCurrentPage(pNum)}
                      className={`w-7 h-7 flex items-center justify-center rounded-lg text-[11px] font-extrabold cursor-pointer transition-all border ${
                        activePage === pNum
                          ? 'bg-teal-500 text-slate-950 border-teal-500 shadow-md shadow-teal-500/10'
                          : 'bg-slate-850 hover:bg-slate-800 text-slate-300 border-slate-800'
                      }`}
                    >
                      {pNum}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={activePage === totalPages}
                    className="px-2.5 py-1.5 bg-slate-850 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-slate-850 text-slate-300 disabled:text-slate-500 rounded-lg text-[11px] font-extrabold cursor-pointer disabled:cursor-not-allowed transition-all border border-slate-800"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* CREATE / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl relative my-8">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-850 flex items-center justify-between">
              <h3 className="font-heading font-black text-sm uppercase tracking-wider text-white">
                {modalMode === 'create' ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white rounded-lg cursor-pointer transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto text-left">
              
              {formError && (
                <div className="bg-red-950/20 border border-red-500/30 rounded-xl p-3 flex items-start gap-2.5 text-red-300 text-xs">
                  <AlertTriangle size={15} className="mt-0.5 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Product Name */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Tên sản phẩm *:</label>
                  <input
                    type="text"
                    required
                    value={formFields.name}
                    onChange={(e) => setFormFields({ ...formFields, name: e.target.value })}
                    placeholder="Ví dụ: Máy mài sàn Karva KVG-17E"
                    className="w-full bg-slate-955 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-700 focus:border-teal-500 focus:outline-none transition-all"
                  />
                </div>

                {/* SKU */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Mã SKU (tự sinh nếu để trống):</label>
                  <input
                    type="text"
                    value={formFields.sku}
                    onChange={(e) => setFormFields({ ...formFields, sku: e.target.value })}
                    placeholder="Ví dụ: M-KARVA-KVG17E"
                    className="w-full bg-slate-955 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-700 focus:border-teal-500 focus:outline-none transition-all"
                  />
                </div>

                {/* Brand */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Thương hiệu *:</label>
                  <input
                    type="text"
                    required
                    value={formFields.brand}
                    onChange={(e) => setFormFields({ ...formFields, brand: e.target.value })}
                    placeholder="Ví dụ: Karva, Kumisai, ASL"
                    className="w-full bg-slate-955 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-700 focus:border-teal-500 focus:outline-none transition-all"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Danh mục chính *:</label>
                  <select
                    value={formFields.category}
                    onChange={(e) => setFormFields({ ...formFields, category: e.target.value })}
                    className="w-full bg-slate-955 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-slate-300 focus:border-teal-500 focus:outline-none transition-all cursor-pointer font-semibold"
                  >
                    <option value="may-moc">Máy móc thiết bị (may-moc)</option>
                    <option value="dia-mai">Đĩa mài & Tools (dia-mai)</option>
                    <option value="son-hoa-chat">Sơn & Hóa chất (son-hoa-chat)</option>
                    <option value="other">Vật tư & Phụ gia khác (other)</option>
                  </select>
                </div>

                {/* Subcategory */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Nhóm con (Sub-category):</label>
                  <input
                    type="text"
                    value={formFields.subCategory}
                    onChange={(e) => setFormFields({ ...formFields, subCategory: e.target.value })}
                    placeholder="Ví dụ: may-mai-san, dia-mai-be-tong, chat-tang-cung"
                    className="w-full bg-slate-955 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-700 focus:border-teal-500 focus:outline-none transition-all"
                  />
                </div>

                {/* Retail Price */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Giá bán lẻ (VND) *:</label>
                  <input
                    type="number"
                    required
                    value={formFields.price}
                    onChange={(e) => setFormFields({ ...formFields, price: e.target.value })}
                    placeholder="Ví dụ: 15500000"
                    className="w-full bg-slate-955 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-700 focus:border-teal-500 focus:outline-none transition-all"
                  />
                </div>

                {/* Agent Price */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Giá đại lý B2B (VND):</label>
                  <input
                    type="number"
                    value={formFields.agentPrice}
                    onChange={(e) => setFormFields({ ...formFields, agentPrice: e.target.value })}
                    placeholder="Ví dụ: 12000000"
                    className="w-full bg-slate-955 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-700 focus:border-teal-500 focus:outline-none transition-all"
                  />
                </div>

                {/* Weight */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Trọng lượng (kg hoặc chuỗi):</label>
                  <input
                    type="text"
                    value={formFields.weight}
                    onChange={(e) => setFormFields({ ...formFields, weight: e.target.value })}
                    placeholder="Ví dụ: 48 kg, 0.45 kg"
                    className="w-full bg-slate-955 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-700 focus:border-teal-500 focus:outline-none transition-all"
                  />
                </div>

                {/* Image search query */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Từ khóa ảnh Pexels:</label>
                  <input
                    type="text"
                    value={formFields.image}
                    onChange={(e) => setFormFields({ ...formFields, image: e.target.value })}
                    placeholder="Ví dụ: floor grinder, construction tool"
                    className="w-full bg-slate-955 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-700 focus:border-teal-500 focus:outline-none transition-all"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Mô tả sản phẩm:</label>
                  <textarea
                    value={formFields.description}
                    onChange={(e) => setFormFields({ ...formFields, description: e.target.value })}
                    placeholder="Giới thiệu sơ lược các điểm nổi bật của thiết bị..."
                    rows={3}
                    className="w-full bg-slate-955 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-700 focus:border-teal-500 focus:outline-none transition-all"
                  />
                </div>

                {/* Features (Multi-line) */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Các tính năng nổi bật (Mỗi dòng một ý):</label>
                  <textarea
                    value={formFields.featuresText}
                    onChange={(e) => setFormFields({ ...formFields, featuresText: e.target.value })}
                    placeholder="Động cơ 100% dây đồng nguyên chất&#10;Tay cầm điều chỉnh linh hoạt&#10;Đế đĩa gắn đa năng..."
                    rows={4}
                    className="w-full bg-slate-955 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-700 focus:border-teal-500 focus:outline-none transition-all"
                  />
                </div>

                {/* Specs (Key: Value) */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Thông số kỹ thuật (Dạng 'Tên: Giá trị', mỗi dòng một thông số):</label>
                  <textarea
                    value={formFields.specsText}
                    onChange={(e) => setFormFields({ ...formFields, specsText: e.target.value })}
                    placeholder="Công suất: 2.5 HP (1.8 KW)&#10;Điện áp: 220 V / 50 Hz&#10;Tốc độ vòng quay: 175 RPM&#10;Xuất xứ: Đức"
                    rows={4}
                    className="w-full bg-slate-955 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-700 focus:border-teal-500 focus:outline-none transition-all"
                  />
                </div>

              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  HỦY BỎ
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 disabled:bg-teal-800 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md shadow-teal-500/10"
                >
                  {formLoading ? <Loader2 className="animate-spin" size={16} /> : <span>LƯU SẢN PHẨM</span>}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}
