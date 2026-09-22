(function () {
  document.documentElement.id = 'top';
  var page = document.body.getAttribute('data-page') || '';
  var R = document.body.getAttribute('data-root') || '';
  var groups = (window.NOMA && NOMA.groups) ? NOMA.groups : [];

  function h(path) { return R + path; }

  document.body.classList.remove('noma-booting');
  var staleBoot = document.getElementById('noma-boot');
  if (staleBoot && staleBoot.parentNode) staleBoot.parentNode.removeChild(staleBoot);

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
    '<a href="' + h('tin-tuc/') + '"' + current('news') + '>Tin tức</a>' +
    '<a href="' + h('lien-he/') + '"' + current('contact') + '>Liên hệ</a>' +
    '<a href="' + h('catalogue/') + '"' + current('ecatalogue') + '>Catalogue</a>';

  document.body.classList.add('is-shop');
  if (!document.getElementById('noma-shop-css')) {
    var shopCss = document.createElement('link');
    shopCss.id = 'noma-shop-css';
    shopCss.rel = 'stylesheet';
    shopCss.href = h('css/shop.css?v=5');
    document.head.appendChild(shopCss);
  }

  var header = document.getElementById('header-root');
  if (header && page === 'ecatalogue') {
    header.innerHTML =
      '<a class="skip" href="#main">Bỏ qua điều hướng</a>' +
      '<div class="site-head site-head--slim">' +
        '<div class="wrap site-head__bar">' +
          '<a class="brand" href="' + h('index.html') + '" aria-label="NOMA LIGHT — Trang chủ">' +
            '<span class="brand__name">NOMA LIGHT<sup>®</sup></span>' +
            '<span class="brand__tag">Chiếu Sáng Mọi Con Đường</span>' +
          '</a>' +
          '<button class="menu-btn" type="button" aria-label="Mở menu" aria-expanded="false"><span></span><span></span><span></span></button>' +
          '<nav class="nav" id="site-nav" aria-label="Chính">' + navLinks + '</nav>' +
          '<div class="site-head__tools">' +
            '<a class="site-call" href="tel:0974169141"><span class="site-call__num">0974 169 141</span></a>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="nav-scrim" id="nav-scrim" hidden></div>';
  } else if (header) {
    header.innerHTML =
      '<a class="skip" href="#main">Bỏ qua điều hướng</a>' +
      '<div class="shop-top">' +
        '<span>Thương hiệu chuyên đèn năng lượng mặt trời NOMA LIGHT</span>' +
        '<span>Tư vấn Minh Trọng · 0974 169 141</span>' +
      '</div>' +
      '<div class="site-head shop-shell">' +
        '<div class="shop-head">' +
          '<a class="brand" href="' + h('index.html') + '" aria-label="NOMA LIGHT — Trang chủ">' +
            '<span class="brand__name">NOMA LIGHT<sup>®</sup></span>' +
            '<span class="brand__tag">Chiếu Sáng Mọi Con Đường</span>' +
          '</a>' +
          '<form class="shop-search" action="' + h('search/') + '" method="get" role="search">' +
            '<input type="search" name="q" placeholder="Nhập từ khóa tìm kiếm..." aria-label="Tìm kiếm" />' +
            '<button type="submit">Tìm kiếm</button>' +
          '</form>' +
          '<div class="shop-tools">' +
            '<a class="shop-tools__hotline" href="tel:0974169141">0974 169 141<small>Hotline</small></a>' +
            '<a href="https://zalo.me/0974169141" target="_blank" rel="noopener">Zalo<small>Minh Trọng</small></a>' +
          '</div>' +
          '<button class="menu-btn" type="button" aria-label="Mở menu" aria-expanded="false"><span></span><span></span><span></span></button>' +
        '</div>' +
        '<div class="shop-bar">' +
          '<div class="shop-cat" id="shop-cat">' +
            '<button class="shop-cat__btn" type="button" aria-expanded="false">☰ Danh mục sản phẩm ▾</button>' +
            '<div class="shop-cat__list">' +
              '<a href="' + h('san-pham/') + '">Đèn năng lượng mặt trời</a>' +
              '<a href="' + h('san-pham/den-duong-nang-luong-mat-troi/') + '">Đèn ngoài trời / đèn đường</a>' +
              '<a href="' + h('san-pham/den-dan-dung-nang-luong-mat-troi/') + '">Đèn dân dụng / trong nhà</a>' +
              '<a href="' + h('san-pham/den-san-vuon-nang-luong-mat-troi/') + '">Đèn sân vườn</a>' +
              '<a href="' + h('san-pham/nl-gt120/') + '">Đèn trụ cổng</a>' +
              '<a href="' + h('san-pham/den-pha-nang-luong-mat-troi/') + '">Đèn pha / công trình</a>' +
              '<a href="' + h('san-pham/nl-pir80/') + '">Đèn cảm biến</a>' +
              '<a href="' + h('du-an/') + '">Dự án chiếu sáng</a>' +
            '</div>' +
          '</div>' +
          '<nav class="nav" id="site-nav" aria-label="Chính">' + navLinks + '</nav>' +
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
          '<p>CÔNG TY TNHH SX-TM NOMA LIGHT cung cấp đèn năng lượng mặt trời: đèn đường, sân vườn, đèn cảm biến, đèn tường. Sứ mệnh: chiếu sáng tiết kiệm, dễ lắp, tư vấn theo công trình.</p>' +
            '<p class="footer-social">' +
              '<a href="https://zalo.me/0974169141" target="_blank" rel="noopener">Zalo Minh Trọng</a>' +
            '</p>' +
          '</div>' +
          '<div>' +
            '<p class="footer-title">Về chúng tôi</p>' +
            '<p>' +
              '<a href="' + h('gioi-thieu/') + '">Giới thiệu NOMA LIGHT</a><br />' +
              '<a href="' + h('san-pham/') + '">Sản phẩm</a><br />' +
              '<a href="' + h('catalogue/') + '">Catalogue 8 trang</a><br />' +
              '<a href="' + h('tin-tuc/') + '">Tin tức</a><br />' +
              '<a href="' + h('lien-he/') + '">Liên hệ</a>' +
            '</p>' +
          '</div>' +
          '<div>' +
            '<p class="footer-title">Hỗ trợ khách hàng</p>' +
            '<p>' +
              '<a href="' + h('chinh-sach-bao-mat/') + '">Chính sách bảo mật</a><br />' +
              '<a href="' + h('chinh-sach-giao-hang/') + '">Vận chuyển và giao nhận</a><br />' +
              '<a href="' + h('chinh-sach-doi-tra/') + '">Chính sách đổi trả</a><br />' +
              '<a href="' + h('chinh-sach-thanh-toan/') + '">Chính sách thanh toán</a><br />' +
              '<a href="' + h('chinh-sach-bao-hanh/') + '">Chính sách bảo hành</a><br />' +
              '<a href="' + h('chinh-sach-hoan-tien/') + '">Chính sách hoàn tiền</a><br />' +
              '<a href="' + h('chinh-sach-kiem-hang/') + '">Chính sách kiểm hàng</a><br />' +
              '<a href="' + h('chinh-sach-ve-gia/') + '">Chính sách về giá</a><br />' +
              '<a href="' + h('chinh-sach-xu-ly-khieu-nai/') + '">Xử lý khiếu nại</a>' +
            '</p>' +
          '</div>' +
          '<div class="footer-contact">' +
            '<p class="footer-title">Kết nối với chúng tôi</p>' +
            '<p class="footer-co">CÔNG TY TNHH SX-TM NOMA LIGHT</p>' +
            '<p>' +
              '<a href="tel:0974169141">Điện thoại: 0974 169 141</a><br />' +
              '<a href="https://zalo.me/0974169141" target="_blank" rel="noopener">Zalo: 0974 169 141</a><br />' +
              '<a href="mailto:info@nomalight.vn">Email: info@nomalight.vn</a><br />' +
              'Website: www.nomalight.vn' +
            '</p>' +
          '</div>' +
        '</div>' +
        '<div class="wrap footer-bar">' +
          '<p>© 2026 NOMA LIGHT. All rights reserved.</p>' +
          '<p>' +
            '<a href="' + h('chinh-sach-bao-mat/') + '">Bảo mật</a>' +
            '<a href="' + h('chinh-sach-bao-hanh/') + '">Bảo hành</a>' +
            '<a href="' + h('chinh-sach-doi-tra/') + '">Đổi trả</a>' +
          '</p>' +
          '<a class="to-top" href="#top" aria-label="Lên đầu trang">↑</a>' +
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
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
  }
  if (scrim) scrim.addEventListener('click', function () { setOpen(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });
  var catBox = document.getElementById('shop-cat');
  if (catBox) {
    var catBtn = catBox.querySelector('.shop-cat__btn');
    if (catBtn) {
      catBtn.addEventListener('click', function (ev) {
        ev.stopPropagation();
        catBox.classList.toggle('is-open');
        catBtn.setAttribute('aria-expanded', catBox.classList.contains('is-open') ? 'true' : 'false');
      });
    }
  }

  var headEl = document.querySelector('.site-head');

  if (page !== 'ecatalogue') {
    var dock = document.createElement('div');
    dock.className = 'noma-dock';
    dock.innerHTML =
      '<a class="noma-dock__ask" href="' + h('lien-he/') + '">Tư vấn</a>' +
      '<a class="noma-dock__zalo" href="https://zalo.me/0974169141" target="_blank" rel="noopener" aria-label="Chat Zalo Minh Trọng">' +
        '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3C6.5 3 2 6.9 2 11.6c0 2.7 1.5 5.1 3.8 6.7L5 21.5l3.4-1.3c1.1.3 2.3.5 3.6.5 5.5 0 10-3.9 10-8.6S17.5 3 12 3zm4.6 10.2c-.2.5-1.1 1-1.6 1.1-.4.1-.9.2-2.9-.6-2.4-1-4-3.4-4.1-3.6-.1-.2-1-1.3-1-2.5s.6-1.8.9-2c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5.2.6.7 2 .8 2.1.1.2.1.3 0 .5-.1.2-.2.3-.4.5-.2.2-.3.3-.1.6.2.3.9 1.5 2 2.4 1.3 1.1 2.4 1.4 2.7 1.6.3.1.5.1.7-.1.2-.2.8-.9 1-1.2.2-.3.4-.2.7-.1.3.1 1.9.9 2.2 1.1.3.2.5.2.6.4.1.2 0 .9-.4 1.4z"/></svg>' +
      '</a>' +
      '<a class="noma-dock__call" href="tel:0974169141" aria-label="Gọi 0974 169 141">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8.1 9.5a16 16 0 0 0 6.4 6.4l1.1-1.1a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z"/></svg>' +
      '</a>';
    document.body.appendChild(dock);
  }

  document.addEventListener('click', function (e) {
    var topBtn = e.target.closest && e.target.closest('.to-top');
    if (!topBtn) return;
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

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

  var lineup = document.querySelector('[data-lineup]');
  if (lineup) {
    var track = lineup.querySelector('.lineup__track');
    var prevL = lineup.querySelector('[data-lineup-prev]');
    var nextL = lineup.querySelector('[data-lineup-next]');
    function step() {
      var card = track.querySelector('article');
      return card ? card.getBoundingClientRect().width + 20 : 280;
    }
    if (prevL) prevL.addEventListener('click', function () {
      track.scrollBy({ left: -step(), behavior: 'smooth' });
    });
    if (nextL) nextL.addEventListener('click', function () {
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 8) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: step(), behavior: 'smooth' });
      }
    });
  }

  var voices = document.querySelector('[data-voices]');
  var vTrack = voices ? voices.querySelector('.voices__track') : null;
  if (voices && vTrack) {
    var vPrev = voices.querySelector('[data-voices-prev]');
    var vNext = voices.querySelector('[data-voices-next]');
    var vDots = voices.querySelectorAll('.voices__dots button');
    function vStep() {
      var card = vTrack.querySelector('article');
      return card ? card.getBoundingClientRect().width + 18 : 280;
    }
    function vIndex() {
      return Math.round(vTrack.scrollLeft / vStep());
    }
    function vSync() {
      var i = vIndex();
      vDots.forEach(function (d, n) {
        d.classList.toggle('is-on', n === i);
        d.setAttribute('aria-selected', n === i ? 'true' : 'false');
      });
    }
    if (vPrev) vPrev.addEventListener('click', function () {
      vTrack.scrollBy({ left: -vStep(), behavior: 'smooth' });
    });
    if (vNext) vNext.addEventListener('click', function () {
      if (vTrack.scrollLeft + vTrack.clientWidth >= vTrack.scrollWidth - 8) {
        vTrack.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        vTrack.scrollBy({ left: vStep(), behavior: 'smooth' });
      }
    });
    vDots.forEach(function (d, n) {
      d.addEventListener('click', function () {
        vTrack.scrollTo({ left: n * vStep(), behavior: 'smooth' });
      });
    });
    vTrack.addEventListener('scroll', vSync, { passive: true });
  }

  var callIcons = document.querySelector('[data-call-icons]');
  if (callIcons) {
    var lights = callIcons.querySelectorAll('a');
    var lit = 0;
    function shine() {
      lights.forEach(function (el, n) { el.classList.toggle('is-lit', n === lit); });
      lit = (lit + 1) % lights.length;
    }
    shine();
    if (!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
      setInterval(shine, 2000);
    }
  }

  function isTyping(el) {
    if (!el) return false;
    var tag = (el.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
    return !!el.isContentEditable;
  }

  document.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  document.addEventListener('dragstart', function (e) {
    if (page === 'ecatalogue') return;
    e.preventDefault();
  });
  document.addEventListener('copy', function (e) {
    if (isTyping(e.target)) return;
    e.preventDefault();
  });
  document.addEventListener('cut', function (e) {
    if (isTyping(e.target)) return;
    e.preventDefault();
  });
  document.addEventListener('selectstart', function (e) {
    if (isTyping(e.target)) return;
    e.preventDefault();
  });
  document.addEventListener('keydown', function (e) {
    if (isTyping(e.target)) return;
    var k = (e.key || '').toLowerCase();
    var block = (e.ctrlKey || e.metaKey) && (k === 'c' || k === 'x' || k === 's' || k === 'u' || k === 'a' || k === 'p');
    if (block || k === 'f12') e.preventDefault();
  });
  document.querySelectorAll('img').forEach(function (img) {
    img.setAttribute('draggable', 'false');
  });

  var sectionFxStarted = false;
  function startSectionFx() {
    if (page === 'ecatalogue') return;
    if (sectionFxStarted && document.documentElement.classList.contains('noma-fx')) return;

    function kindFor(sec, idx) {
      if (sec.classList.contains('hero')) return 'hero';
      if (sec.classList.contains('inner-hero')) return 'hero';
      if (sec.classList.contains('lineup')) return 'cards';
      if (sec.classList.contains('tech-globe') || sec.classList.contains('techx')) return 'rise';
      if (sec.classList.contains('proj-mosaic')) return 'mosaic';
      if (sec.classList.contains('cat-spread')) return 'tilt';
      if (sec.classList.contains('voices')) return 'cards';
      if (sec.classList.contains('call-night')) return 'zoom';
      if (sec.classList.contains('contact-split') || sec.classList.contains('booknow') || sec.classList.contains('book-stage')) return 'form';
      if (sec.classList.contains('alt-row--flip')) return 'right';
      if (sec.classList.contains('alt-row')) return 'left';
      if (sec.classList.contains('intro')) return 'split';
      return idx % 2 ? 'right' : 'up';
    }

    function markItems(root) {
      var sel = [
        '.intro__visual', '.intro__copy', '.intro__feats li',
        '.lineup__head', '.lineup__track article', '.lineup__foot',
        '.tech-globe__copy', '.tech-globe__notes li',
        '.proj-mosaic__copy', '.proj-mosaic__feature', '.proj-mosaic__stack > a',
        '.cat-spread__copy', '.cat-spread__book',
        '.voices__head', '.voices__track article',
        '.call-night__inner > *',
        '.contact-split__visual', '.contact-split__form', '.book-stage__card',
        '.alt-row > img', '.alt-row > div',
        '.inner-hero h1', '.inner-hero p',
        '.product', '.news-card', '.grid-products > *',
        '.techx__notes li', '.cta-band', '.cats__cta'
      ].join(',');
      var items = root.querySelectorAll(sel);
      var n = 0;
      for (var i = 0; i < items.length && n < 12; i++) {
        if (items[i].closest('#book, .flip-stage, .noma-boot')) continue;
        items[i].classList.add('noma-fx-item');
        items[i].style.setProperty('--i', String(n));
        n += 1;
      }
    }

    function collect() {
      var list = [];
      document.querySelectorAll('header.inner-hero, main > section').forEach(function (el) {
        list.push(el);
      });
      return list;
    }

    var blocks = collect();
    if (!blocks.length) {
      if (!sectionFxStarted) setTimeout(startSectionFx, 450);
      return;
    }
    sectionFxStarted = true;
    blocks.forEach(function (sec, idx) {
      if (!sec.getAttribute('data-fx')) sec.setAttribute('data-fx', kindFor(sec, idx));
      markItems(sec);
    });
    document.documentElement.classList.add('noma-fx');

    function inView(el) {
      var r = el.getBoundingClientRect();
      return r.top < window.innerHeight * 0.9 && r.bottom > 48;
    }

    function reveal(el) {
      el.classList.add('is-in');
    }

    function observe(nodes) {
      if (!('IntersectionObserver' in window)) {
        nodes.forEach(reveal);
        return;
      }
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          reveal(e.target);
          io.unobserve(e.target);
        });
      }, { threshold: [0, 0.08, 0.2], rootMargin: '72px 0px -4% 0px' });
      nodes.forEach(function (el) {
        if (inView(el)) reveal(el);
        else io.observe(el);
      });
    }

    requestAnimationFrame(function () {
      observe(blocks);
    });

    setTimeout(function () {
      document.querySelectorAll('[data-fx], .noma-fx-item').forEach(function (el) {
        el.classList.add('is-in');
      });
    }, 1400);

    setTimeout(function () {
      var extra = [];
      document.querySelectorAll('#catalog-grid .product').forEach(function (el) {
        if (el.classList.contains('noma-fx-item') || el.getAttribute('data-fx')) return;
        el.classList.add('noma-fx-item');
        extra.push(el);
      });
      extra.forEach(function (el, i) { el.style.setProperty('--i', String(i % 12)); });
      var late = collect().filter(function (el) { return !el.classList.contains('is-in'); });
      if (late.length) observe(late);
      extra.forEach(function (el) {
        if (inView(el) || (el.closest('[data-fx]') && el.closest('[data-fx]').classList.contains('is-in'))) {
          el.classList.add('is-in');
        }
      });
    }, 700);
  }

  if (!document.body.classList.contains('noma-booting')) startSectionFx();
  else setTimeout(startSectionFx, 4800);

  var cmsSrc = (document.body.getAttribute('data-root') || '') + 'js/noma-cms.js';
  var cmsEl = document.createElement('script');
  cmsEl.src = cmsSrc;
  cmsEl.async = false;
  cmsEl.onload = function () {
    if (window.NomaCms) {
      NomaCms.trackVisit();
      NomaCms.applyPublic();
    }
  };
  document.head.appendChild(cmsEl);
})();
