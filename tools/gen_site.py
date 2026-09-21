# -*- coding: utf-8 -*-
"""Generate slug folders + HTML redirects for NOMA LIGHT static site."""
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
os.chdir(ROOT)

GROUPS = [
    ("den-duong-nang-luong-mat-troi", "Đèn đường năng lượng mặt trời", "Chiếu sáng đường phố, đường nội bộ và khu dân cư.", "assets/noma-page-street.png"),
    ("den-pha-nang-luong-mat-troi", "Đèn pha năng lượng mặt trời", "Chiếu sáng mạnh cho sân bãi, nhà xưởng và khuôn viên.", "assets/noma-flood.png"),
    ("den-san-vuon-nang-luong-mat-troi", "Đèn sân vườn năng lượng mặt trời", "Điểm nhấn ánh sáng cho lối đi và cảnh quan.", "assets/noma-garden.png"),
    ("den-dan-dung-nang-luong-mat-troi", "Đèn dân dụng năng lượng mặt trời", "Cổng, tường, ban công và nhu cầu gia đình.", "assets/noma-page-home.png"),
]

SKUS = [
    "nl-st60","nl-st100","nl-st150","nl-st200","nl-sp120","nl-sp200",
    "nl-fl100","nl-fl200","nl-fl300","nl-fl400",
    "nl-gd40","nl-gd60","nl-pl90",
    "nl-gt120","nl-wl50","nl-bc40","nl-pir80",
]

PROJECTS = [
    "tuyen-duong-noi-bo","khong-gian-san-vuon","khuon-vien-nha-xuong","cong-va-nha-o","khong-gian-cong-cong"
]
ARTICLES = [
    "chon-den-theo-khong-gian","den-duong-lien-the-va-roi-the","den-san-vuon-va-canh-quan","dat-lich-tu-van-chieu-sang"
]

HEAD = '''<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title} | NOMA LIGHT</title>
  <meta name="description" content="{desc}" />
  <link rel="stylesheet" href="{css}" />
</head>
<body data-page="{page}" data-root="{root}">
  <div id="header-root"></div>
  {body}
  <div id="footer-root"></div>
  <script src="{js}products.js"></script>
  <script src="{js}content.js"></script>
  <script src="{js}site.js"></script>
  <script src="{js}main.js"></script>
</body>
</html>
'''

def write(path, text):
    p = ROOT / path
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(text, encoding="utf-8")
    print("wrote", path)

def redir(src, dest):
    write(src, f'''<!DOCTYPE html>
<html lang="vi"><head>
<meta charset="UTF-8" />
<meta http-equiv="refresh" content="0; url={dest}" />
<link rel="canonical" href="{dest}" />
<script>location.replace({dest!r});</script>
<title>NOMA LIGHT</title>
</head><body><p><a href="{dest}">Tiếp tục</a></p></body></html>
''')

css2 = "../../css/style.css?v=29"
js2 = "../../js/"

for slug, title, lead, img in GROUPS:
    body = f'''
  <header class="inner-hero" style="background-image:url(../../{img})">
    <div class="wrap">
      <p class="crumb"><a href="../../index.html">Trang chủ</a> / <a href="../">Sản phẩm</a> / {title}</p>
      <h1>{title}</h1>
      <p>{lead}</p>
    </div>
  </header>
  <main id="main" class="page-body">
    <div class="wrap">
      <div class="grid-products" id="cat-products" data-group="{slug}"></div>
      <div class="cats__cta">
        <a class="btn btn--primary" href="../../catalogue/">Xem Catalogue</a>
        <a class="btn btn--ghost" href="../../dat-lich/">Đặt lịch tư vấn</a>
      </div>
    </div>
  </main>'''
    write(f"san-pham/{slug}/index.html", HEAD.format(
        title=title, desc=lead, css=css2, page="catalog", root="../../", body=body, js=js2
    ))

for sku in SKUS:
    body = f'''
  <main id="main" class="page-body">
    <div class="wrap" id="product-root" data-mode="product" data-slug="{sku}"></div>
  </main>'''
    write(f"san-pham/{sku}/index.html", HEAD.format(
        title="Sản phẩm", desc="Chi tiết sản phẩm NOMA LIGHT", css=css2, page="catalog", root="../../", body=body, js=js2
    ))

for slug in PROJECTS:
    body = f'''
  <main id="main" class="page-body">
    <div class="wrap" id="project-detail" data-slug="{slug}"></div>
  </main>'''
    write(f"du-an/{slug}/index.html", HEAD.format(
        title="Dự án", desc="Không gian lắp đèn NOMA LIGHT", css=css2, page="projects", root="../../", body=body, js=js2
    ))

for slug in ARTICLES:
    body = f'''
  <main id="main" class="page-body">
    <div class="wrap article-body" id="article-detail" data-slug="{slug}"></div>
  </main>'''
    write(f"tin-tuc/{slug}/index.html", HEAD.format(
        title="Tin tức", desc="Kiến thức NOMA LIGHT", css=css2, page="news", root="../../", body=body, js=js2
    ))

# redirects from legacy html
redir("gioi-thieu.html", "gioi-thieu/")
redir("ung-dung.html", "ung-dung/")
redir("du-an.html", "du-an/")
redir("cong-nghe.html", "cong-nghe/")
redir("tin-tuc.html", "tin-tuc/")
redir("dat-lich.html", "dat-lich/")
redir("lien-he.html", "lien-he/")
redir("catalog.html", "san-pham/")
redir("product.html", "san-pham/")
redir("chinh-sach-bao-mat.html", "chinh-sach-bao-mat/")
redir("dieu-khoan-su-dung.html", "dieu-khoan-su-dung/")
redir("404.html", "404/")

# warranty folder copy-style redirect from existing
redir("chinh-sach-bao-hanh.html", "chinh-sach-bao-hanh/")
write("chinh-sach-bao-hanh/index.html", HEAD.format(
    title="Chính sách bảo hành",
    desc="Bảo hành sản phẩm NOMA LIGHT theo catalogue / phiếu xuất.",
    css="../css/style.css?v=29",
    page="",
    root="../",
    js="../js/",
    body='''
  <header class="inner-hero" style="background:#0c2744">
    <div class="wrap">
      <p class="crumb"><a href="../index.html">Trang chủ</a> / Chính sách bảo hành</p>
      <h1>Chính sách bảo hành</h1>
    </div>
  </header>
  <main id="main" class="page-body"><div class="wrap prose">
    <p>Sản phẩm NOMA LIGHT được bảo hành theo thời hạn ghi trên catalogue hoặc phiếu xuất khi giao hàng. Chi tiết chốt theo từng lô — không công bố số tháng giả trên website.</p>
    <p>Liên hệ Minh Trọng — <a href="tel:0974169141">0974 169 141</a>.</p>
  </div></main>'''
))
print("done")
