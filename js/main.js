(function () {
  if (!window.NOMA) return;
  var e = NOMA.esc;
  var R = NOMA.root();

  function vnPhone(v) {
    var d = String(v || '').replace(/\D/g, '');
    if (d.indexOf('84') === 0) d = '0' + d.slice(2);
    return /^0\d{9}$/.test(d);
  }
  function vnDate(v) {
    v = String(v || '').trim();
    if (!v) return true;
    var m = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!m) return false;
    var d = Number(m[1]), mo = Number(m[2]), y = Number(m[3]);
    if (mo < 1 || mo > 12 || d < 1 || d > 31 || y < 2020 || y > 2100) return false;
    var dt = new Date(y, mo - 1, d);
    return dt.getFullYear() === y && dt.getMonth() === mo - 1 && dt.getDate() === d;
  }
  function vnEmail(v) {
    v = String(v || '').trim();
    if (!v) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }
  function clearMarks(form) {
    form.querySelectorAll('label.is-invalid').forEach(function (el) { el.classList.remove('is-invalid'); });
  }
  function mark(input) {
    var lab = input.closest('label');
    if (lab) lab.classList.add('is-invalid');
  }
  function bindLeadForm(form, errId, okId, linesFrom) {
    if (!form) return;
    var err = document.getElementById(errId);
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      clearMarks(form);
      if (err) { err.classList.remove('is-on'); err.textContent = ''; }
      var name = form.querySelector('[name="name"]');
      var phone = form.querySelector('[name="phone"]');
      var email = form.querySelector('[name="email"]');
      var date = form.querySelector('[name="date"]');
      var note = form.querySelector('[name="note"]');
      var msgs = [];
      if (name && !String(name.value).trim()) { msgs.push('Nhập họ và tên.'); mark(name); }
      if (phone && !vnPhone(phone.value)) { msgs.push('Số điện thoại gồm 10 số, bắt đầu bằng 0.'); mark(phone); }
      if (email && !vnEmail(email.value)) { msgs.push('Email chưa đúng định dạng.'); mark(email); }
      if (date && !vnDate(date.value)) { msgs.push('Ngày hẹn theo dạng dd/mm/yyyy.'); mark(date); }
      if (note && note.hasAttribute('required') && !String(note.value).trim()) { msgs.push('Nhập nội dung cần tư vấn.'); mark(note); }
      if (msgs.length) {
        if (err) { err.textContent = msgs[0]; err.classList.add('is-on'); }
        var first = form.querySelector('label.is-invalid input, label.is-invalid textarea, label.is-invalid select, input.is-invalid, input');
        if (first) first.focus();
        return;
      }
      try {
        var leads = JSON.parse(localStorage.getItem('noma-cms-leads') || '[]');
        leads.unshift({
          id: String(Date.now()),
          at: Date.now(),
          name: name ? name.value : '',
          phone: phone ? phone.value : '',
          email: email ? email.value : '',
          need: (form.querySelector('[name="need"]') || {}).value || '',
          note: note ? note.value : '',
          source: form.id || 'form'
        });
        localStorage.setItem('noma-cms-leads', JSON.stringify(leads.slice(0, 300)));
      } catch (e) {}
      var lines = linesFrom(new FormData(form));
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(lines.join('\n')).catch(function () {});
      }
      var ok = document.getElementById(okId);
      if (ok) {
        ok.hidden = false;
        ok.textContent = 'Đã tiếp nhận yêu cầu. Nội dung đã sao chép — cửa sổ Zalo Minh Trọng sẽ mở để bạn gửi tin.';
      }
      window.open('https://zalo.me/0974169141', '_blank', 'noopener');
    });
  }

  bindLeadForm(document.getElementById('book-form'), 'book-form-err', 'book-ok', function (fd) {
    return [
      'Đặt lịch tư vấn NOMA LIGHT',
      'Họ tên: ' + (fd.get('name') || ''),
      'Điện thoại: ' + (fd.get('phone') || ''),
      'Email: ' + (fd.get('email') || '—'),
      'Nhu cầu: ' + (fd.get('need') || '—'),
      'Ghi chú: ' + (fd.get('note') || '—')
    ];
  });

  bindLeadForm(document.getElementById('contact-form'), 'contact-form-err', 'contact-ok', function (fd) {
    return [
      'Đặt lịch tư vấn NOMA LIGHT',
      'Họ tên: ' + (fd.get('name') || ''),
      'Điện thoại: ' + (fd.get('phone') || ''),
      'Email: ' + (fd.get('email') || '—'),
      'Nhu cầu: ' + (fd.get('need') || '—'),
      'Ghi chú: ' + (fd.get('note') || '—')
    ];
  });

  var root = document.getElementById('product-root');
  if (root) {
    var id = root.getAttribute('data-slug') || new URLSearchParams(location.search).get('id');
    if (!id) {
      var m = location.pathname.match(/\/san-pham\/([^/]+)\//);
      if (m) id = decodeURIComponent(m[1]);
    }
    var p = NOMA.byId(id);
    if (!p || ['den-duong-nang-luong-mat-troi', 'den-pha-nang-luong-mat-troi', 'den-san-vuon-nang-luong-mat-troi', 'den-dan-dung-nang-luong-mat-troi'].indexOf(id) !== -1) {
      /* category pages handled separately */
    }
    if (root.getAttribute('data-mode') === 'product' || (p && !root.getAttribute('data-mode'))) {
      if (!p) {
        root.innerHTML = '<p class="lede">Không tìm thấy sản phẩm. <a href="' + R + 'san-pham/">Quay lại sản phẩm</a>.</p>';
        return;
      }
      var g = NOMA.groupOf(p.cat);
      document.title = p.name + ' | NOMA LIGHT';
      var related = NOMA.products.filter(function (x) { return x.cat === p.cat && x.id !== p.id; }).slice(0, 4);
      var specRows = [
        ['Mã sản phẩm', p.sku],
        ['Nhóm', g.label],
        ['Kiểu lắp', NOMA.formLabels[p.form] || p.form || '—'],
        ['Tình trạng', 'Liên hệ Minh Trọng để chốt tồn kho'],
        ['Thương hiệu', 'NOMA LIGHT'],
        ['Ứng dụng', p.use],
        ['Điều khiển', p.control],
        ['Độ cao / vị trí', p.height],
        ['Bảo hành', 'Theo catalogue / phiếu xuất']
      ];
      var specHtml = '<table class="shop-specs">' + specRows.map(function (row) {
        return '<tr><th>' + e(row[0]) + '</th><td>' + e(row[1] || '—') + '</td></tr>';
      }).join('') + '</table>';
      root.innerHTML =
        '<div class="shop-pdp">' +
        '<div class="shop-pdp__main">' +
        '<p class="crumb"><a href="' + R + 'index.html">Trang chủ</a> / <a href="' + R + 'san-pham/">Sản phẩm</a> / <a href="' + NOMA.groupHref(g) + '">' + e(g.label) + '</a> / ' + e(p.name) + '</p>' +
        '<div class="pd">' +
          '<div class="pd__visual">' +
            '<img src="' + R + NOMA.imgFor(p) + '" alt="' + e(p.name) + '" />' +
            '<div class="pd__thumbs">' +
              '<img src="' + R + NOMA.imgFor(p) + '" alt="" />' +
              related.slice(0, 2).map(function (x) { return '<img src="' + R + NOMA.imgFor(x) + '" alt="" />'; }).join('') +
            '</div>' +
          '</div>' +
          '<div class="pd__info">' +
            '<p class="shop-kicker">' + e(g.label) + '</p>' +
            '<h1>' + e(p.name) + '</h1>' +
            '<p class="shop-price">Liên hệ</p>' +
            '<ul class="shop-meta">' +
              '<li>Mã sản phẩm: <strong>' + e(p.sku) + '</strong></li>' +
              '<li>Thương hiệu: <strong>NOMA LIGHT</strong></li>' +
              '<li>Tình trạng: <strong>Liên hệ Minh Trọng</strong></li>' +
            '</ul>' +
            '<p class="lede">' + e(p.blurb || p.use) + '</p>' +
            '<p class="shop-qty">Số lượng <span>1</span> <small>Chốt số lượng khi báo giá</small></p>' +
            '<div class="hero__actions">' +
            '<a class="btn btn--primary shop-buy" href="https://zalo.me/0974169141" target="_blank" rel="noopener">Liên hệ báo giá</a>' +
              '<a class="btn btn--ghost" href="tel:0974169141">0974 169 141</a>' +
              '<a class="btn btn--ghost" href="' + R + 'catalogue/">Xem Catalogue</a>' +
            '</div>' +
            '<div class="shop-ask">' +
              '<p>Tư vấn nhanh qua Zalo</p>' +
              '<form id="pdp-ask">' +
                '<p class="form-err" id="pdp-ask-err" role="alert"></p>' +
                '<input name="name" type="text" required placeholder="Họ và tên *" autocomplete="name" />' +
                '<input name="phone" type="tel" required placeholder="Số điện thoại *" autocomplete="tel" />' +
                '<input name="note" type="hidden" value="' + e(p.sku) + '" />' +
                '<button type="submit">Tư vấn ngay</button>' +
              '</form>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<h2 class="pd__h">Thông số kỹ thuật</h2>' +
        specHtml +
        '<p class="spec-note">Đối chiếu mã in trên catalogue 16 trang. Công suất / pin / IP chốt theo phiếu — website không niêm yết số liệu mẫu khác hãng.</p>' +
        '<h2 class="pd__h">Ứng dụng</h2>' +
        '<p>' + e(p.use) + '</p>' +
        '<h2 class="pd__h">Bộ sản phẩm khi giao</h2>' +
        '<ul><li>Thân đèn ' + e(p.name) + '</li><li>Phụ kiện lắp (theo kiểu liền thể / rời thể)</li><li>Hướng dẫn sử dụng</li><li>Phiếu bảo hành theo lô</li></ul>' +
        '</div>' +
        '<aside>' +
          '<div class="shop-sidebox"><h3>NOMA LIGHT</h3>' +
            '<p><strong>Hỗ trợ toàn quốc</strong><br />Gọi / Zalo chốt mã lắp</p>' +
            '<p><strong>Đổi trả</strong><br />Theo phiếu xuất khi giao sai / lỗi</p>' +
            '<p><strong>Bảo hành</strong><br />Theo thời hạn trên catalogue</p>' +
            '<p><strong>Cam kết</strong><br />Tư vấn đúng nhóm đèn</p>' +
          '</div>' +
          '<div class="shop-sidebox"><h3>Thông tin mua hàng</h3>' +
            '<p><a href="tel:0974169141">Hotline: 0974 169 141</a>' +
            '<a href="' + R + 'chinh-sach-bao-mat/">Chính sách bảo mật</a>' +
            '<a href="' + R + 'chinh-sach-giao-hang/">Vận chuyển và giao nhận</a>' +
            '<a href="' + R + 'chinh-sach-doi-tra/">Chính sách đổi trả</a>' +
            '<a href="' + R + 'chinh-sach-thanh-toan/">Chính sách thanh toán</a>' +
            '<a href="' + R + 'chinh-sach-bao-hanh/">Chính sách bảo hành</a></p>' +
          '</div>' +
        '</aside></div>' +
        (related.length ? '<h2 class="pd__h">Sản phẩm liên quan</h2><div class="grid-products">' + related.map(NOMA.cardHtml).join('') + '</div>' : '');
      bindLeadForm(document.getElementById('pdp-ask'), 'pdp-ask-err', null, function (fd) {
        return ['NOMA LIGHT — tư vấn ' + p.sku, 'Họ tên: ' + (fd.get('name') || ''), 'SĐT: ' + (fd.get('phone') || '')];
      });
    }
  }

  var catPage = document.getElementById('cat-products');
  if (catPage) {
    var slug = catPage.getAttribute('data-group');
    var g = NOMA.groups.filter(function (x) { return x.slug === slug; })[0];
    if (g) {
      var list = NOMA.products.filter(function (p) { return g.cats.indexOf(p.cat) !== -1; });
      catPage.innerHTML = list.map(NOMA.cardHtml).join('') || '<p class="lede">Danh mục đang được cập nhật.</p>';
      var host = catPage.parentNode;
      if (host && !host.classList.contains('shop-catpage')) {
        var layout = document.createElement('div');
        layout.className = 'shop-catpage';
        var aside = document.createElement('aside');
        aside.className = 'shop-aside';
        aside.innerHTML = '<p class="shop-aside__title">Danh mục sản phẩm</p>' + NOMA.groups.map(function (x) {
          return '<a href="' + NOMA.groupHref(x) + '"' + (x.slug === slug ? ' class="is-on"' : '') + '>' + e(x.label) + '</a>';
        }).join('') + '<a href="' + R + 'san-pham/">Tất cả sản phẩm</a>';
        var mainCol = document.createElement('div');
        var banner = document.createElement('div');
        banner.className = 'shop-catbanners';
        banner.innerHTML =
          '<div class="shop-catbanner"><div><h2>' + e(g.label).toUpperCase() + '</h2><p>' + e(g.lead) + '</p></div><img src="' + R + g.img + '" alt="" /></div>' +
          '<div class="shop-catbanner shop-catbanner--cta"><div><h2>CATALOGUE 8 TRANG</h2><p>Đối chiếu mã NOMA LIGHT, gọi Minh Trọng 0974 169 141 hoặc Zalo để chốt lắp.</p></div><img src="' + R + 'assets/noma-prod-street.png" alt="" /></div>';
        var tabs = document.createElement('div');
        tabs.className = 'shop-tabs';
        tabs.innerHTML = list.map(function (p) {
          return '<a href="' + NOMA.productHref(p) + '">' + e(p.sku) + '</a>';
        }).join('');
        host.insertBefore(layout, catPage);
        layout.appendChild(aside);
        layout.appendChild(mainCol);
        mainCol.appendChild(banner);
        mainCol.appendChild(tabs);
        mainCol.appendChild(catPage);
        catPage.classList.add('shop-grid', 'grid-products');
      }
    }
  }

  var grid = document.getElementById('catalog-grid');
  if (grid) {
    var list = NOMA.products;
    var q = (new URLSearchParams(location.search).get('q') || '').trim().toLowerCase();
    var cat = new URLSearchParams(location.search).get('cat') || 'all';
    if (cat !== 'all') list = list.filter(function (p) { return p.cat === cat; });
    if (q) {
      list = list.filter(function (p) {
        return (p.name + ' ' + p.blurb + ' ' + p.use).toLowerCase().indexOf(q) !== -1;
      });
    }
    var count = document.getElementById('count');
    if (count) count.textContent = list.length + ' sản phẩm';
    grid.innerHTML = list.length ? list.map(NOMA.cardHtml).join('') : '<p class="lede">Không có sản phẩm khớp.</p>';
  }

  var projEl = document.getElementById('project-detail');
  if (projEl && NOMA.projectBySlug) {
    var pr = NOMA.projectBySlug(projEl.getAttribute('data-slug'));
    if (!pr) {
      projEl.innerHTML = '<p class="lede">Không tìm thấy mục này. <a href="' + R + 'du-an/">Về dự án</a></p>';
    } else {
      document.title = pr.title + ' | NOMA LIGHT';
      var gals = (pr.gallery || [pr.img]).map(function (src) {
        return '<img src="' + R + src + '" alt="" />';
      }).join('');
      var prodLinks = NOMA.products.filter(function (x) { return x.cat === pr.cat; }).slice(0, 3).map(NOMA.cardHtml).join('');
      projEl.innerHTML =
        '<p class="crumb"><a href="' + R + 'index.html">Trang chủ</a> / <a href="' + R + 'du-an/">Dự án</a> / ' + e(pr.title) + '</p>' +
        '<h1>' + e(pr.title) + '</h1>' +
        '<p class="lede">' + e(pr.place) + ' · ' + e(pr.type) + ' · ' + e(pr.lamp) + '</p>' +
        '<div class="pd-apps"><img src="' + R + pr.img + '" alt="' + e(pr.title) + '" /></div>' +
        '<h2>Tổng quan</h2><p>' + e(pr.summary) + '</p>' +
        '<h2>Giải pháp chiếu sáng</h2><p>' + e(pr.solution) + '</p>' +
        '<h2>Hình ảnh</h2><div class="pd-apps" style="display:grid;gap:12px">' + gals + '</div>' +
        '<p class="lede">Hiệu quả công trình sẽ được bổ sung khi có dữ liệu thực tế.</p>' +
        (prodLinks ? '<h2>Sản phẩm liên quan</h2><div class="grid-products">' + prodLinks + '</div>' : '') +
        '<div class="cta-band"><h2>Bạn đang có công trình tương tự?</h2><a class="btn btn--primary" href="' + R + 'dat-lich/">Đặt lịch tư vấn</a></div>';
    }
  }

  var artEl = document.getElementById('article-detail');
  if (artEl && NOMA.articleBySlug) {
    var ar = NOMA.articleBySlug(artEl.getAttribute('data-slug'));
    if (!ar) {
      artEl.innerHTML = '<p class="lede">Không tìm thấy bài viết. <a href="' + R + 'tin-tuc/">Về tin tức</a></p>';
    } else {
      document.title = ar.title + ' | NOMA LIGHT';
      var relatedA = NOMA.articles.filter(function (x) { return x.slug !== ar.slug; }).slice(0, 3);
      artEl.innerHTML =
        '<p class="crumb"><a href="' + R + 'index.html">Trang chủ</a> / <a href="' + R + 'tin-tuc/">Tin tức</a> / ' + e(ar.title) + '</p>' +
        '<p class="eyebrow">' + e(ar.cat) + ' · ' + e(ar.date) + '</p>' +
        '<h1>' + e(ar.title) + '</h1>' +
        '<img src="' + R + ar.img + '" alt="" style="width:100%;border-radius:16px;margin:16px 0" />' +
        ar.body.map(function (para) { return '<p>' + e(para) + '</p>'; }).join('') +
        '<div class="cta-band"><h2>Cần tư vấn chọn đèn?</h2><a class="btn btn--primary" href="' + R + 'dat-lich/">Đặt lịch tư vấn</a></div>' +
        '<h2>Bài viết liên quan</h2>' + relatedA.map(function (a) {
          return '<p><a href="' + R + 'tin-tuc/' + a.slug + '/">' + e(a.title) + '</a></p>';
        }).join('');
    }
  }

  var searchRoot = document.getElementById('search-results');
  if (searchRoot) {
    var q = (new URLSearchParams(location.search).get('q') || '').trim();
    var qInput = document.getElementById('search-input');
    if (qInput) qInput.value = q;
    var titleEl = document.getElementById('search-title');
    if (titleEl) titleEl.textContent = q ? ('Kết quả cho “' + q + '”') : 'Tìm kiếm';
    var nEl = document.getElementById('search-n');
    if (!q) {
      if (nEl) nEl.textContent = 'Nhập từ khóa để tìm sản phẩm, dự án và tin tức.';
      searchRoot.innerHTML = '';
    } else {
      var ql = q.toLowerCase();
      function hit(text) { return (text || '').toLowerCase().indexOf(ql) !== -1; }
      var prods = NOMA.products.filter(function (p) { return hit(p.name + ' ' + p.sku + ' ' + p.blurb + ' ' + p.use); });
      var projs = (NOMA.projects || []).filter(function (p) { return hit(p.title + ' ' + p.type + ' ' + p.summary); });
      var arts = (NOMA.articles || []).filter(function (p) { return hit(p.title + ' ' + p.excerpt); });
      var n = prods.length + projs.length + arts.length;
      if (nEl) nEl.textContent = n + ' kết quả';
      function block(title, html) {
        return html ? '<section class="search-block"><h2>' + title + '</h2>' + html + '</section>' : '';
      }
      searchRoot.innerHTML =
        block('Sản phẩm', prods.length ? '<div class="grid-products">' + prods.map(NOMA.cardHtml).join('') + '</div>' : '') +
        block('Dự án', projs.map(function (p) {
          return '<a class="search-row" href="' + R + 'du-an/' + p.slug + '/"><strong>' + e(p.title) + '</strong><span>' + e(p.type) + '</span></a>';
        }).join('')) +
        block('Tin tức', arts.map(function (p) {
          return '<a class="search-row" href="' + R + 'tin-tuc/' + p.slug + '/"><strong>' + e(p.title) + '</strong><span>' + e(p.cat) + '</span></a>';
        }).join('')) +
        (n === 0 ? '<p class="lede">Không có kết quả cho từ khóa này.</p>' : '');
    }
  }
})();
