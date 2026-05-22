export interface Product {
  id: string
  name: string
  category: string
  subCategory?: string
  brand: string
  price: number
  agentPrice: number
  power?: string
  weight?: string
  image: string
  description: string
  features: string[]
  specs: Record<string, string>
  stock: number
  inStock: boolean
  warehouse: string[]
  badge?: 'NEW' | 'VỪA VỀ KHO' | 'HOT'
}

export interface Combo {
  id: string
  name: string
  description: string
  originalPrice: number
  price: number
  agentPrice: number
  savings: number
  image: string
  items: { productName: string; quantity: number }[]
  tags: string[]
}

export interface Blog {
  id: string
  title: string
  slug: string
  category: string
  summary: string
  content: string
  image: string
  date: string
  author: string
}

export const MOCK_PRODUCTS: Product[] = [
  // SECTION: MÁY MÀI SÀN
  {
    id: 'may-mai-kvg-17e',
    name: 'Máy mài sàn bê tông Karva KVG-17E',
    category: 'may-moc',
    subCategory: 'may-mai-san',
    brand: 'Karva',
    price: 15500000,
    agentPrice: 12000000,
    power: '2.5 HP',
    weight: '48 kg',
    image: 'construction floor grinder machinery',
    description: 'Máy mài sàn bê tông mini Karva KVG-17E có thiết kế gọn nhẹ, linh hoạt, cực kỳ thích hợp cho các công trình dân dụng, căn hộ mài góc sàn, bo chân tường và thi công mài đánh bóng diện tích nhỏ.',
    features: [
      'Động cơ 100% dây đồng nguyên chất tải khỏe, bền bỉ',
      'Tay cầm điều chỉnh linh hoạt góc nghiêng',
      'Đế gắn đĩa đa năng, phù hợp cả đĩa kim cương và pad nhựa',
      'Có van xả nước điều chỉnh lượng nước linh hoạt'
    ],
    specs: {
      'Công suất': '2.5 HP (1.8 KW)',
      'Điện áp': '220 V / 50 Hz',
      'Tốc độ vòng quay': '175 RPM',
      'Đường kính mâm': '17 inch',
      'Trọng lượng': '48 kg',
      'Xuất xứ': 'Liên doanh công nghệ Đức'
    },
    stock: 12,
    inStock: true,
    warehouse: ['Hà Nội', 'TP. HCM'],
    badge: 'NEW'
  },
  {
    id: 'may-mai-kms-250',
    name: 'Máy mài nền bê tông Kumisai KMS-250',
    category: 'may-moc',
    subCategory: 'may-mai-san',
    brand: 'Kumisai',
    price: 28000000,
    agentPrice: 22500000,
    power: '5.5 HP',
    weight: '90 kg',
    image: 'industrial concrete floor grinding machine',
    description: 'Máy mài nền Kumisai KMS-250 là dòng máy tầm trung bán chạy nhất dành cho nhà thầu chuyên nghiệp để chuẩn bị bề mặt sơn epoxy, xử lý các khuyết tật nền bê tông gồ ghề.',
    features: [
      'Kháng thép dày sơn tĩnh điện chống va đập và mài mòn',
      'Tích hợp đầu kết nối máy hút bụi giảm thiểu 99% bụi mịn',
      'Mâm đĩa 6 đầu gắn linh hoạt các loại đĩa kim cương mài phá',
      'Bánh xe cao su đặc di chuyển đầm và không để lại dấu vết'
    ],
    specs: {
      'Công suất': '5.5 HP (4.0 KW)',
      'Điện áp': '380 V / 50 Hz (3 Pha)',
      'Tốc độ vòng quay': '750 RPM',
      'Đường kính làm việc': '250 mm',
      'Trọng lượng': '90 kg',
      'Bảo hành': '18 tháng'
    },
    stock: 8,
    inStock: true,
    warehouse: ['Hà Nội', 'Đà Nẵng', 'TP. HCM'],
    badge: 'VỪA VỀ KHO'
  },
  {
    id: 'may-mai-asl-600',
    name: 'Máy mài sàn công nghiệp ASL-600 T8',
    category: 'may-moc',
    subCategory: 'may-mai-san',
    brand: 'ASL',
    price: 85000000,
    agentPrice: 68000000,
    power: '15 HP',
    weight: '290 kg',
    image: 'large industrial floor grinder heavy machinery',
    description: 'ASL-600 T8 thuộc dòng máy mài đánh bóng bê tông công nghiệp hiệu suất cực lớn với kết cấu mâm bánh răng hành tinh 4 đĩa đảo chiều xoay chéo, lý tưởng cho kho logistics, nhà máy diện tích lớn.',
    features: [
      'Công nghệ hộp số bánh răng thép siêu cường chống giật rung',
      'Kết cấu mâm hành tinh 12 đĩa mài cho độ phẳng hoàn hảo',
      'Hệ thống điều khiển biến tần thông minh tự động bảo vệ quá tải',
      'Thùng chứa nước dung tích lớn 30L chống gỉ'
    ],
    specs: {
      'Công suất': '15 HP (11 KW)',
      'Điện áp': '380 V - 440 V / 50 Hz',
      'Tốc độ mâm': '300 - 1500 RPM (Biến tần)',
      'Đường kính làm việc': '600 mm',
      'Số lượng đĩa gắn': '12 đĩa kim cương',
      'Trọng lượng': '290 kg'
    },
    stock: 4,
    inStock: true,
    warehouse: ['Hà Nội', 'TP. HCM']
  },
  {
    id: 'may-mai-ronlon-800',
    name: 'Máy mài nền bê tông ngồi lái Ronlon RX-800',
    category: 'may-moc',
    subCategory: 'may-mai-san',
    brand: 'Ronlon',
    price: 195000000,
    agentPrice: 165000000,
    power: '20 HP',
    weight: '580 kg',
    image: 'ride-on industrial floor grinder machine logistics',
    description: 'Dòng máy mài ngồi lái siêu cấp Ronlon RX-800 được thiết kế cho các dự án sân bay, bãi đỗ xe thương mại hàng chục ngàn m2, giúp nhà thầu tiết kiệm 80% nhân lực thi công.',
    features: [
      'Hệ thống lái bằng joystick cơ động, nhẹ nhàng như xe điện',
      'Đèn LED chiếu sáng công suất lớn làm đêm tối ưu',
      'Hệ thống hút bụi khép kín và tự động cấp nước định lượng',
      'Ghế bọc da giảm xóc êm ái bảo vệ cột sống người vận hành'
    ],
    specs: {
      'Công suất': '20 HP (15 KW)',
      'Chiều rộng mài': '800 mm',
      'Mâm mài': '4 mâm xoay ngược chiều (12 đĩa)',
      'Tốc độ di chuyển': '0 - 6 km/h',
      'Trọng lượng': '580 kg',
      'Bảo hành': '24 tháng tại công trình'
    },
    stock: 2,
    inStock: true,
    warehouse: ['Bình Dương (TP. HCM)']
  },

  // SECTION: MÁY VỆ SINH CÔNG NGHIỆP
  {
    id: 'may-hut-bui-kms-80',
    name: 'Máy hút bụi công nghiệp Kumisai KMS-80',
    category: 'may-moc',
    subCategory: 'may-hut-bui',
    brand: 'Kumisai',
    price: 5800000,
    agentPrice: 4500000,
    power: '3000 W',
    weight: '25 kg',
    image: 'wet dry industrial vacuum cleaner stainless steel tank',
    description: 'Máy hút bụi khô và ướt công suất siêu lớn Kumisai KMS-80 trang bị 3 motor chuyên dùng thu gom cát đá, nước bẩn và bụi mịn trong thi công mài sàn bê tông.',
    features: [
      '3 Motor Ametek nhập khẩu Mỹ bền bỉ vượt trội',
      'Thùng chứa inox không gỉ dung tích thực cực đại 80 Lít',
      'Hệ thống màng lọc bụi HEPA ngăn chặn bụi siêu mịn thoát ra ngoài',
      'Có ống xả nước bẩn tiện lợi không cần khênh vác nặng nhọc'
    ],
    specs: {
      'Công suất': '3000 W (3 Motor x 1000W)',
      'Điện áp': '220 V / 50 Hz',
      'Dung tích thùng chứa': '80 Lít',
      'Lưu lượng khí': '120 L/s',
      'Chất liệu thùng': 'Inox 304 cao cấp'
    },
    stock: 24,
    inStock: true,
    warehouse: ['Hà Nội', 'Đà Nẵng', 'TP. HCM']
  },
  {
    id: 'may-cha-san-kms-50b',
    name: 'Máy chà sàn liên hợp đẩy tay Kumisai KMS-50B',
    category: 'may-moc',
    subCategory: 'may-cha-san',
    brand: 'Kumisai',
    price: 32000000,
    agentPrice: 26000000,
    power: '1200 W',
    weight: '110 kg',
    image: 'walk-behind industrial floor scrubber dryer blue',
    description: 'Máy chà sàn và hút nước liên hợp tự động KMS-50B chà rửa đến đâu, làm khô ráo tức thì đến đó, cực kỳ lý tưởng cho hành lang nhà máy dược phẩm, trung tâm thương mại bận rộn.',
    features: [
      'Chức năng 2-trong-1 vừa chà cọ vừa hút sạch nước bẩn tức thì',
      'Bàn hút nước bằng cao su cao cấp hình chữ V ôm khít sàn',
      'Hệ thống motor hút thế hệ mới giảm thiểu tối đa tiếng ồn',
      'Ắc quy dung lượng lớn cho thời gian vận hành liên tục 3-4 giờ'
    ],
    specs: {
      'Chiều rộng bàn chà': '510 mm',
      'Chiều rộng bàn hút': '770 mm',
      'Hiệu suất làm việc': '2000 m2/h',
      'Thùng chứa nước sạch': '50 Lít',
      'Thùng chứa nước bẩn': '50 Lít',
      'Trọng lượng': '110 kg'
    },
    stock: 5,
    inStock: true,
    warehouse: ['Hà Nội', 'TP. HCM']
  },

  // SECTION: ĐĨA MÀI & PHỤ KIỆN
  {
    id: 'dia-mai-kim-cuong-30',
    name: 'Đĩa mài kim cương bê tông #30 (Đầu sắt)',
    category: 'dia-mai',
    subCategory: 'dia-mai-be-tong',
    brand: 'Khang Phúc Premium',
    price: 95000,
    agentPrice: 75000,
    image: 'metal diamond grinding segment shoe concrete',
    description: 'Đĩa mài sắt kim cương Grit #30 chuyên dùng lắp máy mài lớn để mài phá phá lớp sơn cũ, mài hạ cốt nền bê tông gồ ghề trước khi phủ Epoxy.',
    features: [
      'Hàm lượng bột kim cương nhân tạo cao tăng tốc độ mài phá',
      'Khối liên kết sắt dày chống chịu lực ma sát và nhiệt độ lớn',
      'Thao tác thay đĩa nhanh, ăn khớp mâm mài tuyệt đối'
    ],
    specs: {
      'Độ hạt (Grit)': '#30',
      'Loại đầu': 'Phân đoạn sắt mài phá',
      'Đường kính phân đoạn': '40x10x10 mm',
      'Tuổi thọ mài': '400 - 600 m2/bộ (9 đĩa)'
    },
    stock: 500,
    inStock: true,
    warehouse: ['Hà Nội', 'Đà Nẵng', 'TP. HCM']
  },
  {
    id: 'resin-pad-50',
    name: 'Đĩa đánh bóng sàn bê tông Resin Pad #50',
    category: 'dia-mai',
    subCategory: 'dia-danh-bong',
    brand: 'Khang Phúc Premium',
    price: 45000,
    agentPrice: 35000,
    image: 'resin bond concrete floor polishing pad diamond',
    description: 'Resin Pad Grit #50 làm từ hợp chất nhựa cao cấp liên kết bột kim cương mịn, chuyên trị các vết xước sâu từ đĩa kim loại mài phá, tạo tiền đề tạo bóng sàn bê tông.',
    features: [
      'Liên kết nhựa đàn hồi cao giúp mài mịn êm ái, hạn chế xước xoáy',
      'Lưng dán Velcro gai dính cực chắc chắn chống bay đĩa',
      'Độ dày đĩa nhựa 4mm cho tuổi thọ mài bền gấp 2 lần đĩa thường'
    ],
    specs: {
      'Độ hạt (Grit)': '#50',
      'Đường kính': '4 inch (100 mm)',
      'Độ dày nhựa': '4 mm',
      'Phương pháp': 'Mài ướt hoặc mài khô đều được'
    },
    stock: 1200,
    inStock: true,
    warehouse: ['Hà Nội', 'Đà Nẵng', 'TP. HCM']
  },

  // SECTION: SƠN & HÓA CHẤT
  {
    id: 'chat-tang-cung-lithium',
    name: 'Chất tăng cứng Lithium Densifier Khang Phúc LP-01',
    category: 'son-hoa-chat',
    subCategory: 'chat-tang-cung',
    brand: 'Khang Phúc Chemicals',
    price: 2200000,
    agentPrice: 1700000,
    image: 'liquid concrete hardener chemical jug',
    description: 'Chất tăng cứng silicate gốc Lithium cao cấp LP-01 phản ứng hóa học sâu trong mao quản bê tông tạo tinh thể C-S-H cực rắn chắc, gia tăng 300% độ chống trầy và kháng bụi.',
    features: [
      'Gốc Lithium phân tử siêu nhỏ thẩm thấu cực sâu (lên đến 8mm)',
      'Tự động lấp kín vết rạn chân chim, ngăn thấm nước dầu mỡ',
      'Chống rêu mốc, chống phát sinh bụi cát mịn vĩnh viễn',
      'Thân thiện với môi trường, hàm lượng VOC bằng 0'
    ],
    specs: {
      'Quy cách đóng gói': 'Thùng nhựa 20 Lít / Thùng sắt 200 Lít',
      'Định lượng thi công': '1 Lít cho 8 - 12 m2 (Tùy mác bê tông)',
      'Độ pH': '11.2 - 11.5',
      'Màu sắc': 'Chất lỏng trong suốt'
    },
    stock: 80,
    inStock: true,
    warehouse: ['Hà Nội', 'TP. HCM']
  },
  {
    id: 'son-epoxy-tu-san',
    name: 'Sơn Epoxy tự san phẳng Khang Phúc EP-SL',
    category: 'son-hoa-chat',
    subCategory: 'son-epoxy',
    brand: 'Khang Phúc Paint',
    price: 3500000,
    agentPrice: 2800000,
    image: 'epoxy resin floor paint self leveling chemical',
    description: 'Sơn phủ Epoxy tự cân bằng không chứa dung môi EP-SL tạo màng bảo vệ siêu phẳng, chịu lực tải của xe nâng hàng lên tới 5 tấn, kháng hóa chất tuyệt vời, chuyên dụng cho phòng sạch bệnh viện, nhà máy điện tử.',
    features: [
      'Khả năng tự san phẳng tuyệt đối tạo tính thẩm mỹ bóng loáng sang trọng',
      'Chịu ma sát kháng mài mòn và kháng trơn trượt hiệu quả',
      'Không dung môi bay hơi, an toàn cho sức khỏe và thực phẩm',
      'Kháng nước, dung dịch axit loãng, dầu nhớt hoàn hảo'
    ],
    specs: {
      'Tỷ lệ pha': 'Thành phần A (Sơn) : B (Đóng rắn) = 4 : 1',
      'Thời gian khô bề mặt': '6 - 8 giờ (ở 30 độ C)',
      'Thời gian sử dụng sau trộn': '30 phút',
      'Quy cách': 'Bộ 20kg (Sơn A 16kg + Đóng rắn B 4kg)'
    },
    stock: 45,
    inStock: true,
    warehouse: ['Hà Nội', 'TP. HCM']
  },

  // SECTION: TOOLS & PHỤ KIỆN
  {
    id: 'bay-rang-cua-inox',
    name: 'Bay răng cưa thi công Epoxy (Thép không gỉ)',
    category: 'dia-mai',
    subCategory: 'tools',
    brand: 'Khang Phúc Tools',
    price: 250000,
    agentPrice: 190000,
    image: 'notched trowel steel tool tile flooring',
    description: 'Bay răng cưa chuyên dùng gạt dàn sơn Epoxy tự phẳng giúp kiểm soát độ dày màng sơn đạt chuẩn 2mm, 3mm một cách đồng đều nhất.',
    features: [
      'Lưỡi bằng thép lò xo không gỉ có độ dẻo đàn hồi cực cao',
      'Tay cầm bằng gỗ chắc chắn, thiết kế công thái học giảm mỏi cổ tay',
      'Các khe răng cưa được gia công chính xác, sắc nét'
    ],
    specs: {
      'Chiều dài bay': '48 cm',
      'Chất liệu lưỡi': 'Thép không gỉ cao cấp',
      'Kích thước răng cưa': 'Răng chữ V 3mm x 3mm'
    },
    stock: 150,
    inStock: true,
    warehouse: ['Hà Nội', 'Đà Nẵng', 'TP. HCM']
  },
  {
    id: 'tape-safety-yellow',
    name: 'Băng keo dính cảnh báo phản quang màu vàng (Cuộn 50m)',
    category: 'phu-kien',
    subCategory: 'tools',
    brand: 'Khang Phúc Safety',
    price: 65000,
    agentPrice: 50000,
    image: 'caution stripe tape rolls yellow black warning',
    description: 'Băng dính dán sàn cảnh báo khu vực thi công Epoxy, có độ bám dính cao trên bề mặt bê tông và chịu mài mòn tốt.',
    features: [
      'Độ dính cực cao trên nền bê tông và thép',
      'Màu vàng đen tương phản rõ nét phản quang tốt',
      'Độ bền kéo giãn cơ học cao'
    ],
    specs: {
      'Chiều rộng': '4.8 cm',
      'Chiều dài': '50 m',
      'Trọng lượng': '0.25 kg'
    },
    stock: 800,
    inStock: true,
    warehouse: ['Hà Nội', 'TP. HCM']
  },
  {
    id: 'gloves-protective',
    name: 'Găng tay cao su bảo hộ chống hóa chất chuyên dụng',
    category: 'phu-kien',
    subCategory: 'tools',
    brand: 'Khang Phúc Safety',
    price: 35000,
    agentPrice: 28000,
    image: 'black heavy duty rubber protective gloves chemical resistant',
    description: 'Găng tay cao su nitrile dày dặn bảo vệ đôi tay thợ thi công khỏi hóa chất đóng rắn của sơn Epoxy và acid tăng cứng sàn.',
    features: [
      'Kháng hóa chất ăn mòn cực tốt đặc biệt là amine/epoxy',
      'Độ nhám lòng bàn tay bám giữ dụng cụ chắc chắn',
      'Đạt tiêu chuẩn an toàn lao động EU'
    ],
    specs: {
      'Chất liệu': 'Nitrile cao cấp',
      'Độ dày': '0.4 mm',
      'Trọng lượng': '0.06 kg'
    },
    stock: 1500,
    inStock: true,
    warehouse: ['Hà Nội', 'TP. HCM']
  },
  {
    id: 'roller-spike-epoxy',
    name: 'Rulo gai phá bọt khí Epoxy cán nhôm tiện lợi',
    category: 'phu-kien',
    subCategory: 'tools',
    brand: 'Khang Phúc Tools',
    price: 180000,
    agentPrice: 145000,
    image: 'spiked roller handle tool epoxy floor compound',
    description: 'Con lăn rulo gai chất liệu nhựa PP chống bám dính, chuyên dùng phá bọt khí sau khi đổ sơn Epoxy tự san phẳng.',
    features: [
      'Gai nhựa PP cao cấp dẻo chịu dung môi hữu cơ',
      'Đầu cốt nối cán dài linh hoạt bằng nhôm',
      'Giúp bề mặt sơn tự phẳng láng mịn không bị rỗ khí'
    ],
    specs: {
      'Chiều rộng con lăn': '25 cm',
      'Chiều cao gai': '1.1 cm',
      'Trọng lượng': '0.35 kg'
    },
    stock: 320,
    inStock: true,
    warehouse: ['Hà Nội', 'Đà Nẵng', 'TP. HCM']
  },
  {
    id: 'son-pu-crete',
    name: 'Sơn sàn Polyurethane Khang Phúc PU-Crete',
    category: 'son-hoa-chat',
    subCategory: 'son-pu',
    brand: 'Khang Phúc Paint',
    price: 4800000,
    agentPrice: 3850000,
    image: 'industrial polyurethane crete floor coating chemistry',
    description: 'Sơn sàn Polyurethane tự san phẳng chịu nhiệt và tải trọng siêu nặng PU-Crete, chuyên trị các khu vực sốc nhiệt âm sâu từ -40°C đến 120°C cho nhà máy thủy sản và chế biến.',
    features: [
      'Chịu sốc nhiệt cực lớn từ nước sôi và tủ đông công nghiệp',
      'Khả năng chịu tải trọng xe nâng và chống mài mòn hóa chất cực cao',
      'Bề mặt hoàn thiện liền mạch chống bám khuẩn nấm mốc',
      'Kháng các loại axit hữu cơ thực phẩm'
    ],
    specs: {
      'Độ dày thi công': '3mm - 6mm',
      'Nhiệt độ làm việc': '-40°C đến 120°C',
      'Quy cách đóng gói': 'Bộ 4 thành phần 20kg',
      'Định lượng tiêu chuẩn': '1.8 - 2.0 kg/m2/mm'
    },
    stock: 35,
    inStock: true,
    warehouse: ['Hà Nội', 'TP. HCM'],
    badge: 'NEW'
  },
  {
    id: 'cat-silica',
    name: 'Cát thạch anh sấy khô Khang Phúc Silica',
    category: 'phu-kien',
    subCategory: 'nguyen-lieu-phu-gia',
    brand: 'Khang Phúc Premium',
    price: 85000,
    agentPrice: 65000,
    image: 'dry silica quartz sand bags construction',
    description: 'Cát thạch anh sấy khô mác hạt mịn tiêu chuẩn chuyên dùng làm phụ gia rải tạo nhám chống trơn trượt cho sơn Epoxy hoặc trộn vữa epoxy bù phẳng.',
    features: [
      'Đã qua sấy khô loại bỏ độ ẩm tuyệt đối tránh phồng rộp sơn',
      'Cốt cát thạch anh độ cứng cao chịu mài mòn lực lớn',
      'Kích thước hạt đồng đều dễ thi công gạt phẳng'
    ],
    specs: {
      'Kích cỡ hạt': '0.1 - 0.3 mm (mịn) hoặc 0.3 - 0.6 mm (trung)',
      'Tỷ lệ SiO2': '> 98.5%',
      'Quy cách đóng gói': 'Bao 25 kg',
      'Độ ẩm': '< 0.5%'
    },
    stock: 2000,
    inStock: true,
    warehouse: ['Hà Nội', 'Đà Nẵng', 'TP. HCM'],
    badge: 'VỪA VỀ KHO'
  }
]

export const MOCK_COMBOS: Combo[] = [
  {
    id: 'combo-thi-cong-epoxy',
    name: 'Combo Thi Công Sơn Epoxy Nhà Xưởng Chuyên Nghiệp',
    description: 'Giải pháp trọn gói đồng bộ cho nhà thầu thi công sơn Epoxy hệ lăn 3 lớp cho diện tích từ 500 - 800m2. Gồm máy mài chuẩn bị bề mặt, máy hút bụi công suất lớn và hóa chất sơn nền chính hãng.',
    originalPrice: 42300000,
    price: 36500000,
    agentPrice: 30000000,
    savings: 5800000,
    image: 'epoxy floor application kit machinery paint roller',
    items: [
      { productName: 'Máy mài nền Kumisai KMS-250', quantity: 1 },
      { productName: 'Máy hút bụi Kumisai KMS-80', quantity: 1 },
      { productName: 'Đĩa mài sắt kim cương Grit #30', quantity: 18 },
      { productName: 'Sơn lót Epoxy Khang Phúc EP-Prime (Bộ 20kg)', quantity: 3 },
      { productName: 'Sơn phủ Epoxy hệ lăn Khang Phúc EP-Top (Bộ 20kg)', quantity: 6 }
    ],
    tags: ['Thi công Epoxy', 'Bán chạy nhất', 'Tiết kiệm 15%']
  },
  {
    id: 'combo-setup-xuong-mai',
    name: 'Combo Setup Xưởng Mài & Đánh Bóng Bê Tông Toàn Diện',
    description: 'Trang bị tối tân nhất cho các công ty bắt đầu dịch vụ mài tăng cứng bóng sàn, setup chuẩn mực 1 mài hành tinh lớn 3 pha + 1 hút bụi công nghiệp lốc xoáy + bộ đĩa mài phủ đầy đủ các grit.',
    originalPrice: 104600000,
    price: 89000000,
    agentPrice: 75000000,
    savings: 15600000,
    image: 'concrete floor polishing package grinder vacuum diamond pads',
    items: [
      { productName: 'Máy mài sàn công nghiệp ASL-600 T8', quantity: 1 },
      { productName: 'Máy hút bụi Kumisai KMS-80', quantity: 2 },
      { productName: 'Hóa chất tăng cứng Lithium LP-01 (Can 20L)', quantity: 5 },
      { productName: 'Bộ đĩa kim cương mài phá & Resin mài bóng (100 chiếc)', quantity: 1 }
    ],
    tags: ['Đánh bóng sàn', 'Setup xưởng', 'Khuyên dùng cho nhà thầu']
  }
]

export const MOCK_BLOGS: Blog[] = [
  {
    id: '1',
    title: 'Quy trình thi công sơn Epoxy tự san phẳng chuẩn kỹ thuật 2026',
    slug: 'quy-trinh-thi-cong-son-epoxy-tu-san-phang',
    category: 'huong-dan-thi-cong',
    summary: 'Chi tiết từng bước mài nền chuẩn bị bề mặt, sơn lót bám dính, gạt sơn đệm và đổ sơn Epoxy tự san phẳng dày 2mm phẳng như gương.',
    content: 'Thi công sơn Epoxy tự san phẳng (self-leveling) đòi hỏi tay nghề kỹ thuật cao cùng sự kết hợp chuẩn chỉ của các thiết bị máy mài sàn bê tông chuyên dụng để xử lý mác nền gồ ghề. Quy trình chuẩn gồm 5 bước chính: 1. Mài sàn tạo nhám chuẩn bị bề mặt bằng máy mài Kumisai KMS-250 lắp đĩa sắt mài phá Grit #30. 2. Hút sạch bụi bằng máy hút bụi KMS-80 để lớp sơn lót ngấm sâu. 3. Thi công lớp sơn lót tạo chân bám bền vững. 4. Tạo phẳng bù khuyết tật bằng vữa epoxy. 5. Thi công đổ sơn tự san phẳng bằng bàn gạt răng cưa inox Khang Phúc và lăn rulo phá bọt khí liên tục.',
    image: 'professional applying self leveling epoxy paint on factory floor',
    date: '2026-05-18',
    author: 'Kỹ sư Nguyễn Văn Khang'
  },
  {
    id: '2',
    title: 'Nên chọn hóa chất tăng cứng Sodium hay Lithium cho kho logistics?',
    slug: 'so-sanh-hoa-chat-tang-cung-sodium-va-lithium',
    category: 'so-sanh-vat-lieu',
    summary: 'Phân tích điểm khác biệt về cấu trúc hạt, độ thẩm thấu, tuổi thọ bóng và chi phí thi công của 2 loại liquid densifier phổ biến nhất hiện nay.',
    content: 'Hóa chất tăng cứng Sodium silicate có giá thành rẻ nhưng dễ bị kết tủa muối trắng nếu thi công không cẩn thận và kích thước phân tử lớn khó len lỏi vào các mác bê tông cao. Ngược lại, Lithium Densifier Khang Phúc LP-01 sở hữu các hạt ion lithium siêu nhỏ, thẩm thấu trực tiếp và phản ứng 100% với canxi tự do trong bê tông, đem lại tuổi thọ kháng mài mòn vĩnh viễn, chống bám bụi và hoàn toàn không bị rêu mốc bạc màu.',
    image: 'warehouse worker concrete floor shine logistics center',
    date: '2026-05-15',
    author: 'Chuyên gia Lê Hoàng Phúc'
  }
]
