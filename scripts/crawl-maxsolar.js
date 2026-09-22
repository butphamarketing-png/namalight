const fs = require("fs");
const path = require("path");

const ROOT = "https://maxsolar.vn";
const OUT_DIR = path.join(__dirname, "..", "data");
const UA = { "User-Agent": "noma-light-research/1.0", Accept: "text/html,application/json" };

function decode(s) {
  return String(s || "")
    .replace(/&#8211;/g, "–")
    .replace(/&#8363;/g, "₫")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#038;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function money(n) {
  const s = String(n || "").trim();
  if (!s || s === "0") return 0;
  const digits = s.replace(/[^\d]/g, "");
  const v = Number(digits);
  return Number.isFinite(v) && v > 0 ? v : 0;
}

function fmt(n) {
  return money(n) ? money(n).toLocaleString("vi-VN") + " ₫" : "Liên hệ";
}

function skuFromHtml(html) {
  const m = String(html || "").match(/Mã sản phẩm:\s*<\/?strong>\s*([^<]+)/i) || String(html || "").match(/Mã sản phẩm:\s*<strong>([^<]+)/i);
  return m ? decode(m[1].replace(/<\/?strong>/gi, "")) : "";
}

async function getJson(url) {
  const r = await fetch(url, { headers: { ...UA, Accept: "application/json" } });
  const text = await r.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch (_) {}
  return { status: r.status, headers: r.headers, json, text };
}

async function getHtml(url) {
  const r = await fetch(url, { headers: UA, redirect: "follow" });
  return { status: r.status, finalUrl: r.url, text: await r.text() };
}

function locList(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1])
    .filter((u) => !u.includes("/uploads/") && !u.includes("sitemap"));
}

function variationIds(product) {
  const list = product.variations;
  if (!Array.isArray(list) || !list.length) return [];
  return list.map((v) => (typeof v === "number" ? v : v && v.id)).filter((id) => Number.isFinite(Number(id)));
}

function parseJsonLdOffer(html) {
  const re = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  const nodes = [];
  while ((m = re.exec(html))) {
    try {
      nodes.push(JSON.parse(m[1]));
    } catch (_) {}
  }
  let product = null;
  let offer = null;
  const walk = (n) => {
    if (!n) return;
    if (Array.isArray(n)) return n.forEach(walk);
    if (typeof n !== "object") return;
    if (n["@type"] === "Product") product = n;
    if (n["@type"] === "Offer" && n.price != null) offer = n;
    if (n.offers) walk(n.offers);
    if (n["@graph"]) walk(n["@graph"]);
  };
  nodes.forEach(walk);
  return { product, offer };
}

function parseSummary(html) {
  const sum = (html.match(/entry-summary[\s\S]{0,4500}/) || [""])[0];
  const contact = /price-contact/i.test(sum);
  const ins = money((sum.match(/<ins[\s\S]*?<bdi>([^<]+)/i) || [])[1]);
  const del = money((sum.match(/<del[\s\S]*?<bdi>([^<]+)/i) || [])[1]);
  const plain = money((sum.match(/class="price"[\s\S]*?<bdi>([^<]+)/i) || [])[1]);
  const hetHang = /Hết hàng|out-of-stock/i.test(sum);
  const conHang = /Còn hàng/i.test(sum);
  return {
    contact,
    html_price: contact ? 0 : ins || plain || 0,
    html_regular: del || 0,
    het_hang: hetHang,
    con_hang: conHang && !hetHang,
  };
}

async function fetchVariations(product) {
  if (product.type !== "variable" && !product.has_options) return [];
  let ids = variationIds(product);
  if (!ids.length) {
    const { json } = await getJson(`${ROOT}/wp-json/wc/store/v1/products/${product.id}`);
    ids = variationIds(json || {});
  }
  const out = [];
  for (const vid of ids) {
    const { status, json } = await getJson(`${ROOT}/wp-json/wc/store/v1/products/${vid}`);
    if (status !== 200 || !json || !json.id) continue;
    const attrPairs = (json.attributes || []).map((a) => {
      const value = a.value || (a.terms && a.terms[0] && (a.terms[0].name || a.terms[0])) || "";
      return { name: a.name, value: decode(value) };
    }).filter((a) => a.value);
    out.push({
      id: json.id,
      sku: decode(json.sku || ""),
      name: decode(json.name || ""),
      permalink: json.permalink,
      attributes: attrPairs,
      option_label: attrPairs.map((a) => a.value).join(" / "),
      price: money(json.prices && json.prices.price),
      regular_price: money(json.prices && json.prices.regular_price),
      sale_price: money(json.prices && json.prices.sale_price),
      on_sale: Boolean(json.on_sale),
      in_stock: json.is_in_stock !== false,
    });
  }
  return out;
}

async function fetchAllStore(qs) {
  const first = await getJson(`${ROOT}/wp-json/wc/store/v1/products?per_page=100&page=1${qs ? "&" + qs : ""}`);
  const total = Number(first.headers.get("X-WP-Total") || (first.json || []).length || 0);
  const pages = Math.max(1, Number(first.headers.get("X-WP-TotalPages") || 1));
  let items = Array.isArray(first.json) ? first.json.slice() : [];
  for (let page = 2; page <= pages; page++) {
    const { json } = await getJson(`${ROOT}/wp-json/wc/store/v1/products?per_page=100&page=${page}${qs ? "&" + qs : ""}`);
    if (Array.isArray(json)) items = items.concat(json);
  }
  return { total, items };
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const store = await fetchAllStore("");
  const oos = await fetchAllStore("stock_status=outofstock");
  const onsale = await fetchAllStore("on_sale=true");
  const instock = await fetchAllStore("stock_status=instock");
  const wp = await getJson(`${ROOT}/wp-json/wp/v2/product?per_page=100`);
  const catsRes = await getJson(`${ROOT}/wp-json/wc/store/v1/products/categories?per_page=100`);
  const sitemap = locList((await getHtml(`${ROOT}/product-sitemap.xml`)).text);

  const oosIds = new Set(oos.items.map((p) => p.id));
  const saleIds = new Set(onsale.items.map((p) => p.id));
  const wpById = new Map((Array.isArray(wp.json) ? wp.json : []).map((p) => [p.id, p]));

  const products = [];
  for (const p of store.items) {
    const variations = await fetchVariations(p);
    const page = await getHtml(p.permalink);
    const summary = parseSummary(page.text);
    const { product: ldProduct, offer } = parseJsonLdOffer(page.text);
    const wpPost = wpById.get(p.id);
    const prices = p.prices || {};
    const sku = decode(p.sku || "") || skuFromHtml(p.short_description) || skuFromHtml(page.text);
    const apiPrice = money(prices.price);
    const htmlPrice = summary.html_price;
    const jsonldPrice = money(offer && offer.price);
    const contact = summary.contact || (!apiPrice && !htmlPrice);
    const current = contact ? 0 : htmlPrice || apiPrice || jsonldPrice;
    const regular = summary.html_regular || money(prices.regular_price);
    const onSale = saleIds.has(p.id);
    const inStock = !oosIds.has(p.id) && !summary.het_hang;
    const discount = regular && current && regular > current ? Math.round((1 - current / regular) * 100) : 0;

    products.push({
      id: p.id,
      type: p.type,
      name: decode(p.name),
      sku,
      slug: p.slug,
      permalink: p.permalink,
      date: wpPost && wpPost.date,
      modified: wpPost && wpPost.modified,
      short_description: p.short_description || "",
      description: p.description || "",
      price: current,
      regular_price: regular,
      sale_price: onSale ? current : 0,
      discount_pct: discount,
      price_txt: fmt(current),
      regular_txt: regular ? fmt(regular) : "",
      on_sale: onSale,
      price_contact: contact,
      in_stock: inStock,
      stock_label: inStock ? "Còn hàng" : "Hết hàng",
      html_price: htmlPrice,
      api_price: apiPrice,
      jsonld_price: jsonldPrice,
      jsonld_until: (offer && offer.priceValidUntil) || "",
      jsonld_availability: (offer && offer.availability) || "",
      price_verified: contact ? apiPrice === 0 && jsonldPrice === 0 : current === apiPrice && (!jsonldPrice || jsonldPrice === current),
      http_status: page.status,
      average_rating: p.average_rating,
      review_count: p.review_count,
      has_options: Boolean(p.has_options),
      categories: (p.categories || []).map((c) => ({ id: c.id, name: decode(c.name), slug: c.slug })),
      images: (p.images || []).map((img) => ({ src: img.src || img.url, alt: decode(img.alt || img.name || "") })),
      attributes: (p.attributes || []).map((a) => ({
        name: a.name,
        terms: (a.terms || []).map((t) => decode(typeof t === "string" ? t : t.name)).filter(Boolean),
      })),
      variations,
      jsonld_name: ldProduct && ldProduct.name ? decode(ldProduct.name) : "",
    });
  }

  products.sort((a, b) => a.name.localeCompare(b.name, "vi"));

  const apiNorm = new Set(products.map((p) => p.permalink.replace(/\/$/, "")));
  const smNorm = new Set(sitemap.map((u) => u.replace(/\/$/, "")));

  const catalog = products.map((p) => ({
    id: p.id,
    sku: p.sku,
    name: p.name,
    type: p.type,
    slug: p.slug,
    category: (p.categories[0] && p.categories[0].name) || "",
    categories: p.categories.map((c) => c.name),
    permalink: p.permalink,
    image: p.images[0] && p.images[0].src,
    price: p.price,
    regular_price: p.regular_price,
    discount_pct: p.discount_pct,
    price_txt: p.price_txt,
    regular_txt: p.regular_txt,
    on_sale: p.on_sale,
    price_contact: p.price_contact,
    in_stock: p.in_stock,
    stock_label: p.stock_label,
    sale_until: p.jsonld_until,
    price_verified: p.price_verified,
    variation_count: p.variations.length,
    variations: p.variations.map((v) => ({
      id: v.id,
      option: v.option_label,
      price: v.price,
      price_txt: fmt(v.price),
      in_stock: v.in_stock,
    })),
  }));

  const priced = catalog.filter((p) => p.price > 0);
  const summary = {
    source: ROOT,
    crawled_at: new Date().toISOString(),
    note: "Research snapshot of maxsolar.vn. Do not publish these SKUs, watt labels, or prices on NOMA LIGHT.",
    product_count_api: store.total,
    product_count_crawled: products.length,
    wp_v2_total: wp.headers.get("X-WP-Total"),
    sitemap_product_urls: sitemap.length,
    in_api_not_sitemap: products.filter((p) => !smNorm.has(p.permalink.replace(/\/$/, ""))).map((p) => ({ id: p.id, sku: p.sku, name: p.name })),
    in_sitemap_not_api: sitemap.filter((u) => !apiNorm.has(u.replace(/\/$/, ""))),
    priced_count: priced.length,
    contact_price_count: catalog.filter((p) => p.price_contact).length,
    on_sale_count: catalog.filter((p) => p.on_sale).length,
    in_stock_count: instock.total,
    out_of_stock_count: oos.total,
    variable_count: catalog.filter((p) => p.variation_count).length,
    price_verified_count: products.filter((p) => p.price_verified).length,
    price_mismatch_count: products.filter((p) => !p.price_verified).length,
    price_min: priced.length ? Math.min(...priced.map((p) => p.price)) : 0,
    price_max: priced.length ? Math.max(...priced.map((p) => p.price)) : 0,
    out_of_stock: catalog.filter((p) => !p.in_stock).map((p) => ({ sku: p.sku, name: p.name, price_txt: p.price_txt })),
    categories: (Array.isArray(catsRes.json) ? catsRes.json : [])
      .map((c) => ({ id: c.id, name: decode(c.name), slug: c.slug, count: c.count, parent: c.parent }))
      .sort((a, b) => (b.count || 0) - (a.count || 0)),
  };

  fs.writeFileSync(path.join(OUT_DIR, "maxsolar-products.json"), JSON.stringify(products, null, 2), "utf8");
  fs.writeFileSync(path.join(OUT_DIR, "maxsolar-prices.json"), JSON.stringify({ summary, products: catalog }, null, 2), "utf8");

  const csvHeader = [
    "id",
    "sku",
    "name",
    "type",
    "category",
    "price",
    "regular_price",
    "discount_pct",
    "price_txt",
    "on_sale",
    "price_contact",
    "in_stock",
    "stock_label",
    "sale_until",
    "price_verified",
    "variation_count",
    "permalink",
  ].join(",");
  const csvRows = catalog.map((p) =>
    [
      p.id,
      JSON.stringify(p.sku || ""),
      JSON.stringify(p.name),
      p.type,
      JSON.stringify(p.category),
      p.price,
      p.regular_price,
      p.discount_pct,
      JSON.stringify(p.price_txt),
      p.on_sale,
      p.price_contact,
      p.in_stock,
      JSON.stringify(p.stock_label),
      JSON.stringify(p.sale_until || ""),
      p.price_verified,
      p.variation_count,
      p.permalink,
    ].join(",")
  );
  fs.writeFileSync(path.join(OUT_DIR, "maxsolar-prices.csv"), "\uFEFF" + [csvHeader, ...csvRows].join("\n"), "utf8");

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
