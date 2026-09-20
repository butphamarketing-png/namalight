(function () {
  var page = document.body.getAttribute('data-page') || '';
  var R = document.body.getAttribute('data-root') || '';
  var groups = (window.NOMA && NOMA.groups) ? NOMA.groups : [];

  function h(path) { return R + path; }
  function current(id) {
    return page === id ? ' aria-current="page"' : '';
  }
  function productMenu() {
    return groups.map(function (g) {
      return '<a href="' + h('san-pham/' + g.slug + '/') + '">' + g.label + '</a>';
    }).join('');
  }

  var header = document.getElementById('header-root');
  if (header && page === 'ecatalogue') {
    header.innerHTML =
      '<a class="skip" href="#main">Bỏ qua điều hướng</a>' +
      '<div class="site-head site-head--slim">' +
        '<nav class="nav-bar" aria-label="Chính">' +
          '<div class="wrap nav-bar__inner">' +
            '<a class="brand brand--slim" href="' + h('index.html') + '" aria-label="NOMA LIGHT — Trang chủ">' +
              '<span class="brand__mark" aria-hidden="true">' +
                '<svg viewBox="0 0 36 36" fill="none"><path d="M10 22c4-9 8-14 8-14s4 5 8 14c-5 6-11 6-16 0Z" fill="#5aad3a"/><path d="M18 8c0 8-3 12-6 16" stroke="#2e7d32" stroke-width="1.4" fill="none"/></svg>' +
              '</span>' +
              '<span class="brand__text"><strong>NOMA LIGHT</strong></span>' +
            '</a>' +
            '<button class="menu-btn" type="button" aria-label="Mở menu" aria-expanded="false"><span></span><span></span><span></span></button>' +
            '<div class="nav" id="site-nav">' +
              '<a class="nav__home" href="' + h('index.html') + '"' + current('home') + '>Trang chủ</a>' +
              '<a href="' + h('gioi-thieu/') + '"' + current('about') + '>Giới thiệu</a>' +
              '<div class="nav__drop">' +
                '<a href="' + h('san-pham/') + '"' + current('catalog') + '>Sản phẩm</a>' +
                '<div class="nav__menu">' + productMenu() + '</div>' +
              '</div>' +
              '<a href="' + h('ung-dung/') + '"' + current('apps') + '>Ứng dụng</a>' +
              '<a href="' + h('du-an/') + '"' + current('projects') + '>Dự án</a>' +
              '<a href="' + h('cong-nghe/') + '"' + current('tech') + '>Công nghệ</a>' +
              '<a class="nav__catalogue" href="' + h('catalogue/') + '"' + current('ecatalogue') + '>Catalogue</a>' +
              '<a href="' + h('tin-tuc/') + '"' + current('news') + '>Tin tức</a>' +
              '<a href="' + h('lien-he/') + '"' + current('contact') + '>Liên hệ</a>' +
            '</div>' +
          '</div>' +
        '</nav>' +
      '</div>' +
      '<div class="nav-scrim" id="nav-scrim" hidden></div>';
  } else if (header) {
    header.innerHTML =
      '<a class="skip" href="#main">Bỏ qua điều hướng</a>' +
      '<div class="site-head">' +
      '<div class="topbar">' +
        '<div class="wrap topbar__inner">' +
          '<div class="topbar__left">' +
            '<a href="tel:0974169141">0974 169 141</a>' +
            '<a href="https://zalo.me/0974169141" target="_blank" rel="noopener">Zalo Minh Trọng</a>' +
          '</div>' +
          '<div class="topbar__right">' +
            '<a href="' + h('san-pham/den-duong-nang-luong-mat-troi/') + '">Đèn đường</a>' +
            '<a href="' + h('san-pham/den-pha-nang-luong-mat-troi/') + '">Đèn pha</a>' +
            '<a href="' + h('san-pham/den-san-vuon-nang-luong-mat-troi/') + '">Đèn sân vườn</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="masthead">' +
        '<div class="wrap masthead__inner">' +
          '<a class="brand" href="' + h('index.html') + '" aria-label="NOMA LIGHT — Trang chủ">' +
            '<span class="brand__mark" aria-hidden="true">' +
              '<svg viewBox="0 0 36 36" fill="none"><path d="M10 22c4-9 8-14 8-14s4 5 8 14c-5 6-11 6-16 0Z" fill="#5aad3a"/><path d="M18 8c0 8-3 12-6 16" stroke="#2e7d32" stroke-width="1.4" fill="none"/></svg>' +
            '</span>' +
            '<span class="brand__text"><strong>NOMA LIGHT</strong><small>Sáng hơn cho cuộc sống xanh</small></span>' +
          '</a>' +
          '<form class="header-search" action="' + h('search/') + '" method="get" role="search">' +
            '<label class="visually-hidden" for="header-q">Tìm kiếm</label>' +
            '<input id="header-q" name="q" type="search" placeholder="Tìm sản phẩm, dự án, tin tức..." />' +
            '<button type="submit" aria-label="Tìm kiếm">' +
              '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3-3"/></svg>' +
            '</button>' +
          '</form>' +
          '<a class="header-hotline" href="tel:0974169141">' +
            '<span class="header-hotline__icon" aria-hidden="true">☎</span>' +
            '<span><small>Hotline đặt hàng</small><strong>0974 169 141</strong></span>' +
          '</a>' +
          '<button class="menu-btn" type="button" aria-label="Mở menu" aria-expanded="false"><span></span><span></span><span></span></button>' +
        '</div>' +
      '</div>' +
      '<nav class="nav-bar" aria-label="Chính">' +
        '<div class="wrap nav-bar__inner">' +
          '<div class="nav" id="site-nav">' +
            '<a class="nav__home" href="' + h('index.html') + '"' + current('home') + '>Trang chủ</a>' +
            '<a href="' + h('gioi-thieu/') + '"' + current('about') + '>Giới thiệu</a>' +
            '<div class="nav__drop">' +
              '<a href="' + h('san-pham/') + '"' + current('catalog') + '>Sản phẩm</a>' +
              '<div class="nav__menu">' + productMenu() + '</div>' +
            '</div>' +
            '<a href="' + h('ung-dung/') + '"' + current('apps') + '>Ứng dụng</a>' +
            '<a href="' + h('du-an/') + '"' + current('projects') + '>Dự án</a>' +
            '<a href="' + h('cong-nghe/') + '"' + current('tech') + '>Công nghệ</a>' +
            '<a class="nav__catalogue" href="' + h('catalogue/') + '"' + current('ecatalogue') + '>Catalogue</a>' +
            '<a href="' + h('tin-tuc/') + '"' + current('news') + '>Tin tức</a>' +
            '<a href="' + h('lien-he/') + '"' + current('contact') + '>Liên hệ</a>' +
          '</div>' +
          '<a class="nav-cart" href="' + h('dat-lich/') + '"' + current('booking') + '>Đặt lịch</a>' +
        '</div>' +
      '</nav>' +
      '</div>' +
      '<div class="nav-scrim" id="nav-scrim" hidden></div>';
  }

  var footer = document.getElementById('footer-root');
  if (footer && page === 'ecatalogue') {
    footer.remove();
  } else if (footer) {
    footer.innerHTML =
      '<footer class="site-footer">' +
        '<div class="wrap footer-grid">' +
          '<div class="footer-brand">' +
            '<p class="brand-name">NOMA <span>LIGHT</span></p>' +
            '<p class="footer-tag">Sáng hơn cho cuộc sống xanh</p>' +
            '<p>Giải pháp chiếu sáng bằng năng lượng mặt trời hiện đại, tiết kiệm và thân thiện với môi trường.</p>' +
            '<p class="footer-social">' +
              '<a href="https://zalo.me/0974169141" target="_blank" rel="noopener">Zalo Minh Trọng</a>' +
            '</p>' +
          '</div>' +
          '<div>' +
            '<p class="footer-title">Điều hướng</p>' +
            '<p>' +
              '<a href="' + h('index.html') + '">Trang chủ</a><br />' +
              '<a href="' + h('gioi-thieu/') + '">Giới thiệu</a><br />' +
              '<a href="' + h('san-pham/') + '">Sản phẩm</a><br />' +
              '<a href="' + h('ung-dung/') + '">Ứng dụng</a><br />' +
              '<a href="' + h('du-an/') + '">Dự án</a><br />' +
              '<a href="' + h('cong-nghe/') + '">Công nghệ</a><br />' +
              '<a href="' + h('catalogue/') + '">Catalogue</a><br />' +
              '<a href="' + h('tin-tuc/') + '">Tin tức</a><br />' +
              '<a href="' + h('lien-he/') + '">Liên hệ</a>' +
            '</p>' +
          '</div>' +
          '<div>' +
            '<p class="footer-title">Sản phẩm</p>' +
            '<p>' +
              '<a href="' + h('san-pham/den-duong-nang-luong-mat-troi/') + '">Đèn đường</a><br />' +
              '<a href="' + h('san-pham/den-pha-nang-luong-mat-troi/') + '">Đèn pha</a><br />' +
              '<a href="' + h('san-pham/den-san-vuon-nang-luong-mat-troi/') + '">Đèn sân vườn</a><br />' +
              '<a href="' + h('san-pham/den-dan-dung-nang-luong-mat-troi/') + '">Đèn dân dụng</a>' +
            '</p>' +
          '</div>' +
          '<div class="footer-contact">' +
            '<p class="footer-title">Liên hệ</p>' +
            '<p class="footer-co">CÔNG TY TNHH SX-TM NOMA LIGHT</p>' +
            '<p>' +
              '<a href="tel:0974169141">Minh Trọng: 0974 169 141</a><br />' +
              'Địa chỉ: Đang cập nhật<br />' +
              'Email: Đang cập nhật' +
            '</p>' +
          '</div>' +
        '</div>' +
        '<div class="wrap footer-bar">' +
          '<p>© 2026 NOMA LIGHT. All rights reserved.</p>' +
          '<p>' +
            '<a href="' + h('chinh-sach-bao-mat/') + '">Chính sách bảo mật</a>' +
            '<a href="' + h('dieu-khoan-su-dung/') + '">Điều khoản sử dụng</a>' +
            '<a href="' + h('chinh-sach-bao-hanh/') + '">Chính sách bảo hành</a>' +
          '</p>' +
          '<a class="to-top" href="#main" aria-label="Lên đầu trang">↑</a>' +
        '</div>' +
      '</footer>';
  }

  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('site-nav');
  var scrim = document.getElementById('nav-scrim');
  function setOpen(open) {
    if (!nav || !btn) return;
    nav.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('nav-open', open);
    if (scrim) scrim.hidden = !open;
  }
  if (btn && nav) {
    btn.addEventListener('click', function () { setOpen(!nav.classList.contains('is-open')); });
  }
  if (scrim) scrim.addEventListener('click', function () { setOpen(false); });
})();
