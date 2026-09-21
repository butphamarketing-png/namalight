import { PDFDocument, rgb } from "pdf-lib";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = process.env.NOMA_ROOT
  ? path.resolve(process.env.NOMA_ROOT)
  : path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "assets", "catalogue");

const pdf = await PDFDocument.create();
pdf.setTitle("Catalogue NOMA LIGHT");
pdf.setAuthor("NOMA LIGHT");
pdf.setSubject("Catalogue sản phẩm đèn năng lượng mặt trời — hotline 0974 169 141");

const qrImg = await pdf.embedPng(fs.readFileSync(path.join(root, "assets", "noma-qr.png")));

for (let i = 1; i <= 16; i++) {
  const n = String(i).padStart(2, "0");
  const img = await pdf.embedJpg(fs.readFileSync(path.join(dir, `p${n}.png`)));
  const page = pdf.addPage([img.width, img.height]);
  page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
  if (i === 16) {
    const size = img.width * 0.124;
    const x = img.width * 0.515;
    const y = img.height * 0.044;
    page.drawRectangle({
      x: x - 4,
      y: y - 4,
      width: size + 8,
      height: size + 8,
      color: rgb(1, 1, 1)
    });
    page.drawImage(qrImg, { x, y, width: size, height: size });
  }
}

const out = path.join(dir, "NOMA-LIGHT-Catalogue.pdf");
fs.writeFileSync(out, await pdf.save());
console.log("wrote", out, fs.statSync(out).size);
