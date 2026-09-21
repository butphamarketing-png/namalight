(function (w) {
  var KEYS = {
    auth: "noma-cms-auth",
    account: "noma-cms-account",
    data: "noma-cms-data",
    leads: "noma-cms-leads",
    visits: "noma-cms-visits"
  };

  var defaultAccount = { user: "admin", password: "namalight.com" };

  var defaultSite = {
    name: "CÔNG TY TNHH SX-TM NOMA LIGHT",
    shortName: "NOMA LIGHT",
    tagline: "Chiếu Sáng Mọi Con Đường",
    hotline: "0974 169 141",
    phone: "0974 169 141",
    email: "info@nomalight.vn",
    zalo: "0974169141",
    facebook: "",
    youtube: "",
    address: "Tư vấn qua hotline / Zalo Minh Trọng",
    showroom: "",
    profilePdf: "/assets/catalogue/NOMA-LIGHT-Catalogue.pdf",
    contactName: "Minh Trọng"
  };

  var defaultHome = {
    kicker: "NOMA LIGHT",
    title: "Sáng hơn cho cuộc sống xanh",
    lead: "Giải pháp chiếu sáng bằng năng lượng mặt trời"
  };

  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getAccount() {
    return Object.assign({}, defaultAccount, read(KEYS.account, {}));
  }

  function setAccount(next) {
    write(KEYS.account, Object.assign({}, getAccount(), next));
  }

  function getData() {
    var d = read(KEYS.data, {});
    return {
      site: Object.assign({}, defaultSite, d.site || {}),
      home: Object.assign({}, defaultHome, d.home || {}),
      news: Array.isArray(d.news) ? d.news : [],
      products: Array.isArray(d.products) ? d.products : [],
      projects: Array.isArray(d.projects) ? d.projects : [],
      pages: Object.assign({ about: "", contact: "" }, d.pages || {}),
      reviews: Array.isArray(d.reviews) ? d.reviews : []
    };
  }

  function setData(next) {
    write(KEYS.data, next);
  }

  function patchData(partial) {
    var cur = getData();
    Object.keys(partial).forEach(function (k) {
      if (partial[k] && typeof partial[k] === "object" && !Array.isArray(partial[k])) {
        cur[k] = Object.assign({}, cur[k], partial[k]);
      } else {
        cur[k] = partial[k];
      }
    });
    setData(cur);
    return cur;
  }

  function getLeads() {
    return read(KEYS.leads, []);
  }

  function addLead(lead) {
    var list = getLeads();
    list.unshift(Object.assign({ at: Date.now(), id: String(Date.now()) }, lead));
    write(KEYS.leads, list.slice(0, 300));
  }

  function removeLead(id) {
    write(KEYS.leads, getLeads().filter(function (x) { return String(x.id) !== String(id); }));
  }

  function isAuthed() {
    return sessionStorage.getItem(KEYS.auth) === "1";
  }

  function login(user, password) {
    var acc = getAccount();
    var u = String(user || "").trim().toLowerCase();
    var ok =
      (u === acc.user.toLowerCase() || u === (acc.email || "").toLowerCase()) &&
      String(password) === String(acc.password);
    if (ok) sessionStorage.setItem(KEYS.auth, "1");
    return ok;
  }

  function logout() {
    sessionStorage.removeItem(KEYS.auth);
  }

  function dayKey(d) {
    return d.toISOString().slice(0, 10);
  }

  function trackVisit() {
    if (/\/adminbp(\/|$)/.test(location.pathname)) return;
    var now = new Date();
    var data = read(KEYS.visits, { total: 0, days: {}, pages: {}, recent: [], visitors: {} });
    var day = dayKey(now);
    var vid = sessionStorage.getItem("noma-vid");
    if (!vid) {
      vid = String(Date.now()) + Math.random().toString(16).slice(2);
      sessionStorage.setItem("noma-vid", vid);
    }
    data.total = (data.total || 0) + 1;
    data.days[day] = data.days[day] || { views: 0, visitors: {} };
    data.days[day].views += 1;
    data.days[day].visitors[vid] = 1;
    data.visitors[vid] = 1;
    var path = location.pathname || "/";
    data.pages[path] = (data.pages[path] || 0) + 1;
    data.recent = [{ path: path, title: document.title, at: now.toISOString() }].concat(data.recent || []).slice(0, 40);
    write(KEYS.visits, data);
  }

  function visitStats() {
    var data = read(KEYS.visits, { total: 0, days: {}, pages: {}, recent: [], visitors: {} });
    var today = dayKey(new Date());
    var y = new Date();
    y.setDate(y.getDate() - 1);
    var yesterday = dayKey(y);
    function range(n) {
      var views = 0, visitors = {};
      for (var i = 0; i < n; i++) {
        var d = new Date();
        d.setDate(d.getDate() - i);
        var rec = data.days[dayKey(d)] || { views: 0, visitors: {} };
        views += rec.views || 0;
        Object.keys(rec.visitors || {}).forEach(function (k) { visitors[k] = 1; });
      }
      return { views: views, visitors: Object.keys(visitors).length };
    }
    function pack(rec) {
      rec = rec || { views: 0, visitors: {} };
      return { views: rec.views || 0, visitors: Object.keys(rec.visitors || {}).length };
    }
    var days = [];
    for (var i = 13; i >= 0; i--) {
      var d = new Date();
      d.setDate(d.getDate() - i);
      var k = dayKey(d);
      days.push({ day: k, views: (data.days[k] && data.days[k].views) || 0 });
    }
    var pages = Object.keys(data.pages || {}).map(function (p) {
      return { path: p, views: data.pages[p] };
    }).sort(function (a, b) { return b.views - a.views; });
    return {
      today: pack(data.days[today]),
      yesterday: pack(data.days[yesterday]),
      week: range(7),
      month: range(30),
      total: { views: data.total || 0, visitors: Object.keys(data.visitors || {}).length },
      days: days,
      pages: pages,
      recent: data.recent || []
    };
  }

  function applyPublic() {
    var site = getData().site;
    var digits = String(site.hotline || "").replace(/\D/g, "");
    if (digits.length === 11 && digits.indexOf("84") === 0) digits = "0" + digits.slice(2);
    var pretty = site.hotline || "0974 169 141";
    document.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
      var href = a.getAttribute("href") || "";
      if (/0974169141|84974169141/.test(href.replace(/\D/g, ""))) {
        a.setAttribute("href", "tel:" + digits);
        if (/0974\s*169\s*141/.test(a.textContent) || a.classList.contains("site-call")) {
          a.innerHTML = a.innerHTML.replace(/0974\s*169\s*141/g, pretty);
        }
      }
    });
    document.querySelectorAll('a[href*="zalo.me/0974169141"]').forEach(function (a) {
      a.setAttribute("href", "https://zalo.me/" + (site.zalo || digits));
    });
    var co = document.querySelector(".footer-co");
    if (co && site.name) co.textContent = site.name;
    var tag = document.querySelector(".brand__tag");
    if (tag && site.tagline) tag.textContent = site.tagline;
    var brand = document.querySelector(".brand__name");
    if (brand && site.shortName) brand.innerHTML = site.shortName + "<sup>®</sup>";
  }

  w.NomaCms = {
    KEYS: KEYS,
    defaultSite: defaultSite,
    defaultHome: defaultHome,
    getAccount: getAccount,
    setAccount: setAccount,
    getData: getData,
    setData: setData,
    patchData: patchData,
    getLeads: getLeads,
    addLead: addLead,
    removeLead: removeLead,
    isAuthed: isAuthed,
    login: login,
    logout: logout,
    trackVisit: trackVisit,
    visitStats: visitStats,
    applyPublic: applyPublic
  };
})(window);
