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
  function appsMenu() {
    return [
      ['ung-dung/', 'Tổng quan ứng dụng'],
      ['du-an/tuyen-duong-noi-bo/', 'Tuyến đường nội bộ'],
      ['du-an/khong-gian-san-vuon/', 'Không gian sân vườn'],
      ['du-an/khuon-vien-nha-xuong/', 'Khuôn viên nhà xưởng'],
      ['du-an/cong-va-nha-o/', 'Cổng & nhà ở'],
      ['du-an/khong-gian-cong-cong/', 'Không gian công cộng']
    ].map(function (x) {
      return '<a href="' + h(x[0]) + '">' + x[1] + '</a>';
    }).join('');
  }

  var navLinks =
    '<a href="' + h('index.html') + '"' + current('home') + '>Trang chủ</a>' +
    '<a href="' + h('gioi-thieu/') + '"' + current('about') + '>Giới thiệu</a>' +
    '<div class="nav__drop">' +
      '<a href="' + h('san-pham/') + '"' + current('catalog') + '>Sản phẩm <span class="nav__caret" aria-hidden="true"></span></a>' +
      '<div class="nav__menu">' + productMenu() + '</div>' +
    '</div>' +
    '<div class="nav__drop">' +
      '<a href="' + h('ung-dung/') + '"' + current('apps') + '>Ứng dụng <span class="nav__caret" aria-hidden="true"></span></a>' +
      '<div class="nav__menu">' + appsMenu() + '</div>' +
    '</div>' +
    '<a href="' + h('du-an/') + '"' + current('projects') + '>Dự án</a>' +
    '<a href="' + h('cong-nghe/') + '"' + current('tech') + '>Công nghệ</a>' +
    '<a href="' + h('catalogue/') + '"' + current('ecatalogue') + '>Catalogue</a>' +
    '<a href="' + h('tin-tuc/') + '"' + current('news') + '>Tin tức</a>' +
    '<a href="' + h('lien-he/') + '"' + current('contact') + '>Liên hệ</a>';

  var header = document.getElementById('header-root');
  if (header) {
    header.innerHTML =
      '<a class="skip" href="#main">Bỏ qua điều hướng</a>' +
      '<div class="site-head' + (page === 'ecatalogue' ? ' site-head--slim' : '') + '">' +
        '<div class="wrap site-head__bar">' +
          '<a class="brand" href="' + h('index.html') + '" aria-label="NOMA LIGHT — Trang chủ">' +
            '<span class="brand__name">NOMA LIGHT<sup>®</sup></span>' +
            '<span class="brand__tag">Chiếu Sáng Mọi Con Đường</span>' +
          '</a>' +
          '<button class="menu-btn" type="button" aria-label="Mở menu" aria-expanded="false"><span></span><span></span><span></span></button>' +
          '<nav class="nav" id="site-nav" aria-label="Chính">' + navLinks + '</nav>' +
          '<div class="site-head__tools">' +
            '<a class="site-search" href="' + h('search/') + '" aria-label="Tìm kiếm">' +
              '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3-3"/></svg>' +
            '</a>' +
            '<a class="site-call" href="tel:0974169141">' +
              '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8.1 9.5a16 16 0 0 0 6.4 6.4l1.1-1.1a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z"/></svg>' +
              '0974 169 141' +
            '</a>' +
          '</div>' +
        '</div>' +
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

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = hero.querySelectorAll('.hero__slide');
    var dots = hero.querySelectorAll('.hero__dot');
    var i = 0;
    function go(n) {
      i = (n + slides.length) % slides.length;
      for (var s = 0; s < slides.length; s++) {
        slides[s].classList.toggle('is-on', s === i);
        if (dots[s]) {
          dots[s].classList.toggle('is-on', s === i);
          dots[s].setAttribute('aria-selected', s === i ? 'true' : 'false');
        }
      }
    }
    var prev = hero.querySelector('.hero__arrow--prev');
    var next = hero.querySelector('.hero__arrow--next');
    var timer;
    function play() {
      clearInterval(timer);
      timer = setInterval(function () { go(i + 1); }, 5000);
    }
    if (prev) prev.addEventListener('click', function () { go(i - 1); play(); });
    if (next) next.addEventListener('click', function () { go(i + 1); play(); });
    for (var d = 0; d < dots.length; d++) {
      (function (idx) {
        dots[idx].addEventListener('click', function () { go(idx); play(); });
      })(d);
    }
    hero.addEventListener('mouseenter', function () { clearInterval(timer); });
    hero.addEventListener('mouseleave', play);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) play();
  }
})();
