(function () {
  if (!window.NOMA) return;
  var e = NOMA.esc;
  var R = NOMA.root();

  var bookForm = document.getElementById('book-form');
  if (bookForm) {
    var dateInput = bookForm.querySelector('input[type="date"]');
    if (dateInput) dateInput.min = new Date().toISOString().slice(0, 10);
    bookForm.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var fd = new FormData(bookForm);
      var lines = [
        'Đặt lịch tư vấn NOMA LIGHT',
        'Họ tên: ' + (fd.get('name') || ''),
        'Điện thoại: ' + (fd.get('phone') || ''),
        'Email: ' + (fd.get('email') || '—'),
        'Khu vực: ' + (fd.get('area') || '—'),
        'Loại công trình: ' + (fd.get('work') || '—'),
        'Nhu cầu: ' + (fd.get('need') || '—'),
        'Ngày hẹn: ' + (fd.get('date') || '—'),
        'Khung giờ: ' + (fd.get('slot') || '—'),
        'Ghi chú: ' + (fd.get('note') || '—')
      ];
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(lines.join('\n')).catch(function () {});
      }
      var ok = document.getElementById('book-ok');
      if (ok) {
        ok.hidden = false;
        ok.textContent = 'Đã tiếp nhận yêu cầu. Nội dung đã sao chép — cửa sổ Zalo Minh Trọng sẽ mở để bạn gửi tin.';
      }
      window.open('https://zalo.me/0974169141', '_blank', 'noopener');
    });
  }

  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var fd = new FormData(contactForm);
      var lines = [
        'Liên hệ NOMA LIGHT',
        'Họ tên: ' + (fd.get('name') || ''),
        'Điện thoại: ' + (fd.get('phone') || ''),
        'Email: ' + (fd.get('email') || '—'),
        'Nội dung: ' + (fd.get('note') || fd.get('need') || '—')
      ];
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(lines.join('\n')).catch(function () {});
      }
      var ok = document.getElementById('contact-ok');
      if (ok) ok.hidden = false;
      window.open('https://zalo.me/0974169141', '_blank', 'noopener');
    });
  }

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
            '<p class="lede">' + e(p.use) + '</p>' +
            '<div class="hero__actions">' +
              '<a class="btn btn--primary" href="' + R + 'dat-lich/">Đặt lịch tư vấn</a>' +
              '<a class="btn btn--ghost" href="tel:0974169141">0974 169 141</a>' +
              '<a class="btn btn--ghost" href="' + R + 'catalogue/">Xem Catalogue sản phẩm</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<h2 class="pd__h">Thông số kỹ thuật</h2>' +
        '<p class="spec-note">Thông số kỹ thuật chính thức sẽ được cập nhật theo catalogue NOMA LIGHT. Hiện chưa công bố số liệu công suất, pin, IP hay thời gian chiếu sáng trên website.</p>' +
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
        '<div class="inner-hero" style="background-image:url(' + R + pr.img + ')"><div class="wrap">' +
        '<h1>' + e(pr.title) + '</h1><p>' + e(pr.place) + ' · ' + e(pr.type) + '</p></div></div>' +
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
    var qEl = document.getElementById('search-q');
    if (qEl) qEl.textContent = q || '—';
    var ql = q.toLowerCase();
    function hit(text) { return !ql || (text || '').toLowerCase().indexOf(ql) !== -1; }
    var prods = NOMA.products.filter(function (p) { return hit(p.name + ' ' + p.blurb + ' ' + p.use); });
    var projs = (NOMA.projects || []).filter(function (p) { return hit(p.title + ' ' + p.type + ' ' + p.summary); });
    var arts = (NOMA.articles || []).filter(function (p) { return hit(p.title + ' ' + p.excerpt); });
    var n = prods.length + projs.length + arts.length;
    var nEl = document.getElementById('search-n');
    if (nEl) nEl.textContent = q ? (n + ' kết quả') : 'Nhập từ khóa để tìm sản phẩm, dự án và tin tức.';
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
      (q && n === 0 ? '<p class="lede">Không có kết quả cho từ khóa này.</p>' : '');
  }
})();
