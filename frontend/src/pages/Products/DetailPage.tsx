import React, { useState, useMemo, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingCart, Phone, Building, Award, CheckCircle2, ChevronRight, Settings2, FileSpreadsheet, RotateCcw, Download, Play } from 'lucide-react'
import PexelsImage from '../../components/ui/PexelsImage'
import { useApp } from '../../context/AppContext'
import { MOCK_PRODUCTS, Product } from '../../constants/mock-data'
import posthog from 'posthog-js'

export default function ProductDetailPage() {
  const { id } = useParams()
  const { addToCart, setIsCartOpen, isB2b } = useApp()
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'manual' | 'warranty'>('desc')
  const [success, setSuccess] = useState(false)
  const [galleryMode, setGalleryMode] = useState<'photo' | 'video' | '360'>('photo')
  
  // RFQ Modal States
  const [isRfqOpen, setIsRfqOpen] = useState(false)
  const [rfqSubmitting, setRfqSubmitting] = useState(false)
  const [rfqResult, setRfqResult] = useState<{ pdfUrl: string; excelUrl: string; quoteId: string; coverageEstimates: any[] } | null>(null)
  const [rfqForm, setRfqForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    companyName: '',
    address: '',
    projectArea: '',
    notes: '',
    flooringType: 'Sơn Epoxy tự san phẳng'
  })

  // Find product by id
  const product = useMemo(() => {
    return MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0]
  }, [id])

  // Track product viewed event in PostHog
  useEffect(() => {
    if (product) {
      posthog.capture('product_viewed', {
        id: product.id,
        name: product.name,
        brand: product.brand,
        category: product.category,
        subCategory: product.subCategory,
        price: product.price,
        agentPrice: product.agentPrice,
      })
    }
  }, [product])

  const priceToShow = isB2b ? product.agentPrice : product.price
  const savings = product.price - product.agentPrice

  const handleAdd = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      agentPrice: product.agentPrice,
      image: product.image
    }, 1)
    
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2000)
    setIsCartOpen(true)
  }

  // Compatible Accessory Cross-sell Logic
  const frequentlyBoughtTogether = useMemo(() => {
    if (product.subCategory === 'may-mai-san') {
      return MOCK_PRODUCTS.filter(p => 
        p.id === 'dia-mai-kim-cuong-30' || 
        p.id === 'resin-pad-50' || 
        p.id === 'gloves-protective'
      )
    } else if (product.category === 'son-hoa-chat') {
      return MOCK_PRODUCTS.filter(p => 
        p.id === 'bay-rang-cua-inox' || 
        p.id === 'roller-spike-epoxy' || 
        p.id === 'gloves-protective'
      )
    } else {
      return MOCK_PRODUCTS.filter(p => 
        p.id === 'tape-safety-yellow' || 
        p.id === 'gloves-protective' ||
        p.id === 'bay-rang-cua-inox'
      )
    }
  }, [product])

  // Live estimate preview in modal
  const liveMaterialEstimation = useMemo(() => {
    const area = parseFloat(rfqForm.projectArea)
    if (!area || isNaN(area) || area <= 0) return null

    if (rfqForm.flooringType.includes('Epoxy') || rfqForm.flooringType.includes('Sơn')) {
      const epoxyKg = area * 1.2
      const epoxyPacks = Math.ceil(epoxyKg / 16)
      const primerPacks = Math.ceil((area * 0.1) / 15)
      return [
        { name: 'Sơn phủ Epoxy tự san (bộ 16kg)', qty: epoxyPacks, desc: `Tương đương ~${epoxyKg.toFixed(0)}kg (định mức 1.2kg/m²)` },
        { name: 'Sơn lót Epoxy gốc dầu (bộ 15kg)', qty: primerPacks, desc: `Tương đương ~${(area * 0.1).toFixed(0)}kg (định mức 0.1kg/m²)` }
      ]
    } else {
      const discs = Math.ceil(area / 20)
      return [
        { name: 'Đĩa mài sắt kim cương Grit #30', qty: discs, desc: `Đề xuất 1 đĩa mài trên mỗi 20m² bề mặt thô` }
      ]
    }
  }, [rfqForm.projectArea, rfqForm.flooringType])

  const handleRfqSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rfqForm.fullName || !rfqForm.phone || !rfqForm.email) {
      alert('Vui lòng điền đầy đủ Họ tên, Điện thoại và Email để xuất báo giá.')
      return
    }

    setRfqSubmitting(true)
    try {
      const res = await fetch('/api/quotes/project-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...rfqForm,
          isB2b,
          items: [{
            id: product.id,
            name: product.name,
            price: product.price,
            agentPrice: product.agentPrice,
            quantity: 1
          }]
        })
      })

      const data = await res.json()
      if (data.success) {
        posthog.capture('rfq_form_submitted', {
          quoteId: data.quoteId,
          fullName: rfqForm.fullName,
          email: rfqForm.email,
          companyName: rfqForm.companyName,
          projectArea: rfqForm.projectArea,
          flooringType: rfqForm.flooringType,
          productId: product.id,
          productName: product.name,
          isB2b,
        })
        setRfqResult({
          quoteId: data.quoteId,
          pdfUrl: data.pdfUrl,
          excelUrl: data.excelUrl,
          coverageEstimates: data.coverageEstimates
        })
      } else {
        alert('Có lỗi xảy ra: ' + data.error)
      }
    } catch (err) {
      console.error(err)
      posthog.captureException(err, { context: 'rfq_submit_error' })
      alert('Lỗi kết nối máy chủ.')
    } finally {
      setRfqSubmitting(false)
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 font-sans">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-6">
        <Link to="/" className="hover:text-primary-500 transition-colors">Khang Phúc</Link>
        <ChevronRight size={12} />
        <Link to="/products" className="hover:text-primary-500 transition-colors">Sản phẩm</Link>
        <ChevronRight size={12} />
        <span className="text-slate-600 truncate max-w-xs">{product.name}</span>
      </div>

      {/* CORE INFO SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* LEFT GALLERY PANEL */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-square bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-sm flex items-center justify-center">
            {galleryMode === 'photo' ? (
              <PexelsImage query={product.image} className="w-full h-full object-cover" />
            ) : galleryMode === 'video' ? (
              <div className="absolute inset-0 bg-black flex items-center justify-center">
                <video
                  src="https://assets.mixkit.co/videos/preview/mixkit-construction-site-worker-polishing-concrete-floor-41617-large.mp4"
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  muted
                  loop
                />
              </div>
            ) : (
              <div className="absolute inset-0 bg-slate-900 text-white flex flex-col items-center justify-center text-center p-4">
                <RotateCcw size={40} className="text-accent-500 animate-spin" />
                <h4 className="font-heading font-extrabold text-sm text-white mt-4">CHẾ ĐỘ XEM 360 ĐỘ MÔ PHỎNG</h4>
                <p className="text-[10px] text-slate-400 mt-1 max-w-xs leading-relaxed">
                  Nhà thầu có thể kéo thả chuột để xoay máy xem chi tiết các góc cạnh động cơ hành tinh (tính năng đang được mô phỏng).
                </p>
                <button
                  onClick={() => setGalleryMode('photo')}
                  className="mt-4 bg-white/10 hover:bg-white/20 text-white font-bold text-[10px] px-4 py-1.5 rounded-full cursor-pointer transition-colors"
                >
                  Trở lại chế độ ảnh
                </button>
              </div>
            )}

            <div className="absolute top-4 left-4 bg-primary-900/90 text-white font-bold text-[9px] uppercase px-2.5 py-1 rounded shadow flex items-center gap-1.5">
              <Award size={12} className="text-accent-500" />
              <span>CO CQ CHÍNH HÃNG</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setGalleryMode('photo')}
              className={`flex-1 py-2.5 border rounded-lg font-heading font-extrabold text-[10px] tracking-wider transition-colors cursor-pointer ${
                galleryMode === 'photo' ? 'border-primary-500 bg-primary-50/10 text-primary-500' : 'border-slate-200 bg-white text-slate-500'
              }`}
            >
              HÌNH ẢNH DỰ ÁN
            </button>
            <button
              onClick={() => setGalleryMode('video')}
              className={`flex-1 py-2.5 border rounded-lg font-heading font-extrabold text-[10px] tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                galleryMode === 'video' ? 'border-primary-500 bg-primary-50/10 text-primary-500' : 'border-slate-200 bg-white text-slate-500'
              }`}
            >
              <Play size={12} />
              <span>VIDEO REVIEW</span>
            </button>
            <button
              onClick={() => setGalleryMode('360')}
              className={`flex-1 py-2.5 border rounded-lg font-heading font-extrabold text-[10px] tracking-wider transition-colors cursor-pointer ${
                galleryMode === '360' ? 'border-primary-500 bg-primary-50/10 text-primary-500' : 'border-slate-200 bg-white text-slate-500'
              }`}
            >
              MÔ PHỎNG 360°
            </button>
          </div>
        </div>

        {/* RIGHT METRICS DETAIL PANEL */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="inline-block bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                Thương hiệu: {product.brand}
              </span>
              <h1 className="font-heading font-black text-lg md:text-xl text-slate-900 mt-2 leading-snug">
                {product.name}
              </h1>
            </div>

            {/* MULTI-WAREHOUSE STOCK CHECKLIST */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <div className="flex items-center gap-1.5">
                  <Building size={14} className="text-secondary-500" />
                  <span>Trạng Thái Tồn Kho Chi Nhánh:</span>
                </div>
                <span className="text-[10px] text-slate-400 italic">Đã đồng bộ thời gian thực</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between shadow-sm">
                  <span className="font-semibold text-slate-600">Kho TP. Hồ Chí Minh:</span>
                  <span className="font-extrabold text-emerald-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Sẵn hàng ({Math.ceil(product.stock * 0.6)} Máy)
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between shadow-sm">
                  <span className="font-semibold text-slate-600">Kho Hà Nội (Gia Lâm):</span>
                  <span className="font-extrabold text-emerald-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Sẵn hàng ({Math.floor(product.stock * 0.4)} Máy)
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">
                💡 Khách hàng nhà thầu vui lòng cân đối địa điểm kho hàng gần nhất để giảm thiểu tối đa chi phí vận chuyển xe tải/xe cẩu công trình.
              </p>
            </div>

            {/* Detailed price box recalculation */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-150 space-y-3">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Báo giá thương mại tạm tính:</span>
              <div className="flex items-baseline gap-3">
                <span className="font-heading font-black text-lg md:text-xl text-primary-500">
                  {priceToShow.toLocaleString('vi-VN')} ₫
                </span>
                {isB2b && savings > 0 && (
                  <span className="text-xs text-slate-400 line-through">
                    {product.price.toLocaleString('vi-VN')} ₫
                  </span>
                )}
              </div>
              {isB2b && savings > 0 ? (
                <div className="text-[11px] text-success font-bold flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  <span>Quyền lợi đại lý: Bạn tiết kiệm được {savings.toLocaleString('vi-VN')} ₫ / sản phẩm!</span>
                </div>
              ) : (
                <div className="text-[10px] text-slate-400">
                  Giá bán lẻ công khai. Đăng ký tài khoản đại lý hoặc kích hoạt B2B Mode để nhận chiết khấu trực tiếp tới 20%.
                </div>
              )}
            </div>
          </div>

          {/* Primary CTA buy triggers with B2B RFQ */}
          <div className="space-y-3.5 pt-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAdd}
                className={`flex-1 font-bold text-xs tracking-wider py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md ${
                  success ? 'bg-success text-white' : 'bg-primary-500 hover:bg-primary-600 text-white'
                }`}
              >
                <ShoppingCart size={16} />
                <span>{success ? 'ĐÃ THÊM VÀO GIỎ HÀNG' : 'THÊM VÀO GIỎ HÀNG'}</span>
              </button>

              <button
                onClick={() => setIsRfqOpen(true)}
                className="flex-1 bg-secondary-500 hover:bg-secondary-600 text-white font-bold text-xs tracking-wider py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <FileSpreadsheet size={16} />
                <span>YÊU CẦU BÁO GIÁ B2B</span>
              </button>
            </div>
            
            <a
              href="tel:0909123456"
              className="flex w-full bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs tracking-wider py-3 rounded-xl items-center justify-center gap-2 border border-slate-200 transition-all text-center shadow-sm"
            >
              <Phone size={15} className="text-accent-500" />
              <span>LIÊN HỆ KỸ THUẬT / TƯ VẤN THI CÔNG</span>
            </a>
          </div>

          {/* SECTION: FREQUENTLY BOUGHT TOGETHER (THƯỜNG ĐƯỢC MUA CÙNG) */}
          <div className="border-t border-slate-150 pt-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-black text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Settings2 size={14} className="text-secondary-500" />
                <span>Thường được mua cùng (Đề xuất tương thích)</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-bold">Hệ thống đề xuất tự động</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {frequentlyBoughtTogether.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-150 p-2.5 shadow-sm hover:shadow hover:border-primary-500/25 transition-all flex gap-2.5 group"
                >
                  <div className="w-12 h-12 bg-slate-100 rounded overflow-hidden flex-shrink-0 border border-slate-200">
                    <PexelsImage query={item.image} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-primary-500 transition-colors">
                        {item.name}
                      </h4>
                      <span className="text-[9.5px] font-extrabold text-primary-500 block mt-0.5">
                        {(isB2b ? item.agentPrice : item.price).toLocaleString('vi-VN')} ₫
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        addToCart({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          agentPrice: item.agentPrice,
                          image: item.image
                        }, 1)
                        setIsCartOpen(true)
                      }}
                      className="self-start text-[8.5px] font-extrabold text-secondary-500 hover:text-primary-500 transition-colors cursor-pointer mt-1"
                    >
                      + Thêm nhanh
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE SPECIFICATIONS TABS SECTION */}
      <div className="bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-sm mb-12">
        <div className="flex border-b border-slate-150 bg-slate-50 text-xs font-heading font-extrabold uppercase">
          <button
            onClick={() => setActiveTab('desc')}
            className={`px-5 py-4 border-b-2 tracking-wider cursor-pointer transition-all ${
              activeTab === 'desc' ? 'border-primary-500 text-primary-500 bg-white' : 'border-transparent text-slate-500 hover:bg-slate-100/50'
            }`}
          >
            Mô tả chi tiết
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-5 py-4 border-b-2 tracking-wider cursor-pointer transition-all ${
              activeTab === 'specs' ? 'border-primary-500 text-primary-500 bg-white' : 'border-transparent text-slate-500 hover:bg-slate-100/50'
            }`}
          >
            Thông số kỹ thuật
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`px-5 py-4 border-b-2 tracking-wider cursor-pointer transition-all ${
              activeTab === 'manual' ? 'border-primary-500 text-primary-500 bg-white' : 'border-transparent text-slate-500 hover:bg-slate-100/50'
            }`}
          >
            Hướng dẫn vận hành
          </button>
          <button
            onClick={() => setActiveTab('warranty')}
            className={`px-5 py-4 border-b-2 tracking-wider cursor-pointer transition-all ${
              activeTab === 'warranty' ? 'border-primary-500 text-primary-500 bg-white' : 'border-transparent text-slate-500 hover:bg-slate-100/50'
            }`}
          >
            Chính sách bảo hành
          </button>
        </div>

        <div className="p-6 text-xs text-slate-600 leading-relaxed font-medium">
          {activeTab === 'desc' && (
            <div className="space-y-4">
              <p className="text-slate-800 text-xs font-semibold leading-relaxed">
                {product.description}
              </p>
              <h3 className="font-heading font-black text-xs text-primary-500 uppercase tracking-wider pt-2">Đặc điểm nổi bật của sản phẩm:</h3>
              <ul className="space-y-2">
                {product.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="text-secondary-500 mt-0.5 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="max-w-xl">
              <h3 className="font-heading font-black text-xs text-primary-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Settings2 size={14} /> Bảng thông số đo đạc thực tế
              </h3>
              <div className="border border-slate-150 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <tbody>
                    {Object.entries(product.specs).map(([key, val], idx) => (
                      <tr key={key} className={idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                        <td className="px-4 py-2.5 font-bold text-slate-500 border-b border-slate-150/70">{key}</td>
                        <td className="px-4 py-2.5 font-bold text-slate-800 border-b border-slate-150/70">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'manual' && (
            <div className="space-y-4">
              <h3 className="font-heading font-black text-xs text-primary-500 uppercase tracking-wider">Cẩm nang vận hành an toàn:</h3>
              <ol className="list-decimal pl-4 space-y-2 text-slate-600 font-semibold">
                <li><span className="text-slate-800">Kiểm tra nguồn điện và đấu nối 3 pha:</span> Đối với dòng máy công nghiệp ASL, luôn dùng tủ điện biến tần bảo vệ quá dòng pha.</li>
                <li><span className="text-slate-800">Lựa chọn đĩa mài phù hợp Grit:</span> Lắp đĩa sắt đầu mài Grit #30 nếu cần mài phá gồ ghề cao, hoặc Resin pad #50 nếu mài mịn phẳng mờ.</li>
                <li><span className="text-slate-800">Mặc bảo hộ lao động đầy đủ:</span> Luôn kết nối đầu nối máy hút bụi KMS-80 trước khi mài khô để triệt tiêu bụi silic độc hại.</li>
                <li><span className="text-slate-800">Kiểm tra bánh xe nâng hạ:</span> Cân bằng cốt mâm đĩa xoay song song bề mặt nền trước khi hạ máy chốt khởi động.</li>
              </ol>
            </div>
          )}

          {activeTab === 'warranty' && (
            <div className="space-y-4">
              <h3 className="font-heading font-black text-xs text-primary-500 uppercase tracking-wider">Chế độ bảo hành đặc quyền Khang Phúc:</h3>
              <p>
                - Bảo hành chính hãng động cơ và hệ thống mâm hành tinh <span className="font-bold text-primary-500">18 - 24 tháng</span> (tùy thuộc vào model máy mài).
              </p>
              <p>
                - Hỗ trợ đổi mới động cơ trong vòng <span className="font-bold text-primary-500">30 ngày đầu</span> nếu phát hiện lỗi từ khâu đúc cuộn đồng nhà máy.
              </p>
              <p>
                - Miễn phí cung cấp linh kiện hao mòn thay thế định kỳ năm đầu tiên (vòng đệm, ốc mâm dán đĩa).
              </p>
            </div>
          )}
        </div>
      </div>

      {/* B2B RFQ MODAL */}
      {isRfqOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden font-sans flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-primary-900 to-primary-950 px-6 py-4 text-white flex items-center justify-between">
              <div>
                <h3 className="font-heading font-black text-sm uppercase tracking-wider text-accent-500 flex items-center gap-1.5">
                  <FileSpreadsheet size={18} />
                  <span>Yêu Cầu Báo Giá Dự Án B2B</span>
                </h3>
                <p className="text-[10px] text-slate-300 mt-0.5 font-semibold">
                  Gom đơn, tính định mức vật tư tự động và xuất báo giá tạm tính
                </p>
              </div>
              <button 
                onClick={() => {
                  setIsRfqOpen(false)
                  setRfqResult(null)
                }}
                className="text-slate-300 hover:text-white transition-colors cursor-pointer bg-white/10 hover:bg-white/20 p-1.5 rounded-full"
              >
                <ChevronRight className="rotate-90" size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {!rfqResult ? (
                <form onSubmit={handleRfqSubmit} className="space-y-4">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 flex gap-3 items-center">
                    <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 overflow-hidden flex-shrink-0">
                      <PexelsImage query={product.image} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{product.name}</h4>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                        Đang yêu cầu báo giá sỉ cho: 1 Máy
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Họ và Tên người liên hệ *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="VD: Nguyễn Văn Khang"
                        value={rfqForm.fullName}
                        onChange={e => setRfqForm(prev => ({ ...prev, fullName: e.target.value }))}
                        className="w-full text-xs font-semibold px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Số điện thoại *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="VD: 0909123456"
                        value={rfqForm.phone}
                        onChange={e => setRfqForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full text-xs font-semibold px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email liên hệ *</label>
                      <input 
                        type="email" 
                        required
                        placeholder="VD: contact@delta.com"
                        value={rfqForm.email}
                        onChange={e => setRfqForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full text-xs font-semibold px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tên công ty / Nhà thầu</label>
                      <input 
                        type="text" 
                        placeholder="VD: Công ty XD Sàn Bê Tông Delta"
                        value={rfqForm.companyName}
                        onChange={e => setRfqForm(prev => ({ ...prev, companyName: e.target.value }))}
                        className="w-full text-xs font-semibold px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Địa chỉ giao hàng / Công trình *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="VD: Số 5 Đường số 3, KCN VSIP 2, Bình Dương"
                      value={rfqForm.address}
                      onChange={e => setRfqForm(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full text-xs font-semibold px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Diện tích mặt sàn dự kiến (m²)</label>
                      <input 
                        type="number" 
                        placeholder="VD: 500"
                        value={rfqForm.projectArea}
                        onChange={e => setRfqForm(prev => ({ ...prev, projectArea: e.target.value }))}
                        className="w-full text-xs font-semibold px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Giải pháp thi công yêu cầu</label>
                      <select 
                        value={rfqForm.flooringType}
                        onChange={e => setRfqForm(prev => ({ ...prev, flooringType: e.target.value }))}
                        className="w-full text-xs font-bold px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500 bg-white"
                      >
                        <option value="Sơn Epoxy tự san phẳng">Sơn Epoxy tự san phẳng (1mm - 3mm)</option>
                        <option value="Sơn Epoxy hệ lăn 3 lớp">Sơn Epoxy hệ lăn 3 lớp (0.3mm)</option>
                        <option value="Mài bóng tăng cứng Lithium">Mài bóng & Tăng cứng sàn bê tông Lithium</option>
                        <option value="Xử lý bề mặt sàn bê tông thô">Xử lý tạo nhám sàn bê tông thô</option>
                      </select>
                    </div>
                  </div>

                  {/* LIVE ESTIMATION PREVIEW PANEL */}
                  {liveMaterialEstimation && (
                    <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200/60 space-y-2">
                      <span className="text-[10px] text-amber-700 font-extrabold uppercase tracking-wider block">
                        ⚙️ Định mức vật tư đề xuất hệ thống tính toán sơ bộ:
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-700 font-semibold">
                        {liveMaterialEstimation.map((est, idx) => (
                          <li key={idx} className="flex justify-between items-start gap-2">
                            <span>- {est.name}</span>
                            <span className="text-primary-600 font-extrabold text-right">
                              SL: {est.qty} bộ/cái <span className="text-[10px] text-slate-400 block font-normal">{est.desc}</span>
                            </span>
                          </li>
                        ))}
                      </ul>
                      <p className="text-[10px] text-slate-400 pt-1 leading-normal italic">
                        * Số lượng này được hệ thống gom đơn tự động dựa trên diện tích nhập và sẽ bao gồm trong file báo giá PDF đính kèm.
                      </p>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Yêu cầu đặc thù / Quy cách khác</label>
                    <textarea 
                      placeholder="VD: Cần máy mâm 12 đĩa mài hành tinh đảo chiều và đĩa mài sắt mác bê tông cao #250..."
                      value={rfqForm.notes}
                      onChange={e => setRfqForm(prev => ({ ...prev, notes: e.target.value }))}
                      rows={2}
                      className="w-full text-xs font-semibold px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={rfqSubmitting}
                    className="w-full bg-primary-900 hover:bg-primary-950 text-accent-500 font-heading font-extrabold text-xs tracking-wider py-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md disabled:bg-slate-400 disabled:text-white"
                  >
                    {rfqSubmitting ? 'ĐANG KHỞI TẠO BÁO GIÁ & GỬI WEBHOOK...' : 'GỬI YÊU CẦU & XUẤT FILE TẠM TÍNH'}
                  </button>
                </form>
              ) : (
                /* SUCCESS SCREEN WITH DOWNLOADS */
                <div className="text-center py-8 space-y-6">
                  <div className="w-16 h-16 bg-success/15 text-success rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={36} className="stroke-[2.5]" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-heading font-black text-base text-slate-800">
                      GỬI YÊU CẦU BÁO GIÁ THÀNH CÔNG!
                     </h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                      Mã báo giá dự án của bạn là <strong className="text-primary-600">{rfqResult.quoteId}</strong>. Thông báo chi tiết kèm bảng tính khối lượng đã được gửi về nhóm Zalo Sales nội bộ để nhân viên duyệt chiết khấu.
                    </p>
                  </div>

                  {rfqResult.coverageEstimates && rfqResult.coverageEstimates.length > 0 && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 max-w-md mx-auto text-left space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Bảng gom đơn đề xuất:</span>
                      <ul className="text-xs text-slate-700 font-semibold space-y-1.5">
                        {rfqResult.coverageEstimates.map((est, idx) => (
                          <li key={idx} className="flex justify-between items-center">
                            <span>{est.item}</span>
                            <span className="text-primary-500 font-black">SL: {est.calculatedQty}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto pt-4">
                    <a 
                      href={rfqResult.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs tracking-wider py-3 rounded-lg flex items-center justify-center gap-1.5 shadow"
                    >
                      <Download size={14} />
                      <span>TẢI BÁO GIÁ (PDF)</span>
                    </a>
                    <a 
                      href={rfqResult.excelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs tracking-wider py-3 rounded-lg flex items-center justify-center gap-1.5 border border-slate-200"
                    >
                      <Download size={14} />
                      <span>TẢI BẢNG TÍNH (EXCEL)</span>
                    </a>
                  </div>

                  <button 
                    onClick={() => {
                      setIsRfqOpen(false)
                      setRfqResult(null)
                    }}
                    className="text-xs text-slate-400 hover:text-slate-600 font-bold cursor-pointer pt-4 block mx-auto underline"
                  >
                    Đóng hộp thoại báo giá
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
