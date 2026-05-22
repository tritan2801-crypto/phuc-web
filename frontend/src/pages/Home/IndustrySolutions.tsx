import React from 'react'
import { Link } from 'react-router-dom'
import { Building2, ArrowRight, CheckCircle } from 'lucide-react'
import PexelsImage from '../../components/ui/PexelsImage'

interface Solution {
  slug: string
  title: string
  image: string
  desc: string
  machine: string
  chemical: string
  challenges: string[]
}

export default function IndustrySolutions() {
  const solutions: Solution[] = [
    {
      slug: 'nha-xuong',
      title: 'Nhà Xưởng Chế Tạo & Cơ Khí',
      image: 'factory-solution',
      desc: 'Bề mặt nền bê tông chịu rung chấn lớn, vết dầu nhớt loang lổ và xe nâng tải trọng cao di chuyển liên tục.',
      machine: 'Máy mài ASL-600 T8 (15HP)',
      chemical: 'Sơn Epoxy Tự San Phẳng EP-SL',
      challenges: ['Chịu va đập kháng chấn', 'Kháng dầu nhớt, hóa chất', 'Độ bám đường xe nâng tốt']
    },
    {
      slug: 'kho-logistics',
      title: 'Kho Hàng & Trung Tâm Logistics',
      image: 'logistics-solution',
      desc: 'Diện tích mặt sàn cực lớn, yêu cầu độ phẳng phẳng tuyệt đối siêu phẳng (Super Flat) chống phát sinh bụi mịn.',
      machine: 'Máy mài ngồi lái Ronlon RX-800',
      chemical: 'Tăng cứng Lithium Densifier LP-01',
      challenges: ['Chống phát sinh bụi 100%', 'Mặt sàn siêu phẳng chuẩn quốc tế', 'Độ chịu mài mòn cực đại']
    },
    {
      slug: 'benh-vien',
      title: 'Bệnh Viện & Phòng Sạch Dược Phẩm',
      image: 'hospital-solution',
      desc: 'Yêu cầu kiểm soát kháng khuẩn, kháng nấm mốc tuyệt đối, chống tĩnh điện và dễ lau chùi tẩy trùng.',
      machine: 'Máy chà sàn liên hợp KMS-50B',
      chemical: 'Sơn Epoxy Tự San Chống Tĩnh Điện',
      challenges: ['Kháng khuẩn tuyệt đối', 'Màng sơn không vết nối', 'Kháng hóa chất sát trùng tẩy rửa']
    },
    {
      slug: 'nha-may-thuc-pham',
      title: 'Nhà Máy Thực Phẩm & Thủy Sản',
      image: 'food-solution',
      desc: 'Thường xuyên tiếp xúc nước nóng, dầu mỡ động vật và axit hữu cơ từ nước trái cây, chênh lệch nhiệt độ cao.',
      machine: 'Máy mài chuẩn bị nền KMS-250',
      chemical: 'Sơn PU-Crete Tự San Chịu Lực Nhiệt',
      challenges: ['Chịu sốc nhiệt lạnh -40°C đến 120°C', 'Kháng axit hữu cơ ăn mòn', 'Bề mặt sần chống trơn trượt ướt']
    }
  ]

  return (
    <section className="bg-slate-900 text-white py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center space-y-2 mb-12">
          <span className="text-accent-500 text-xs font-bold uppercase tracking-wider block">Thiết Kế Chuyên Biệt</span>
          <h2 className="font-heading font-black text-2xl tracking-tight text-white">
            Giải pháp sàn công nghiệp theo ngành nghề
          </h2>
          <p className="text-slate-400 text-xs max-w-xl mx-auto leading-relaxed mt-2">
            Mỗi ngành sản xuất có đặc tính cơ lý riêng. Khang Phúc tư vấn giải pháp đồng bộ kết hợp đúng chủng loại máy mài mâm xoa và vật liệu sơn phủ thích hợp.
          </p>
        </div>

        {/* SOLUTIONS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutions.map((sol) => (
            <div
              key={sol.slug}
              className="bg-slate-950/40 rounded-2xl border border-white/5 overflow-hidden flex flex-col justify-between hover:border-accent-500/30 transition-all duration-300 group"
            >
              {/* Image header */}
              <div className="h-44 relative bg-slate-800">
                <PexelsImage query={sol.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <h3 className="absolute bottom-4 left-4 font-heading font-extrabold text-sm text-white flex items-center gap-1.5">
                  <Building2 size={15} className="text-accent-500" />
                  <span>{sol.title}</span>
                </h3>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3.5">
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {sol.desc}
                  </p>

                  <div className="space-y-1.5">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Cấu hình đề xuất:</div>
                    <div className="text-[11px] font-semibold text-slate-300">
                      📟 Thiết bị: {sol.machine}
                    </div>
                    <div className="text-[11px] font-semibold text-accent-500">
                      🧪 Vật liệu: {sol.chemical}
                    </div>
                  </div>

                  <div className="h-px bg-white/5" />

                  {/* Requirements checks */}
                  <ul className="space-y-1 text-[10px] text-slate-400 font-medium">
                    {sol.challenges.map((c, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle size={10} className="text-secondary-500" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2">
                  <Link
                    to={`/giai-phap/${sol.slug}`}
                    className="w-full bg-white/5 hover:bg-accent-500 hover:text-primary-900 text-white font-bold text-[10px] py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-white/10 hover:border-transparent uppercase tracking-wider"
                  >
                    <span>Xem giải pháp</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
