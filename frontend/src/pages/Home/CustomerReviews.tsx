import React from 'react'
import { Star, Quote, Award } from 'lucide-react'

interface Review {
  name: string
  role: string
  company: string
  content: string
  rating: number
}

export default function CustomerReviews() {
  const reviews: Review[] = [
    {
      name: 'Anh Phan Minh Hải',
      role: 'Giám Đốc Kỹ Thuật',
      company: 'Công ty XD & Thương Mại Hải Nam',
      content: 'Chúng tôi đã mua 2 máy ASL-600 T8 của Khang Phúc. Máy đầm, rung động ít và mâm răng hành tinh chạy êm ru. Thích nhất là đội ngũ kỹ thuật đồng hành cùng nhà thầu trực tiếp tại công trình Bắc Ninh hướng dẫn kỹ thuật mài tăng cứng rất nhiệt tình!',
      rating: 5
    },
    {
      name: 'Chị Nguyễn Thu Trang',
      role: 'Chủ xưởng dệt',
      company: 'Nhà máy dệt may Hanosimex',
      content: 'Nhà xưởng của chúng tôi tự sơn Epoxy tự phẳng dùng sơn lót và phủ Khang Phúc EP-SL. Sàn phẳng lỳ như mặt gương, xe nâng 3.5 tấn di chuyển xếp hàng liên tục mà không thấy một vết trầy xước hay bong tróc nào. Giá đại lý chiết khấu rất tốt.',
      rating: 5
    }
  ]

  return (
    <section className="bg-slate-50 py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center space-y-2 mb-12">
          <span className="text-secondary-500 text-xs font-bold uppercase tracking-wider block">Ý Kiến Khách Hàng</span>
          <h2 className="font-heading font-black text-2xl text-slate-800 tracking-tight">
            Đánh giá thực tế từ nhà thầu & chủ đầu tư
          </h2>
        </div>

        {/* REVIEWS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm relative flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow duration-300"
            >
              {/* Double quotes water mark */}
              <Quote className="absolute right-6 top-6 text-slate-100 w-12 h-12 stroke-[1.5]" />
              
              <div className="space-y-3 relative z-10">
                {/* Stars ratings */}
                <div className="flex gap-0.5 text-accent-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={14} className="fill-accent-500" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{rev.content}"
                </p>
              </div>

              <div className="flex items-center gap-3 border-t border-slate-100 pt-4 mt-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-900 flex items-center justify-center text-white font-bold text-xs">
                  {rev.name.charAt(4)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>{rev.name}</span>
                    <Award size={12} className="text-accent-500" />
                  </h4>
                  <p className="text-[10px] text-slate-400 font-semibold">{rev.role} — <span className="text-slate-500">{rev.company}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
