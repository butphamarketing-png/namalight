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
        var first = form.querySelector('label.is-invalid input, label.is-invalid textarea, label.is-invalid select');
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
      var related = NOMA.products.filter(function (x) { return x.cat === p.cat && x.id !== p.id; }).slice(0, 3);
      root.innerHTML =
        '<p class="crumb"><a href="' + R + 'index.html">Trang chủ</a> / <a href="' + R + 'san-pham/">Sản phẩm</a> / <a href="' + NOMA.groupHref(g) + '">' + e(g.label) + '</a> / ' + e(p.name) + '</p>' +
        '<div class="pd">' +
          '<div class="pd__visual">' +
            '<img src="' + R + NOMA.imgFor(p) + '" alt="' + e(p.name) + '" />' +
          '</div>' +
          '<div class="pd__info">' +
            '<p class="eyebrow">' + e(g.label) + '</p>' +
            '<h1>' + e(p.name) + '</h1>' +
            '<p class="shop-price">Liên hệ</p>' +
            '<p class="lede">' + e(p.use) + '</p>' +
            '<div class="hero__actions">' +
              '<a class="btn btn--primary" href="https://zalo.me/0974169141" target="_blank" rel="noopener">Tư vấn Zalo</a>' +
              '<a class="btn btn--ghost" href="tel:0974169141">0974 169 141</a>' +
              '<a class="btn btn--ghost" href="' + R + 'catalogue/">Xem Catalogue</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<h2 class="pd__h">Thông số kỹ thuật</h2>' +
        '<p class="spec-note">' + e(g.catalog || 'Xem catalogue 8 trang NOMA LIGHT.') + ' Liên hệ Minh Trọng 0974 169 141 hoặc <a href="' + R + 'catalogue/">mở catalogue</a> để đối chiếu mã in. Website không công bố watt, pin hay IP ngoài catalogue.</p>' +
        '<h2 class="pd__h">Ứng dụng</h2>' +
        '<p>' + e(p.use) + '</p>' +
        '<div class="pd-apps"><img src="' + R + g.img + '" alt="" /></div>' +
        '<div class="cta-band">' +
          '<h2>Bạn cần tư vấn sản phẩm phù hợp?</h2>' +
          '<a class="btn btn--primary" href="' + R + 'dat-lich/">Đặt lịch tư vấn</a>' +
        '</div>' +
        (related.length ? '<h2 class="pd__h">Sản phẩm liên quan</h2><div class="grid-products">' + related.map(NOMA.cardHtml).join('') + '</div>' : '');
    }
  }

  var catPage = document.getElementById('cat-products');
  if (catPage) {
    var slug = catPage.getAttribute('data-group');
    var g = NOMA.groups.filter(function (x) { return x.slug === slug; })[0];
    if (g) {
      var list = NOMA.products.filter(function (p) { return g.cats.indexOf(p.cat) !== -1; });
      catPage.innerHTML = list.map(NOMA.cardHtml).join('') || '<p class="lede">Danh mục đang được cập nhật.</p>';
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
