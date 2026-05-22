import React, { useState } from 'react'
import { Play, PlayCircle, RefreshCw, Calendar, MapPin } from 'lucide-react'

interface CaseStudy {
  id: string
  title: string
  location: string
  date: string
  beforeImage: string
  afterImage: string
  videoThumbnail: string
  videoTitle: string
}

export default function VideoCaseStudies() {
  const [activeTab, setActiveTab] = useState<'video' | 'before-after'>('video')
  const [activeVideo, setActiveVideo] = useState(0)

  const cases: CaseStudy[] = [
    {
      id: 'case-1',
      title: 'Mài tăng cứng Lithium kho logistics SLS Bắc Ninh (12.000 m2)',
      location: 'KCN Yên Phong, Bắc Ninh',
      date: 'Tháng 04/2026',
      beforeImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800',
      afterImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
      videoThumbnail: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
      videoTitle: 'Review máy mài ngồi lái Ronlon RX-800 thực chiến mài sàn'
    },
    {
      id: 'case-2',
      title: 'Thi công sơn Epoxy tự san phẳng nhà máy dược phẩm Mediphar (3.500 m2)',
      location: 'KCN Hòa Khánh, Đà Nẵng',
      date: 'Tháng 03/2026',
      beforeImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800',
      afterImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      videoThumbnail: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800',
      videoTitle: 'Quy trình sơn tự phẳng dày 2mm dùng bàn gạt răng cưa inox'
    }
  ]

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-slate-150 pb-5">
        <div>
          <span className="text-secondary-500 text-xs font-bold uppercase tracking-wider block">Thực Tế Công Trình</span>
          <h2 className="font-heading font-black text-2xl text-slate-800 tracking-tight mt-1">
            Video thực tế & Case study tiêu biểu
          </h2>
        </div>
        
        {/* Toggle between videos and before-after */}
        <div className="flex bg-slate-100 rounded-lg p-1.5 mt-4 md:mt-0 max-w-sm self-start">
          <button
            onClick={() => setActiveTab('video')}
            className={`px-4 py-2 text-[10px] font-heading font-extrabold tracking-wider rounded-md transition-all cursor-pointer ${
              activeTab === 'video' ? 'bg-white text-primary-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            VIDEO THI CÔNG & MÁY
          </button>
          <button
            onClick={() => setActiveTab('before-after')}
            className={`px-4 py-2 text-[10px] font-heading font-extrabold tracking-wider rounded-md transition-all cursor-pointer ${
              activeTab === 'before-after' ? 'bg-white text-primary-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            BEFORE / AFTER DỰ ÁN
          </button>
        </div>
      </div>

      {activeTab === 'video' ? (
        /* VIDEOS TAB VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main big video player card */}
          <div className="lg:col-span-2 relative rounded-2xl overflow-hidden shadow-lg aspect-video bg-slate-900 group">
            <img
              src={cases[activeVideo].videoThumbnail}
              alt="Video Thumbnail"
              className="w-full h-full object-cover opacity-85 group-hover:scale-102 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-accent-500 hover:bg-accent-600 text-primary-900 flex items-center justify-center cursor-pointer transition-all duration-300 shadow-[0_0_20px_rgba(245,166,35,0.4)] group-hover:scale-110">
                <Play size={28} className="fill-primary-900 ml-1" />
              </div>
            </div>
            {/* Video overlay subtitle info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950 to-slate-950/0 text-white">
              <span className="bg-red-600 text-[9px] font-bold tracking-wider px-2 py-0.5 rounded uppercase self-start mb-2 inline-block">
                Video clip thực tế
              </span>
              <h3 className="font-heading font-extrabold text-sm md:text-base text-accent-500 leading-tight">
                {cases[activeVideo].videoTitle}
              </h3>
              <p className="text-[10px] text-slate-300 mt-1 flex items-center gap-1.5">
                <MapPin size={11} /> {cases[activeVideo].title}
              </p>
            </div>
          </div>

          {/* Video selector list on right */}
          <div className="space-y-4">
            <h4 className="font-heading font-black text-xs text-slate-400 uppercase tracking-wider">Danh sách video kỹ thuật:</h4>
            <div className="space-y-3">
              {cases.map((cs, idx) => (
                <button
                  key={cs.id}
                  onClick={() => setActiveVideo(idx)}
                  className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 hover:bg-slate-50 transition-all cursor-pointer ${
                    idx === activeVideo ? 'border-primary-500 bg-primary-50/10 shadow-sm' : 'border-slate-150 bg-white'
                  }`}
                >
                  <div className="w-16 h-12 bg-slate-100 rounded-lg overflow-hidden relative flex-shrink-0 border border-slate-200">
                    <img src={cs.videoThumbnail} alt="Thumb" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-950/20 flex items-center justify-center text-white">
                      <PlayCircle size={14} className="fill-slate-900/60 text-white" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-[11px] font-bold text-slate-800 leading-snug line-clamp-2">{cs.videoTitle}</h5>
                    <span className="text-[9px] text-slate-400 block mt-1">{cs.location}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* BEFORE AFTER TAB VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cases.map((cs) => (
            <div key={cs.id} className="bg-white rounded-2xl border border-slate-150 shadow-sm overflow-hidden p-5 space-y-4">
              <h3 className="font-heading font-bold text-xs md:text-sm text-slate-800 leading-snug">
                {cs.title}
              </h3>
              <div className="flex items-center gap-4 text-[10px] text-slate-400 font-semibold mb-3">
                <span className="flex items-center gap-1"><Calendar size={11} /> {cs.date}</span>
                <span className="flex items-center gap-1"><MapPin size={11} /> {cs.location}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 relative rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
                {/* BEFORE block */}
                <div className="relative h-44">
                  <img src={cs.beforeImage} alt="Mặt bê tông cũ nứt" className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 left-2 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow">
                    TRƯỚC THI CÔNG
                  </span>
                </div>
                {/* AFTER block */}
                <div className="relative h-44">
                  <img src={cs.afterImage} alt="Mặt bê tông bóng loáng" className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 left-2 bg-success text-white text-[9px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-0.5">
                    <RefreshCw size={8} className="animate-spin" /> SAU THI CÔNG
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
