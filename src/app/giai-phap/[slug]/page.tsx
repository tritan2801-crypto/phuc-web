'use client'

import React, { useMemo } from 'react'
import { useParams } from 'next/navigation'
import SolutionLanding from '@/features/solutions/components/SolutionLanding'

const SOLUTIONS_DATA = [
  {
    slug: 'nha-xuong',
    title: 'Nhà Xưởng Chế Tạo & Cơ Khí',
    image: 'factory-solution',
    desc: 'Bề mặt nền bê tông chịu rung chấn lớn, vết dầu nhớt loang lổ và xe nâng tải trọng cao di chuyển liên tục.',
    machine: 'Máy mài ASL-600 T8 (15HP)',
    chemical: 'Sơn Epoxy Tự San Phẳng EP-SL',
    challenges: ['Chịu va đập kháng chấn', 'Kháng dầu nhớt, hóa chất', 'Độ bám đường xe nâng tốt'],
    packageItems: [
      { id: 'may-mai-asl-600', quantity: 1 },
      { id: 'son-epoxy-tu-san', quantity: 10 },
      { id: 'bay-rang-cua-inox', quantity: 2 },
      { id: 'roller-spike-epoxy', quantity: 2 }
    ]
  },
  {
    slug: 'kho-logistics',
    title: 'Kho Hàng & Trung Tâm Logistics',
    image: 'logistics-solution',
    desc: 'Diện tích mặt sàn cực lớn, yêu cầu độ phẳng phẳng tuyệt đối siêu phẳng (Super Flat) chống phát sinh bụi mịn.',
    machine: 'Máy mài ngồi lái Ronlon RX-800',
    chemical: 'Tăng cứng Lithium Densifier LP-01',
    challenges: ['Chống phát sinh bụi 100%', 'Mặt sàn siêu phẳng chuẩn quốc tế', 'Độ chịu mài mòn cực đại'],
    packageItems: [
      { id: 'may-mai-ronlon-800', quantity: 1 },
      { id: 'chat-tang-cung-lithium', quantity: 15 },
      { id: 'dia-mai-kim-cuong-30', quantity: 27 },
      { id: 'resin-pad-50', quantity: 50 }
    ]
  },
  {
    slug: 'benh-vien',
    title: 'Bệnh Viện & Phòng Sạch Dược Phẩm',
    image: 'hospital-solution',
    desc: 'Yêu cầu kiểm soát kháng khuẩn, kháng nấm mốc tuyệt đối, chống tĩnh điện và dễ lau chùi tẩy trùng.',
    machine: 'Máy chà sàn liên hợp KMS-50B',
    chemical: 'Sơn Epoxy Tự San Chống Tĩnh Điện',
    challenges: ['Kháng khuẩn tuyệt đối', 'Màng sơn không vết nối', 'Kháng hóa chất sát trùng tẩy rửa'],
    packageItems: [
      { id: 'may-cha-san-kms-50b', quantity: 1 },
      { id: 'son-epoxy-tu-san', quantity: 8 }
    ]
  },
  {
    slug: 'nha-may-thuc-pham',
    title: 'Nhà Máy Thực Phẩm & Thủy Sản',
    image: 'food-solution',
    desc: 'Thường xuyên tiếp xúc nước nóng, dầu mỡ động vật và axit hữu cơ từ nước trái cây, chênh lệch nhiệt độ cao.',
    machine: 'Máy mài chuẩn bị nền KMS-250',
    chemical: 'Sơn PU-Crete Tự San Chịu Lực Nhiệt',
    challenges: ['Chịu sốc nhiệt lạnh -40°C đến 120°C', 'Kháng axit hữu cơ ăn mòn', 'Bề mặt sần chống trơn trượt ướt'],
    packageItems: [
      { id: 'may-mai-kms-250', quantity: 1 },
      { id: 'son-pu-crete', quantity: 12 },
      { id: 'cat-silica', quantity: 20 }
    ]
  }
]

export default function SolutionPage() {
  const params = useParams()
  const slug = params?.slug as string

  const solution = useMemo(() => {
    return SOLUTIONS_DATA.find(s => s.slug === slug) || SOLUTIONS_DATA[0]
  }, [slug])

  return <SolutionLanding solution={solution} />
}
