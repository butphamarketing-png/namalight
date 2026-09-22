(function () {
  var root = document.getElementById("app");
  if (!root || !window.NomaCms) return;

  var LOGO = "/assets/butpha-marketing.png";
  var SLIDES = [
    {
      title: "Giải pháp",
      accent: "QUẢN LÝ WEBSITE",
      points: ["Cập nhật nội dung trang chủ", "Sản phẩm và catalogue", "Thư liên hệ khách hàng"]
    },
    {
      title: "Dịch vụ",
      accent: "BỨT PHÁ MARKETING",
      points: ["Bảng giá dịch vụ", "Liên hệ kỹ thuật"]
    },
    {
      title: "Hỗ trợ",
      accent: "KỸ THUẬT & HOTLINE",
      points: ["Hotline 093.741.7982", "butphamarketing.com", "butphamarketing@gmail.com"]
    }
  ];
  var slide = 0;
  var loginUser = "admin";
  var loginPass = "";
  var showPass = false;
  var loginError = "";
  var dashMsg = "";
  var formMsg = "";

  function ico(d) {
    return '<svg class="adminbp-nav-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden><path d="' + d + '"/></svg>';
  }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function fmt(n) {
    return new Intl.NumberFormat("vi-VN").format(Number(n) || 0);
  }
  function fmtTime(v) {
    if (!v) return "";
    var d = new Date(v);
    if (isNaN(d.getTime())) return String(v);
    return d.toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" });
  }

  function path() {
    var p = (location.pathname || "/").replace(/\/+$/, "") || "/";
    if (p === "/adminbp/login") return "/login";
    if (p === "/adminbp") return "/";
    if (p.indexOf("/adminbp/") === 0) return p.slice("/adminbp".length);
    return "/";
  }

  function go(to, replace) {
    var url = to === "/login" ? "/adminbp/login/" : "/adminbp" + (to === "/" ? "/" : to + "/");
    if (replace) history.replaceState({}, "", url);
    else history.pushState({}, "", url);
    render();
  }

  var NAV = [
    { items: [{ to: "/", end: true, label: "Bảng điều khiển", icon: "M3 10.5 12 3l9 7.5V21H3z" }] },
    {
      id: "posts",
      label: "Quản lý bài viết",
      items: [
        { to: "/du-an", label: "Dự án", icon: "M3 21V9l9-6 9 6v12H3zM9 21v-7h6v7" },
        { to: "/tin-tuc", label: "Tin tức", icon: "M5 4h14v16H5zM8 8h8M8 12h8M8 16h5" }
      ]
    },
    {
      id: "pages",
      label: "Quản lý trang tĩnh",
      items: [
        { to: "/trang-chu", label: "Trang chủ", icon: "M4 11.5 12 5l8 6.5V20H4zM10 20v-6h4v6" },
        { to: "/trang", label: "Giới thiệu / Liên hệ", icon: "M7 3h7l5 5v13H7zM14 3v5h5" },
        { to: "/san-pham", label: "Sản phẩm", icon: "M3 7.5 12 3l9 4.5v9L12 21l-9-4.5zM12 12v9M3.5 8 12 12l8.5-4" }
      ]
    },
    {
      id: "media",
      label: "Quản lý hình ảnh",
      items: [
        { to: "/thu-vien", label: "Thư viện ảnh", icon: "M4 5h16v14H4zM4 16l4.5-4 3 3 2.5-2.5L20 16M9 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" }
      ]
    },
    {
      id: "contact",
      label: "Liên hệ",
      items: [
        { to: "/dat-lich", label: "Thư liên hệ", icon: "M5 5h14v15H5zM5 10h14M9 3v4M15 3v4" },
        { to: "/truy-cap", label: "Lượt truy cập", icon: "M4 19V5h16v14zM8 15v-4M12 15V8M16 15v-6" }
      ]
    },
    {
      id: "system",
      label: "Thiết lập thông tin",
      items: [
        { to: "/cai-dat", label: "Cài đặt website", icon: "M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM4 12h2M18 12h2M12 4v2M12 18v2" },
        { to: "/tai-khoan", label: "Tài khoản", icon: "M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zM5 20a7 7 0 0 1 14 0" }
      ]
    }
  ];

  var openGroups = {};

  function mark(logoClass) {
    return '<img class="' + logoClass + '" src="' + LOGO + '" alt="Bứt Phá Marketing" width="44" height="44" />';
  }

  function eye(off) {
    if (off) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3l18 18"/><path d="M10.6 10.6a3 3 0 0 0 4.2 4.2"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-3.2 4.3"/><path d="M6.1 6.1C3.7 8 2 12 2 12s3.5 7 10 7a10.4 10.4 0 0 0 4.4-1"/></svg>';
    }
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>';
  }

  function loginView() {
    var cur = SLIDES[slide];
    return (
      '<div class="vns-login">' +
        '<div class="vns-login-flex">' +
          '<section class="vns-login-box">' +
            "<span></span><span></span><span></span><span></span>" +
            '<form class="vns-login-form" data-act="login">' +
              '<div class="vns-login-logo">' +
                mark("login-bp-logo") +
                "<strong>BỨT PHÁ MARKETING</strong>" +
                "<small>CMS khách hàng · Đèn năng lượng NOMA LIGHT</small>" +
              "</div>" +
              "<h1>Đăng nhập</h1>" +
              '<div class="vns-field is-user"><input type="text" name="username" placeholder="Tài khoản" value="' + esc(loginUser) + '" autocomplete="username" required /></div>' +
              '<div class="vns-field is-pass">' +
                '<input type="' + (showPass ? "text" : "password") + '" name="password" placeholder="Mật khẩu" value="' + esc(loginPass) + '" autocomplete="current-password" required />' +
                '<button type="button" class="vns-eye" data-act="toggle-pass" aria-label="' + (showPass ? "Ẩn mật khẩu" : "Hiện mật khẩu") + '">' + eye(showPass) + "</button>" +
              "</div>" +
              (loginError ? '<p class="vns-error">' + esc(loginError) + "</p>" : "") +
              '<button type="submit">Đăng nhập</button>' +
              '<div class="vns-web"><a href="/" target="_blank" rel="noreferrer">Truy cập trang web</a></div>' +
              '<p class="vns-note">Trong trường hợp có vấn đề vui lòng liên hệ hotline: <strong>093.741.7982</strong> để được hỗ trợ</p>' +
            "</form>" +
          "</section>" +
          '<aside class="vns-login-slide">' +
            '<div class="vns-login-slide-inner">' +
              '<button type="button" class="vns-nav prev" data-act="slide-prev" aria-label="Trước"></button>' +
              '<article class="vns-card"><div>' +
                mark("login-bp-logo") +
                "<p>" + esc(cur.title) + "</p>" +
                "<h2>" + esc(cur.accent) + "</h2><ul>" +
                cur.points.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") +
              "</ul></div></article>" +
              '<button type="button" class="vns-nav next" data-act="slide-next" aria-label="Sau"></button>' +
            "</div>" +
          "</aside>" +
        "</div>" +
      "</div>"
    );
  }

  function navHtml() {
    var p = path();
    return NAV.map(function (group) {
      if (!group.id) {
        return group.items.map(function (item) {
          var active = p === item.to ? " active" : "";
          return '<a href="/adminbp' + (item.to === "/" ? "/" : item.to + "/") + '" data-nav="' + item.to + '" class="' + active.trim() + '">' + ico(item.icon) + "<span>" + item.label + "</span></a>";
        }).join("");
      }
      var open = openGroups[group.id] || group.items.some(function (it) { return p === it.to; });
      return (
        '<div class="adminbp-nav-group' + (open ? " is-open" : "") + '">' +
          '<button type="button" class="adminbp-nav-group-btn" data-group="' + group.id + '">' +
            ico("M4 7h16M4 12h16M4 17h10") + "<span>" + group.label + '</span><i class="adminbp-caret" aria-hidden></i>' +
          "</button>" +
          (open
            ? group.items.map(function (item) {
                var active = p === item.to ? " active" : "";
                return '<a href="/adminbp' + item.to + '/" data-nav="' + item.to + '" class="' + active.trim() + '">' + ico(item.icon) + "<span>" + item.label + "</span></a>";
              }).join("")
            : "") +
        "</div>"
      );
    }).join("");
  }

  function shell(inner) {
    var acc = NomaCms.getAccount();
    return (
      '<div class="adminbp-shell">' +
        '<aside class="adminbp-sidebar">' +
          '<div class="adminbp-brand">' + mark("adminbp-brand-logo") +
            "<div><strong>NOMA LIGHT</strong><small>Administrator</small></div>" +
          "</div>" +
          '<p class="adminbp-nav-title">Slidebar</p>' +
          '<nav class="adminbp-nav">' + navHtml() + "</nav>" +
        "</aside>" +
        '<div class="adminbp-body">' +
          '<header class="adminbp-topbar">' +
            '<p class="adminbp-hello">Xin chào, <strong>' + esc(acc.user) + "</strong> !</p>" +
            '<div class="adminbp-topbar-actions">' +
              '<a href="/" target="_blank" rel="noreferrer">Truy cập website</a>' +
              '<button type="button" data-act="logout">Đăng xuất</button>' +
            "</div>" +
          "</header>" +
          '<main class="adminbp-main">' + inner + "</main>" +
          '<footer class="adminbp-footer">' +
            "<strong>CÔNG TY TNHH SX-TM NOMA LIGHT</strong>" +
            "<p>Administrator · namalight.vercel.app · Bứt Phá Marketing</p>" +
          "</footer>" +
        "</div>" +
      "</div>"
    );
  }

  function field(name, label, value, extra) {
    extra = extra || "";
    return (
      '<label class="adminbp-field ' + extra + '"><span>' + esc(label) + "</span>" +
      '<input name="' + name + '" value="' + esc(value || "") + '" /></label>'
    );
  }
  function area(name, label, value) {
    return (
      '<label class="adminbp-field span-2"><span>' + esc(label) + "</span>" +
      "<textarea name=\"" + name + "\" rows=\"6\">" + esc(value || "") + "</textarea></label>"
    );
  }

  function visitsPanel(compact) {
    var stats = NomaCms.visitStats();
    var cards = [
      ["Hôm nay", stats.today],
      ["Hôm qua", stats.yesterday],
      ["7 ngày", stats.week],
      ["30 ngày", stats.month],
      ["Tổng", stats.total]
    ];
    var maxDay = Math.max(1, ...(stats.days || []).map(function (d) { return d.views; }));
    return (
      '<div class="adminbp-visits">' +
        '<div class="adminbp-visit-stats">' +
          cards.map(function (c) {
            return '<article class="adminbp-status-card is-ok"><small>' + c[0] + "</small><strong>" + fmt(c[1].views) + "</strong><span>" + fmt(c[1].visitors) + " khách</span></article>";
          }).join("") +
        "</div>" +
        (compact ? "" : '<div class="adminbp-visit-chart">' + stats.days.map(function (d) {
          return '<div class="adminbp-visit-bar"><span style="height:' + Math.max(6, (d.views / maxDay) * 100) + '%"></span><small>' + d.day.slice(8) + "</small></div>";
        }).join("") + "</div>") +
        '<div class="adminbp-visit-cols"><section><h3>Trang xem nhiều</h3>' +
        (stats.pages.length
          ? '<ol class="adminbp-visit-list">' + stats.pages.slice(0, compact ? 6 : 12).map(function (p) {
              return "<li><span>" + esc(p.path) + "</span><strong>" + fmt(p.views) + "</strong></li>";
            }).join("") + "</ol>"
          : '<p class="muted">Chưa có dữ liệu. Mở trang khách một lần để bắt đầu đếm.</p>') +
        "</section><section><h3>Lượt xem gần đây</h3>" +
        (stats.recent.length
          ? '<ol class="adminbp-visit-list">' + stats.recent.slice(0, compact ? 6 : 20).map(function (p) {
              return "<li><span>" + esc(p.path) + "<small>" + esc(fmtTime(p.at)) + "</small></span></li>";
            }).join("") + "</ol>"
          : '<p class="muted">Chưa có lượt xem gần đây.</p>') +
        "</section></div></div>"
    );
  }

  function listEditor(kind, title, hint, fields) {
    var items = NomaCms.getData()[kind] || [];
    return (
      "<h1>" + esc(title) + "</h1><p class=\"muted\">" + esc(hint) + "</p>" +
      '<p class="adminbp-item-actions"><button type="button" data-act="add-item" data-kind="' + kind + '">Thêm mục</button></p>' +
      (items.length ? items.map(function (it, i) {
        return (
          '<article class="adminbp-card" style="margin:12px 0;padding:16px;border:1px solid #e5e7eb;border-radius:12px">' +
            '<form data-act="save-item" data-kind="' + kind + '" data-i="' + i + '">' +
              '<div class="adminbp-grid">' +
                fields.map(function (f) {
                  return f.area ? area(f.key, f.label, it[f.key]) : field(f.key, f.label, it[f.key]);
                }).join("") +
              "</div>" +
              '<div class="adminbp-item-actions" style="margin-top:12px">' +
                '<button type="submit">Lưu</button>' +
                '<button type="button" class="danger" data-act="del-item" data-kind="' + kind + '" data-i="' + i + '">Xóa</button>' +
              "</div>" +
            "</form>" +
          "</article>"
        );
      }).join("") : '<p class="muted">Chưa có mục. Bấm Thêm mục để tạo.</p>')
    );
  }

  function pageView() {
    var p = path();
    var cms = NomaCms.getData();
    var QUICK = [
      { href: "/cai-dat", label: "Cấu hình Website", desc: "Xem chi tiết", tone: "gold" },
      { href: "/tai-khoan", label: "Tài khoản", desc: "Xem chi tiết", tone: "green" },
      { href: "/tai-khoan", label: "Đổi mật khẩu", desc: "Xem chi tiết", tone: "blue" },
      { href: "/dat-lich", label: "Thư liên hệ", desc: "Xem chi tiết", tone: "violet" },
      { href: "/truy-cap", label: "Lượt truy cập", desc: "Khách xem website", tone: "blue" }
    ];
    var LINKS = [
      { href: "/trang-chu", label: "Trang chủ", desc: "Hero, slogan" },
      { href: "/du-an", label: "Dự án", desc: "Công trình chiếu sáng" },
      { href: "/san-pham", label: "Sản phẩm", desc: "Danh mục đèn" },
      { href: "/tin-tuc", label: "Tin tức", desc: "Bài viết" },
      { href: "/trang", label: "Trang nội dung", desc: "Giới thiệu, liên hệ" },
      { href: "/thu-vien", label: "Thư viện", desc: "Ảnh website" },
      { href: "/truy-cap", label: "Lượt truy cập", desc: "Khách xem website" }
    ];

    if (p === "/") {
      return (
        '<div class="adminbp-dash"><h1>Bảng điều khiển</h1>' +
        '<nav class="adminbp-quick">' +
          QUICK.map(function (item) {
            return '<a class="adminbp-quick-card is-' + item.tone + '" href="/adminbp' + item.href + '/" data-nav="' + item.href + '"><span class="adminbp-quick-ico"></span><strong>' + item.label + "</strong><small>" + item.desc + "</small></a>";
          }).join("") +
        "</nav>" +
        '<div class="adminbp-status-grid">' +
          '<article class="adminbp-status-card is-ok"><small>Website</small><strong>NOMA LIGHT</strong><span>namalight.vercel.app</span></article>' +
          '<article class="adminbp-status-card is-ok"><small>Catalogue</small><strong>8 trang + PDF</strong><span>Tải về đã bật</span></article>' +
          '<article class="adminbp-status-card is-ok"><small>Liên hệ</small><strong>' + NomaCms.getLeads().length + " yêu cầu</strong><span>Lưu trên trình duyệt quản trị</span></article>" +
        "</div>" +
        '<h2 class="adminbp-dash-sub">Lượt truy cập khách hàng</h2>' + visitsPanel(true) +
        '<p><a href="/adminbp/truy-cap/" data-nav="/truy-cap">Xem chi tiết lượt truy cập</a></p>' +
        '<h2 class="adminbp-dash-sub">Quản lý nội dung</h2>' +
        '<nav class="adminbp-shortcuts">' +
          LINKS.map(function (item) {
            return '<a href="/adminbp' + item.href + '/" data-nav="' + item.href + '"><strong>' + item.label + "</strong><small>" + item.desc + "</small></a>";
          }).join("") +
        "</nav>" +
        '<div class="adminbp-item-actions" style="margin-top:20px">' +
          '<button type="button" data-act="export">Xuất JSON</button>' +
          '<button type="button" data-act="import">Nhập JSON</button>' +
          '<button type="button" class="danger" data-act="reset">Khôi phục gốc</button>' +
          '<input type="file" accept="application/json" hidden data-import />' +
        "</div>" +
        (dashMsg ? '<p class="adminbp-dash-msg">' + esc(dashMsg) + "</p>" : "") +
        "</div>"
      );
    }
    if (p === "/cai-dat") {
      var s = cms.site;
      return (
        '<div class="adminbp-page-head"><h1>Cài đặt website</h1><p>Hotline, địa chỉ và mạng xã hội — hiện trên header, footer.</p></div>' +
        '<form class="adminbp-form" data-act="save-site"><div class="adminbp-grid">' +
          field("name", "Tên công ty", s.name) +
          field("shortName", "Tên ngắn", s.shortName) +
          field("tagline", "Tagline", s.tagline, "span-2") +
          field("contactName", "Người liên hệ", s.contactName) +
          field("hotline", "Hotline", s.hotline) +
          field("email", "Email", s.email) +
          field("zalo", "Zalo", s.zalo) +
          field("facebook", "Facebook", s.facebook) +
          field("youtube", "YouTube", s.youtube) +
          field("profilePdf", "File catalogue PDF", s.profilePdf, "span-2") +
          field("address", "Địa chỉ", s.address, "span-2") +
        "</div>" +
        '<div class="adminbp-item-actions" style="margin-top:16px"><button type="submit">Lưu</button></div>' +
        (formMsg ? "<p class=\"adminbp-edit-msg\">" + esc(formMsg) + "</p>" : "") +
        "</form>"
      );
    }
    if (p === "/trang-chu") {
      var h = cms.home;
      return (
        "<h1>Trang chủ</h1><p class=\"muted\">Slogan và mô tả khối hero.</p>" +
        '<form class="adminbp-form" data-act="save-home"><div class="adminbp-grid">' +
          field("kicker", "Dòng nhỏ", h.kicker) +
          field("title", "Tiêu đề", h.title) +
          field("lead", "Mô tả", h.lead, "span-2") +
        "</div><div class=\"adminbp-item-actions\" style=\"margin-top:16px\"><button type=\"submit\">Lưu</button></div>" +
        (formMsg ? "<p class=\"adminbp-edit-msg\">" + esc(formMsg) + "</p>" : "") +
        "</form>"
      );
    }
    if (p === "/trang") {
      return (
        "<h1>Giới thiệu / Liên hệ</h1>" +
        '<form class="adminbp-form" data-act="save-pages"><div class="adminbp-grid">' +
          area("about", "Nội dung giới thiệu", cms.pages.about) +
          area("contact", "Ghi chú liên hệ", cms.pages.contact) +
        "</div><div class=\"adminbp-item-actions\" style=\"margin-top:16px\"><button type=\"submit\">Lưu</button></div>" +
        (formMsg ? "<p class=\"adminbp-edit-msg\">" + esc(formMsg) + "</p>" : "") +
        "</form>"
      );
    }
    if (p === "/tai-khoan") {
      var a = NomaCms.getAccount();
      return (
        "<h1>Tài khoản</h1>" +
        '<form class="adminbp-form" data-act="save-account"><div class="adminbp-grid">' +
          field("user", "Tài khoản", a.user) +
          field("password", "Mật khẩu", a.password) +
        "</div><div class=\"adminbp-item-actions\" style=\"margin-top:16px\"><button type=\"submit\">Lưu</button></div>" +
        (formMsg ? "<p class=\"adminbp-edit-msg\">" + esc(formMsg) + "</p>" : "") +
        "</form>"
      );
    }
    if (p === "/dat-lich") {
      var leads = NomaCms.getLeads();
      return (
        "<h1>Thư liên hệ</h1><p class=\"muted\">Form trang Liên hệ / Đặt lịch lưu tại đây.</p>" +
        (leads.length
          ? '<ol class="adminbp-visit-list">' + leads.map(function (l) {
              return "<li><span><strong>" + esc(l.name || "Không tên") + "</strong> · " + esc(l.phone || "") + "<small>" + esc(fmtTime(l.at)) + " · " + esc(l.need || l.note || "") + "</small></span>" +
                '<button type="button" class="danger" data-act="del-lead" data-id="' + esc(l.id) + '">Xóa</button></li>';
            }).join("") + "</ol>"
          : '<p class="muted">Chưa có yêu cầu.</p>')
      );
    }
    if (p === "/truy-cap") {
      return "<h1>Lượt truy cập khách hàng</h1><p class=\"muted\">Số khách xem website (không tính trang quản trị).</p>" + visitsPanel(false);
    }
    if (p === "/du-an") {
      return listEditor("projects", "Dự án", "Các công trình / không gian chiếu sáng.", [
        { key: "title", label: "Tên" },
        { key: "type", label: "Loại" },
        { key: "summary", label: "Mô tả", area: true }
      ]);
    }
    if (p === "/tin-tuc") {
      return listEditor("news", "Tin tức", "Bài viết hiển thị trên mục Tin tức.", [
        { key: "title", label: "Tiêu đề" },
        { key: "date", label: "Ngày" },
        { key: "excerpt", label: "Tóm tắt", area: true }
      ]);
    }
    if (p === "/san-pham") {
      return listEditor("products", "Sản phẩm", "Ghi chú / tên dòng đèn (catalogue vẫn là nguồn chính thức).", [
        { key: "name", label: "Tên" },
        { key: "sku", label: "Mã" },
        { key: "blurb", label: "Mô tả", area: true }
      ]);
    }
    if (p === "/thu-vien") {
      return (
        "<h1>Thư viện ảnh</h1><p class=\"muted\">Ảnh đang dùng trên website tĩnh. Tải file lên máy chủ rồi dán đường dẫn vào các mục nội dung.</p>" +
        "<ul class=\"adminbp-visit-list\">" +
          ["assets/noma-hero-street.jpg", "assets/noma-hero-villa.jpg", "assets/catalogue/p01.png", "assets/noma-qr.png"].map(function (x) {
            return "<li><span>/" + x + "</span></li>";
          }).join("") +
        "</ul>"
      );
    }
    return "<h1>Không tìm thấy</h1><p><a href=\"/adminbp/\" data-nav=\"/\">Về bảng điều khiển</a></p>";
  }

  function render() {
    document.title = "Quản trị | NOMA LIGHT";
    var p = path();
    if (p === "/login") {
      if (NomaCms.isAuthed()) {
        go("/", true);
        return;
      }
      root.innerHTML = loginView();
      return;
    }
    if (!NomaCms.isAuthed()) {
      go("/login", true);
      return;
    }
    root.innerHTML = shell(pageView());
  }

  function formObj(form) {
    var o = {};
    new FormData(form).forEach(function (v, k) { o[k] = String(v); });
    return o;
  }

  root.addEventListener("submit", function (ev) {
    var form = ev.target.closest("form");
    if (!form) return;
    ev.preventDefault();
    var act = form.getAttribute("data-act");
    if (act === "login") {
      var o = formObj(form);
      loginUser = o.username;
      loginPass = o.password;
      loginError = NomaCms.login(o.username, o.password) ? "" : "Tài khoản hoặc mật khẩu không đúng";
      if (!loginError) go("/", true);
      else render();
      return;
    }
    if (act === "save-site") {
      NomaCms.patchData({ site: formObj(form) });
      formMsg = "Đã lưu cài đặt";
      render();
      return;
    }
    if (act === "save-home") {
      NomaCms.patchData({ home: formObj(form) });
      formMsg = "Đã lưu trang chủ";
      render();
      return;
    }
    if (act === "save-pages") {
      NomaCms.patchData({ pages: formObj(form) });
      formMsg = "Đã lưu trang";
      render();
      return;
    }
    if (act === "save-account") {
      NomaCms.setAccount(formObj(form));
      formMsg = "Đã cập nhật tài khoản";
      render();
      return;
    }
    if (act === "save-item") {
      var kind = form.getAttribute("data-kind");
      var i = Number(form.getAttribute("data-i"));
      var list = (NomaCms.getData()[kind] || []).slice();
      list[i] = Object.assign({}, list[i], formObj(form));
      var patch = {};
      patch[kind] = list;
      NomaCms.patchData(patch);
      formMsg = "Đã lưu";
      render();
    }
  });

  root.addEventListener("click", function (ev) {
    var btn = ev.target.closest("[data-act],[data-nav],[data-group]");
    if (!btn) return;
    if (btn.hasAttribute("data-nav")) {
      ev.preventDefault();
      formMsg = "";
      dashMsg = "";
      go(btn.getAttribute("data-nav"));
      return;
    }
    var act = btn.getAttribute("data-act");
    var group = btn.getAttribute("data-group");
    if (group) {
      openGroups[group] = !openGroups[group];
      render();
      return;
    }
    if (act === "toggle-pass") {
      showPass = !showPass;
      render();
      return;
    }
    if (act === "slide-prev") {
      slide = (slide + SLIDES.length - 1) % SLIDES.length;
      render();
      return;
    }
    if (act === "slide-next") {
      slide = (slide + 1) % SLIDES.length;
      render();
      return;
    }
    if (act === "logout") {
      NomaCms.logout();
      go("/login", true);
      return;
    }
    if (act === "export") {
      var blob = new Blob([JSON.stringify(NomaCms.getData(), null, 2)], { type: "application/json" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "noma-light-cms.json";
      a.click();
      return;
    }
    if (act === "import") {
      var input = root.querySelector("[data-import]");
      if (input) input.click();
      return;
    }
    if (act === "reset") {
      if (confirm("Khôi phục nội dung gốc?")) {
        localStorage.removeItem(NomaCms.KEYS.data);
        dashMsg = "Đã khôi phục nội dung gốc";
        render();
      }
      return;
    }
    if (act === "add-item") {
      var kind = btn.getAttribute("data-kind");
      var list = (NomaCms.getData()[kind] || []).slice();
      list.push({ title: "Mục mới", name: "Mục mới" });
      var patch = {};
      patch[kind] = list;
      NomaCms.patchData(patch);
      render();
      return;
    }
    if (act === "del-item") {
      var kind2 = btn.getAttribute("data-kind");
      var idx = Number(btn.getAttribute("data-i"));
      var list2 = (NomaCms.getData()[kind2] || []).slice();
      list2.splice(idx, 1);
      var p2 = {};
      p2[kind2] = list2;
      NomaCms.patchData(p2);
      render();
      return;
    }
    if (act === "del-lead") {
      NomaCms.removeLead(btn.getAttribute("data-id"));
      render();
    }
  });

  root.addEventListener("change", function (ev) {
    var input = ev.target.closest("[data-import]");
    if (!input || !input.files || !input.files[0]) return;
    input.files[0].text().then(function (t) {
      try {
        NomaCms.setData(Object.assign(NomaCms.getData(), JSON.parse(t)));
        dashMsg = "Đã nhập dữ liệu CMS";
      } catch (e) {
        dashMsg = "File JSON không hợp lệ";
      }
      render();
    });
  });

  root.addEventListener("input", function (ev) {
    var t = ev.target;
    if (!t || !t.name) return;
    if (t.name === "username") loginUser = t.value;
    if (t.name === "password") loginPass = t.value;
  });

  window.addEventListener("popstate", render);
  render();
})();
