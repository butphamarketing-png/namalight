window.NOMA = window.NOMA || {};

NOMA.categories = [
  { id: 'all', label: 'Tất cả sản phẩm' },
  { id: 'duong-aio', label: 'Đèn đường liền thể' },
  { id: 'duong-split', label: 'Đèn đường rời thể' },
  { id: 'pha', label: 'Đèn pha' },
  { id: 'vuon', label: 'Đèn sân vườn' },
  { id: 'cong', label: 'Đèn cổng & tường' },
  { id: 'cam-bien', label: 'Đèn cảm biến PIR' },
];

NOMA.formLabels = {
  aio: 'Liền thể (All-in-One)',
  split: 'Rời thể (tấm pin rời)',
};

function spec(p) {
  return {
    sku: p.sku,
    cat: p.cat,
    form: p.form,
    name: p.name,
    power: p.power,
    price: p.price,
    blurb: p.blurb,
    use: p.use,
    panel: p.panel,
    battery: p.battery,
    charge: p.charge || '4–6 giờ nắng',
    runtime: p.runtime,
    ip: p.ip || 'IP65',
    cct: p.cct || '6500K',
    led: p.led,
    life: p.life || '>50.000 giờ',
    control: p.control || 'Cảm biến sáng tự bật/tắt + remote',
    height: p.height,
    sizeLamp: p.sizeLamp,
    sizePanel: p.sizePanel,
    warranty: p.warranty || '24 tháng',
  };
}

NOMA.products = [
  spec({
    sku: 'NL-ST60', cat: 'duong-aio', form: 'aio',
    name: 'Đèn đường liền thể NL-ST60', power: '60W', price: 890000,
    blurb: 'All-in-One dân dụng — hẻm, lối đi, hàng rào.',
    use: 'Hẻm dân cư, lối đi nội bộ, cổng xóm. Chiều cao lắp 4–5 m.',
    panel: 'Mono 6V / 20W', battery: 'LiFePO4 3.2V / 18.000mAh',
    runtime: '10–12 giờ', led: 'SMD 3030', height: '4–5 m',
    sizeLamp: '512 × 234 × 40 mm', sizePanel: 'Tích hợp thân đèn',
  }),
  spec({
    sku: 'NL-ST100', cat: 'duong-aio', form: 'aio',
    name: 'Đèn đường liền thể NL-ST100', power: '100W', price: 1290000,
    blurb: 'Đường liên thôn, bãi xe, khuôn viên nhà xưởng.',
    use: 'Đường liên thôn, bãi đỗ xe, khuôn viên. Lắp 5–6 m, khoảng cách 18–22 m.',
    panel: 'Mono 6V / 25W', battery: 'LiFePO4 3.2V / 24.000mAh (4 cell)',
    runtime: '10–12 giờ', led: 'SMD 3030', height: '5–6 m',
    sizeLamp: '612 × 234 × 50 mm', sizePanel: 'Tích hợp thân đèn', ip: 'IP66',
  }),
  spec({
    sku: 'NL-ST150', cat: 'duong-aio', form: 'aio',
    name: 'Đèn đường liền thể NL-ST150', power: '150W', price: 1650000,
    blurb: 'Đường nội bộ rộng, khu công nghiệp nhỏ.',
    use: 'Đường nội bộ, cổng KCN, sân trường. Lắp 6–7 m.',
    panel: 'Mono 6V / 30W', battery: 'LiFePO4 3.2V / 36.000mAh (6 cell)',
    runtime: '12–14 giờ', led: 'SMD 3030', height: '6–7 m',
    sizeLamp: '220 × 50 × 500 mm', sizePanel: 'Tích hợp thân đèn', ip: 'IP66',
  }),
  spec({
    sku: 'NL-ST200', cat: 'duong-aio', form: 'aio',
    name: 'Đèn đường liền thể NL-ST200', power: '200W', price: 1890000,
    blurb: 'Tuyến đường nội bộ, khuôn viên nhà xưởng lớn.',
    use: 'Đường nội bộ rộng, nhà xưởng, bãi container. Lắp 7–8 m.',
    panel: 'Mono 6V / 40W', battery: 'LiFePO4 3.2V / 42.000mAh (7 cell)',
    runtime: '12–14 giờ', led: 'SMD 5054', height: '7–8 m',
    sizeLamp: '712 × 280 × 55 mm', sizePanel: 'Tích hợp thân đèn', ip: 'IP66',
  }),
  spec({
    sku: 'NL-SP120', cat: 'duong-split', form: 'split',
    name: 'Đèn đường rời thể NL-SP120', power: '120W', price: 2150000,
    blurb: 'Tấm pin rời — tối ưu hướng nắng, thân đèn trên tay cần.',
    use: 'Đường nông thôn, khu dân cư. Pin rời dễ hướng nắng, đèn trên cột 6–7 m.',
    panel: 'Mono 18V / 60W', battery: 'LiFePO4 12.8V / 18Ah (230Wh)',
    runtime: '12–15 giờ', led: 'Bridgelux 3030', height: '6–7 m',
    sizeLamp: '600 × 245 × 70 mm', sizePanel: '670 × 445 × 25 mm', ip: 'IP65',
  }),
  spec({
    sku: 'NL-SP200', cat: 'duong-split', form: 'split',
    name: 'Đèn đường rời thể NL-SP200', power: '200W', price: 3280000,
    blurb: 'Công trình: quang thông cao, pin Wh lớn, MPPT.',
    use: 'Đường giao thông, KCN, bệnh viện, bãi rộng. Cột 8–9 m, khoảng cách 25–30 m.',
    panel: 'Mono 18V / 90Wp', battery: 'LiFePO4 12.8V / 40Ah (512Wh)',
    runtime: '12–15 giờ / mưa 2–3 đêm', led: 'Bridgelux 3030 ~10.000 lm', height: '8–9 m',
    sizeLamp: '650 × 300 × 70 mm', sizePanel: '890 × 670 × 30 mm', ip: 'IP65',
    control: 'MPPT + cảm biến sáng + remote chỉnh công suất',
  }),
  spec({
    sku: 'NL-FL100', cat: 'pha', form: 'split',
    name: 'Đèn pha NLMT NL-FL100', power: '100W', price: 980000,
    blurb: 'Pha dân dụng — gara, sân nhỏ, mặt tiền nhà.',
    use: 'Gara, sân nhỏ, ban công lớn. Tấm pin rời, đèn gắn tường.',
    panel: 'Mono 6V / 25W', battery: 'LiFePO4 3.2V / 30.000mAh (5 cell)',
    runtime: '10–12 giờ', led: '225 LED', height: 'Gắn tường 2.5–4 m',
    sizeLamp: '290 × 260 × 90 mm', sizePanel: '530 × 350 × 17 mm', ip: 'IP67',
  }),
  spec({
    sku: 'NL-FL200', cat: 'pha', form: 'split',
    name: 'Đèn pha NLMT NL-FL200', power: '200W', price: 1580000,
    blurb: 'Sân sau, kho bãi, cổng công ty.',
    use: 'Kho bãi, cổng công ty, sân sau. Remote + hẹn giờ.',
    panel: 'Mono 6V / 30W', battery: 'LiFePO4 3.2V / 36.000mAh (6 cell)',
    runtime: '10–12 giờ', led: '648 LED', height: 'Gắn tường / trụ 3–5 m',
    sizeLamp: '335 × 275 × 75 mm', sizePanel: '600 × 350 × 17 mm', ip: 'IP67',
    control: 'Tự bật tối / tắt sáng + remote + hẹn giờ',
  }),
  spec({
    sku: 'NL-FL300', cat: 'pha', form: 'split',
    name: 'Đèn pha NLMT NL-FL300', power: '300W', price: 1980000,
    blurb: 'Bãi xe, sân bóng, mặt tiền rộng.',
    use: 'Bãi xe, sân thể thao nhỏ, mặt tiền showroom.',
    panel: 'Mono 6V / 35W', battery: 'LiFePO4 3.2V / 42.000mAh (7 cell)',
    runtime: '10–12 giờ', led: '780 LED', height: '4–6 m',
    sizeLamp: '365 × 295 × 95 mm', sizePanel: '670 × 350 × 20 mm', ip: 'IP67',
  }),
  spec({
    sku: 'NL-FL400', cat: 'pha', form: 'split',
    name: 'Đèn pha NLMT NL-FL400', power: '400W', price: 2450000,
    blurb: 'Sân rộng, nhà xưởng, chiếu xa.',
    use: 'Nhà xưởng hở, sân vận động mini, bãi container.',
    panel: 'Mono 6V / 50W', battery: 'LiFePO4 3.2V / 54.000mAh (9 cell)',
    runtime: '10–12 giờ', led: 'SMD 5054', height: '5–7 m',
    sizeLamp: '400 × 325 × 90 mm', sizePanel: '670 × 445 × 23 mm', ip: 'IP67',
  }),
  spec({
    sku: 'NL-GD40', cat: 'vuon', form: 'aio',
    name: 'Đèn sân vườn NL-GD40', power: '40W', price: 620000,
    blurb: 'Lối đi sân vườn, tiểu cảnh — ánh sáng ấm tuỳ chọn.',
    use: 'Lối đi sân, tiểu cảnh, hàng rào thấp. Cột 0.6–1.2 m.',
    panel: 'Mono 5V / 8W', battery: 'LiFePO4 3.2V / 6.000mAh',
    runtime: '8–10 giờ', led: 'SMD 2835', cct: '3000K / 6500K', height: '0.6–1.2 m',
    sizeLamp: 'Ø180 × 600 mm', sizePanel: 'Tích hợp nón đèn', ip: 'IP65',
  }),
  spec({
    sku: 'NL-GD60', cat: 'vuon', form: 'aio',
    name: 'Đèn sân vườn NL-GD60', power: '60W', price: 890000,
    blurb: 'Sân nhà phố, biệt thự — cột thấp, cảm biến sáng.',
    use: 'Sân nhà phố, biệt thự. Cột 1.5–2 m.',
    panel: 'Mono 6V / 12W', battery: 'LiFePO4 3.2V / 12.000mAh',
    runtime: '10–12 giờ', led: 'SMD 3030', cct: '3000K', height: '1.5–2 m',
    sizeLamp: 'Ø220 × 400 mm', sizePanel: 'Tích hợp', ip: 'IP65',
  }),
  spec({
    sku: 'NL-PL90', cat: 'vuon', form: 'aio',
    name: 'Đèn trụ sân NL-PL90', power: '90W', price: 1150000,
    blurb: 'Trụ nhôm, pin tích hợp — sân trước biệt thự.',
    use: 'Sân trước, lối vào biệt thự. Trụ 2–2.5 m.',
    panel: 'Mono 6V / 18W', battery: 'LiFePO4 3.2V / 18.000mAh',
    runtime: '10–12 giờ', led: 'SMD 3030', height: '2–2.5 m',
    sizeLamp: 'Trụ Ø80, chao 280 mm', sizePanel: 'Tích hợp nắp trụ', ip: 'IP65',
  }),
  spec({
    sku: 'NL-GT120', cat: 'cong', form: 'aio',
    name: 'Đèn cổng 2 đầu NL-GT120', power: '120W', price: 1350000,
    blurb: 'Hai hướng chiếu — cổng nhà, tường rào.',
    use: 'Cổng nhà, tường rào hai hướng. Gắn trụ cổng.',
    panel: 'Mono 6V / 20W', battery: 'LiFePO4 3.2V / 24.000mAh',
    runtime: '10–12 giờ', led: '2 đầu SMD', height: 'Gắn trụ cổng 2–3 m',
    sizeLamp: '600 × 160 × 55 mm', sizePanel: 'Tích hợp mặt trên', ip: 'IP65',
    control: 'Cảm biến sáng + remote 2 đầu độc lập',
  }),
  spec({
    sku: 'NL-WL50', cat: 'cong', form: 'aio',
    name: 'Đèn tường NL-WL50', power: '50W', price: 620000,
    blurb: 'Hành lang, tường sân — gọn, chống mưa.',
    use: 'Hành lang, tường sân, mái hiên. Gắn tường.',
    panel: 'Mono 5V / 8W', battery: 'LiFePO4 3.2V / 8.000mAh',
    runtime: '8–10 giờ', led: 'SMD 2835', height: 'Gắn tường 2–3 m',
    sizeLamp: '280 × 160 × 45 mm', sizePanel: 'Mặt lưng đèn', ip: 'IP65',
  }),
  spec({
    sku: 'NL-BC40', cat: 'cong', form: 'aio',
    name: 'Đèn ban công NL-BC40', power: '40W', price: 650000,
    blurb: 'Siêu mỏng — ban công chung cư, mái hiên.',
    use: 'Ban công chung cư, mái hiên hẹp.',
    panel: 'Mono 5V / 6W', battery: 'LiFePO4 3.2V / 6.000mAh',
    runtime: '8–10 giờ', led: 'SMD 2835', height: 'Gắn lan can / tường',
    sizeLamp: '320 × 90 × 28 mm', sizePanel: 'Mặt trên siêu mỏng', ip: 'IP65',
  }),
  spec({
    sku: 'NL-PIR80', cat: 'cam-bien', form: 'aio',
    name: 'Đèn cảm biến PIR NL-PIR80', power: '80W', price: 1120000,
    blurb: 'Sáng khi có người — cổng, lối đi đêm, tiết kiệm pin.',
    use: 'Cổng, lối đi đêm, kho. PIR + chế độ luôn sáng 30%.',
    panel: 'Mono 6V / 15W', battery: 'LiFePO4 3.2V / 18.000mAh',
    runtime: 'Chế độ PIR 3–5 đêm; luôn sáng 8–10 giờ', led: 'SMD 3030 + PIR',
    height: 'Gắn tường 2.2–3.5 m',
    sizeLamp: '340 × 180 × 55 mm', sizePanel: 'Tích hợp', ip: 'IP65',
    control: 'PIR + cảm biến sáng + remote (luôn sáng / cảm biến / hẹn giờ)',
  }),
].map(function (p) {
  p.id = p.sku.toLowerCase();
  p.slug = p.id;
  return p;
});

NOMA.groups = [
  { slug: 'den-duong-nang-luong-mat-troi', label: 'Đèn đường năng lượng mặt trời', cats: ['duong-aio', 'duong-split'], img: 'assets/noma-page-street.png', lead: 'Chiếu sáng đường phố, đường nội bộ và khu dân cư.' },
  { slug: 'den-pha-nang-luong-mat-troi', label: 'Đèn pha năng lượng mặt trời', cats: ['pha'], img: 'assets/noma-flood.png', lead: 'Chiếu sáng mạnh cho sân bãi, nhà xưởng và khuôn viên.' },
  { slug: 'den-san-vuon-nang-luong-mat-troi', label: 'Đèn sân vườn năng lượng mặt trời', cats: ['vuon'], img: 'assets/noma-garden.png', lead: 'Điểm nhấn ánh sáng cho lối đi và cảnh quan.' },
  { slug: 'den-dan-dung-nang-luong-mat-troi', label: 'Đèn dân dụng năng lượng mặt trời', cats: ['cong', 'cam-bien'], img: 'assets/noma-page-home.png', lead: 'Cổng, tường, ban công và nhu cầu gia đình.' }
];

NOMA.CAT_IMG = {
  'duong-aio': 'assets/noma-street-aio.png',
  'duong-split': 'assets/noma-street-split.png',
  'pha': 'assets/noma-flood.png',
  'vuon': 'assets/noma-garden.png',
  'cong': 'assets/noma-gate.png',
  'cam-bien': 'assets/noma-pir.png'
};

NOMA.root = function () {
  return (document.body && document.body.getAttribute('data-root')) || '';
};

NOMA.imgFor = function (p) {
  return NOMA.CAT_IMG[p.cat] || 'assets/noma-street-aio.png';
};

NOMA.groupOf = function (cat) {
  var g = NOMA.groups.filter(function (x) { return x.cats.indexOf(cat) !== -1; })[0];
  return g || NOMA.groups[0];
};

NOMA.productHref = function (p) {
  return NOMA.root() + 'san-pham/' + encodeURIComponent(p.slug) + '/';
};

NOMA.groupHref = function (g) {
  return NOMA.root() + 'san-pham/' + g.slug + '/';
};

NOMA.catLabel = function (id) {
  var c = NOMA.categories.filter(function (x) { return x.id === id; })[0];
  return c ? c.label : id;
};

NOMA.byId = function (id) {
  id = (id || '').toLowerCase();
  return NOMA.products.filter(function (p) { return p.id === id || p.sku.toLowerCase() === id; })[0];
};

NOMA.formatPrice = function (n) {
  return n.toLocaleString('vi-VN') + 'đ';
};

NOMA.esc = function (s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

NOMA.cardHtml = function (p) {
  var e = NOMA.esc;
  var href = NOMA.productHref(p);
  var img = NOMA.root() + NOMA.imgFor(p);
  return (
    '<article class="product product--photo">' +
      '<a class="product__visual" href="' + href + '">' +
        '<img src="' + e(img) + '" alt="' + e(p.name) + '" loading="lazy" />' +
      '</a>' +
      '<div class="product__body">' +
        '<p class="product__meta"><span>' + e(NOMA.catLabel(p.cat)) + '</span></p>' +
        '<h3><a href="' + href + '">' + e(p.name) + '</a></h3>' +
        '<p>' + e(p.blurb) + '</p>' +
        '<div class="product__row">' +
          '<a class="btn btn--ghost" href="' + href + '">Xem chi tiết</a>' +
        '</div>' +
      '</div>' +
    '</article>'
  );
};
