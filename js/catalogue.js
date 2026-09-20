(function () {
  var bookEl = document.getElementById('book');
  var loader = document.getElementById('flip-loader');
  if (!bookEl) return;
  if (!window.St) {
    if (loader) loader.innerHTML = '<p>Không tải được trình lật trang. Tải lại trang để thử.</p>';
    return;
  }

  var pages = bookEl.querySelectorAll('.page');
  var total = pages.length;
  var pageFlip = new St.PageFlip(bookEl, {
    width: 520,
    height: 736,
    size: 'stretch',
    minWidth: 280,
    maxWidth: 920,
    minHeight: 400,
    maxHeight: 1180,
    showCover: false,
    drawShadow: true,
    flippingTime: 700,
    usePortrait: true,
    autoSize: true,
    maxShadowOpacity: 0.55,
    mobileScrollSupport: true,
    swipeDistance: 24,
    clickEventForward: true,
    useMouseEvents: true,
    showPageCorners: true,
    disableFlipByClick: false
  });
  pageFlip.loadFromHTML(pages);

  var ind = document.getElementById('page-ind');
  var progress = document.getElementById('page-progress');
  var zoomEl = document.getElementById('flip-zoom');
  var stage = document.getElementById('flip-stage');
  var room = document.getElementById('cat-room');
  var prevBtns = [document.getElementById('btn-prev')];
  var nextBtns = [document.getElementById('btn-next')];
  var zoom = 1;

  function pad(n) { return String(n).padStart(2, '0'); }

  function eagerNear(i) {
    pages.forEach(function (pg, idx) {
      if (Math.abs(idx - i) > 2) return;
      pg.querySelectorAll('img[loading="lazy"]').forEach(function (img) {
        img.loading = 'eager';
      });
    });
  }

  function setIndex(i) {
    if (ind) ind.textContent = pad(i + 1) + ' / ' + pad(total);
    if (progress) progress.style.width = ((i + 1) / total * 100) + '%';
    prevBtns.forEach(function (b) { if (b) b.disabled = i <= 0; });
    nextBtns.forEach(function (b) { if (b) b.disabled = i >= total - 1; });
    eagerNear(i);
  }

  pageFlip.on('flip', function (e) { setIndex(e.data); });
  pageFlip.on('init', function (e) {
    setIndex(e.data.page);
    if (loader) loader.hidden = true;
    stage.classList.add('is-ready');
  });

  function prev() { pageFlip.flipPrev(); }
  function next() { pageFlip.flipNext(); }
  prevBtns.forEach(function (b) { if (b) b.onclick = prev; });
  nextBtns.forEach(function (b) { if (b) b.onclick = next; });

  var zoomBtn = document.getElementById('btn-zoom');
  if (zoomBtn) {
    zoomBtn.onclick = function () {
      zoom = zoom >= 1.5 ? 1 : Math.round((zoom + 0.25) * 100) / 100;
      zoomEl.style.transform = 'scale(' + zoom + ')';
      stage.classList.toggle('is-zoomed', zoom > 1);
    };
  }

  function fsTarget() {
    return room || stage;
  }

  var fsBtn = document.getElementById('btn-fs');
  if (fsBtn) {
    fsBtn.onclick = function () {
      if (!document.fullscreenElement) {
        fsTarget().requestFullscreen().catch(function () {});
      } else {
        document.exitFullscreen();
      }
    };
  }
  document.addEventListener('fullscreenchange', function () {
    var on = !!document.fullscreenElement;
    document.body.classList.toggle('is-cat-fs', on);
    stage.classList.toggle('is-fs', on);
  });

  var dl = document.getElementById('btn-dl');
  if (dl) {
    dl.disabled = true;
    dl.setAttribute('aria-disabled', 'true');
    dl.title = 'Tải Catalogue';
    dl.addEventListener('click', function (ev) { ev.preventDefault(); });
  }

  document.addEventListener('keydown', function (ev) {
    var tag = (ev.target && ev.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (ev.key === 'ArrowRight') next();
    if (ev.key === 'ArrowLeft') prev();
    if (ev.key === 'Escape' && document.fullscreenElement) {
      document.exitFullscreen();
    }
  });

  setTimeout(function () {
    if (loader && !loader.hidden) loader.hidden = true;
    setIndex(pageFlip.getCurrentPageIndex());
  }, 1400);
})();
