const { chromium } = require("playwright-core");
const fs = require("fs");
const path = require("path");
const cases = require("./cases.js");

const BASE = process.env.BASE || "http://localhost:8080";
const OUT = __dirname;
const SHOTS = path.join(OUT, "shots");
fs.mkdirSync(SHOTS, { recursive: true });

const MOBILE = { width: 420, height: 900 };
const DESKTOP = { width: 1366, height: 768 };

const SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500"><rect width="500" height="500" fill="#d9d9d9"/><text x="250" y="260" font-family="sans-serif" font-size="36" fill="#777" text-anchor="middle">Foto</text></svg>`;

let browser;
const results = {};
const money = (n) => "S/ " + Number(n).toFixed(2);

async function newPage(viewport) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  await page.route(/picsum\.photos/, (r) => r.fulfill({ status: 200, contentType: "image/svg+xml", body: SVG }));
  page.on("pageerror", (e) => (page.__errors = (page.__errors || []).concat(String(e))));
  return page;
}
async function seed(page, { cart, admin } = {}) {
  await page.goto(BASE + "/index.html");
  await page.evaluate(({ cart, admin }) => {
    if (cart) localStorage.setItem("rambike_cart", JSON.stringify(cart));
    if (admin) sessionStorage.setItem("rambike_admin_session", "1");
  }, { cart, admin });
}
const shot = (page, name) => page.screenshot({ path: path.join(SHOTS, name + ".png") });
const CART2 = [{ id: 7, qty: 1 }, { id: 3, qty: 2 }];

const T = {};

T["CP-01"] = async () => {
  const p = await newPage(MOBILE); await p.goto(BASE + "/tienda.html");
  const n = await p.locator(".product-card").count();
  const ok = await p.evaluate(() => [...document.querySelectorAll(".product-card")].filter(c => c.querySelector("img.thumb")?.getAttribute("src") && c.querySelector(".pname")?.textContent.trim() && /S\/ \d/.test(c.querySelector(".pprice")?.textContent || "")).length);
  await shot(p, "CP-01-catalogo");
  return [n === 9 && ok === 9, `${n} tarjetas; ${ok} con foto, nombre y precio.`];
};
T["CP-02"] = async () => {
  const p = await newPage(MOBILE); await p.goto(BASE + "/tienda.html");
  await p.locator("#catChips .chip", { hasText: "Repuestos" }).click();
  const names = await p.locator(".product-card .pname").allTextContents();
  await shot(p, "CP-02-filtro");
  const ok = names.length === 3 && ["Llanta", "Cadena", "Pedales"].every(k => names.some(n => n.includes(k)));
  return [ok, `${names.length} productos: ${names.join("; ")}.`];
};
T["CP-03"] = async () => {
  const p = await newPage(MOBILE); await p.goto(BASE + "/tienda.html");
  const r = await p.evaluate(() => {
    const card = [...document.querySelectorAll(".product-card")].find(c => c.querySelector(".pname").textContent.includes("Inflador"));
    const b = card.querySelector(".badge"); const cr = card.getBoundingClientRect(); const br = b.getBoundingClientRect();
    return { text: b.textContent.trim(), cardTop: Math.round(cr.top), badgeTop: Math.round(br.top), inside: br.top >= cr.top && br.bottom <= cr.bottom && br.left >= cr.left && br.right <= cr.right };
  });
  await p.evaluate(() => [...document.querySelectorAll(".product-card")].find(c => c.textContent.includes("Inflador")).scrollIntoView({ block: "center" }));
  await shot(p, "CP-03-agotado");
  return [r.text === "Agotado" && r.inside, `Etiqueta "${r.text}" presente; borde superior de la tarjeta en y=${r.cardTop}px y de la etiqueta en y=${r.badgeTop}px; ${r.inside ? "dentro" : "FUERA"} del área de la tarjeta.`];
};
T["CP-04"] = async () => {
  const p = await newPage(MOBILE); await p.goto(BASE + "/tienda.html");
  await p.fill("#searchInput", "cadena");
  const names = await p.locator(".product-card .pname").allTextContents();
  return [names.length === 1 && names[0].includes("Cadena"), `${names.length} resultado(s): ${names.join("; ")}.`];
};
T["CP-05"] = async () => {
  const p = await newPage(MOBILE); await p.goto(BASE + "/tienda.html");
  await p.fill("#searchInput", "zzzz");
  const vis = await p.locator("#emptyState").isVisible(); const txt = (await p.locator("#emptyState").innerText()).trim();
  const cards = await p.locator(".product-card:visible").count();
  await shot(p, "CP-05-sin-resultados");
  return [vis && /No se encontraron productos/.test(txt) && cards === 0, `Mensaje "${txt.replace(/\s+/g, " ")}" ${vis ? "visible" : "oculto"}; ${cards} tarjetas visibles.`];
};
T["CP-06"] = async () => {
  const p = await newPage(MOBILE); await p.goto(BASE + "/tienda.html");
  await p.fill("#searchInput", "LLANTA");
  const names = await p.locator(".product-card .pname").allTextContents();
  return [names.length === 1 && names[0].includes("Llanta"), `${names.length} resultado(s): ${names.join("; ")}.`];
};
T["CP-07"] = async () => {
  const p = await newPage(MOBILE); await p.goto(BASE + "/producto.html?id=7");
  const r = await p.evaluate(() => ({ img: !!document.querySelector(".gallery-main")?.getAttribute("src"), name: document.querySelector(".product-name")?.textContent, price: document.querySelector(".product-price")?.textContent, desc: document.querySelector(".product-desc")?.textContent.length, stock: document.querySelector(".stock-badge")?.textContent }));
  await shot(p, "CP-07-detalle");
  return [r.img && r.name.includes("Manillar") && r.price === "S/ 500.00" && r.desc > 10 && r.stock === "En stock", `Foto: ${r.img ? "sí" : "no"}; nombre: ${r.name}; precio: ${r.price}; descripción: ${r.desc} caracteres; estado: ${r.stock}.`];
};
T["CP-08"] = async () => {
  const p = await newPage(MOBILE); await p.goto(BASE + "/producto.html?id=5");
  const dis = await p.locator("#addBtn").isDisabled(); const t = (await p.locator("#addBtn").innerText()).trim();
  await shot(p, "CP-08-agotado-detalle");
  return [dis, `Botón "${t}" ${dis ? "deshabilitado" : "habilitado"}.`];
};
T["CP-09"] = async () => {
  const p = await newPage(MOBILE); await p.goto(BASE + "/producto.html?id=999");
  const t = (await p.locator("#productContainer").innerText()).trim();
  return [/Producto no encontrado/.test(t) && !(p.__errors || []).length, `Texto en pantalla: "${t}"; errores de script: ${(p.__errors || []).length}.`];
};
T["CP-10"] = async () => {
  const p = await newPage(MOBILE); await p.goto(BASE + "/producto.html?id=3");
  await p.click("#qtyPlus"); await p.click("#addBtn");
  const badge = await p.evaluate(() => [...document.querySelectorAll(".cart-badge")].map(b => ({ t: b.textContent, d: getComputedStyle(b).display })));
  const cart = await p.evaluate(() => localStorage.getItem("rambike_cart"));
  const vis = badge.filter(b => b.d !== "none").map(b => b.t);
  return [vis.length > 0 && vis.every(v => v === "2"), `Contadores visibles: [${vis.join(", ")}]; carrito guardado: ${cart}.`];
};
T["CP-11"] = async () => {
  const p = await newPage(MOBILE); await p.goto(BASE + "/producto.html?id=7");
  await p.click("#addBtn"); await p.click("#addBtn");
  const cart = JSON.parse(await p.evaluate(() => localStorage.getItem("rambike_cart")));
  return [cart.length === 1 && cart[0].qty === 2, `Carrito: ${JSON.stringify(cart)}.`];
};
T["CP-12"] = async () => {
  const p = await newPage(MOBILE); await p.goto(BASE + "/producto.html?id=7");
  await p.click("#addBtn"); await p.waitForTimeout(350);
  const r = await p.evaluate(() => { const t = document.getElementById("toast"); return { cls: t.className, txt: t.textContent.trim(), op: getComputedStyle(t).opacity }; });
  await shot(p, "CP-12-aviso");
  return [r.cls.includes("show") && Number(r.op) > 0.9, `Aviso "${r.txt}", clase "${r.cls}", opacidad ${r.op}.`];
};
T["CP-13"] = async () => {
  const p = await newPage(MOBILE); await seed(p, { cart: CART2 }); await p.goto(BASE + "/carrito.html");
  const n = await p.locator(".cart-item").count(); const tot = (await p.locator(".amount").innerText()).trim();
  await shot(p, "CP-13-carrito");
  return [n === 2 && tot === "S/ 1260.00", `${n} líneas; total ${tot}.`];
};
T["CP-14"] = async () => {
  const p = await newPage(MOBILE); await seed(p, { cart: CART2 }); await p.goto(BASE + "/carrito.html");
  await p.locator('.qty-plus[data-id="7"]').click();
  const tot = (await p.locator(".amount").innerText()).trim();
  return [tot === "S/ 1760.00", `Total tras pulsar "+": ${tot}.`];
};
T["CP-15"] = async () => {
  const p = await newPage(MOBILE); await seed(p, { cart: [{ id: 3, qty: 1 }] }); await p.goto(BASE + "/carrito.html");
  await p.locator('.qty-minus[data-id="3"]').click();
  const empty = /Tu carrito está vacío/.test(await p.locator("#cartContent").innerText());
  return [empty, `Tras pulsar "−" con cantidad 1: ${empty ? "carrito vacío" : "el ítem sigue"}.`];
};
T["CP-16"] = async () => {
  const p = await newPage(MOBILE); await seed(p, { cart: CART2 }); await p.goto(BASE + "/carrito.html");
  await p.locator('.remove-btn[data-id="7"]').click();
  const n = await p.locator(".cart-item").count(); const tot = (await p.locator(".amount").innerText()).trim();
  return [n === 1 && tot === "S/ 760.00", `${n} línea(s); total ${tot}.`];
};
T["CP-17"] = async () => {
  const p = await newPage(MOBILE); await p.goto(BASE + "/carrito.html");
  const txt = (await p.locator("#cartContent").innerText()).replace(/\s+/g, " ").trim();
  const link = await p.locator("#cartContent a", { hasText: "Ver catálogo" }).count();
  await shot(p, "CP-17-vacio");
  return [/Tu carrito está vacío/.test(txt) && link === 1, `Texto: "${txt}"; botón Ver catálogo: ${link ? "sí" : "no"}.`];
};
T["CP-18"] = async () => {
  const p = await newPage(MOBILE); await p.goto(BASE + "/producto.html?id=7"); await p.click("#addBtn");
  await p.goto(BASE + "/tienda.html"); await p.goto(BASE + "/index.html"); await p.goto(BASE + "/carrito.html");
  const a = await p.locator(".cart-item").count();
  await p.reload(); const b = await p.locator(".cart-item").count();
  return [a === 1 && b === 1, `Líneas tras navegar: ${a}; tras recargar: ${b}.`];
};
T["CP-19"] = async () => {
  const p = await newPage(MOBILE); await seed(p, { cart: CART2 }); await p.goto(BASE + "/carrito.html");
  await p.click("#sendBtn");
  const txt = (await p.locator(".wa-preview").innerText()).replace(/\s+/g, " ");
  await shot(p, "CP-19-resumen");
  const ok = txt.includes("Manillar") && txt.includes("Casco") && txt.includes("TOTAL: S/ 1260.00");
  return [ok, `Resumen: "${txt.trim()}".`];
};
T["CP-20"] = async () => {
  const p = await newPage(MOBILE); await seed(p, { cart: CART2 }); await p.goto(BASE + "/carrito.html");
  await p.click("#sendBtn");
  const href = await p.locator("#confirmWaBtn").getAttribute("href");
  const text = decodeURIComponent(href.split("?text=")[1] || "");
  const exp = "Hola RAMBIKE, quiero hacer el siguiente pedido:\n\n• 1x Manillar de Carbono MTB Pro - S/ 500.00\n• 2x Casco Enduro Pro - S/ 760.00\n\nTOTAL: S/ 1260.00";
  const okLink = /^https:\/\/wa\.me\/\d+\?text=/.test(href);
  return [okLink && text === exp, `Enlace ${okLink ? "con formato wa.me válido" : "inválido"}; texto decodificado: ${JSON.stringify(text)}.`];
};
T["CP-21"] = async () => {
  const p = await newPage(MOBILE); await p.goto(BASE + "/carrito.html");
  const n = await p.locator("#sendBtn").count();
  return [n === 0, `Botón de envío presente: ${n ? "sí" : "no"}.`];
};
T["CP-22"] = async () => {
  const p = await newPage(MOBILE); await p.goto(BASE + "/producto.html?id=7");
  const href = await p.locator("a.fab-whatsapp").getAttribute("href");
  const text = decodeURIComponent(href.split("?text=")[1] || "");
  await shot(p, "CP-22-boton-flotante");
  const empty = /TOTAL: S\/ 0\.00/.test(text);
  return [!empty, `Mensaje del botón flotante: ${JSON.stringify(text)}.`];
};

T["CP-23"] = async () => {
  const p = await newPage(DESKTOP); await p.goto(BASE + "/admin/login.html");
  await p.fill("#user", "admin"); await p.fill("#pass", "rambike2026"); await p.click('button[type="submit"]');
  await p.waitForURL(/productos\.html/, { timeout: 4000 }).catch(() => {});
  return [/admin\/productos\.html/.test(p.url()), `URL final: ${p.url().replace(BASE, "")}.`];
};
T["CP-24"] = async () => {
  const p = await newPage(DESKTOP); await p.goto(BASE + "/admin/login.html");
  await p.fill("#user", "admin"); await p.fill("#pass", "clave-erronea"); await p.click('button[type="submit"]');
  const vis = await p.locator("#loginError").isVisible(); const t = (await p.locator("#loginError").innerText()).trim();
  await shot(p, "CP-24-login-error");
  return [vis && /login\.html/.test(p.url()), `Mensaje ${vis ? "visible" : "oculto"}: "${t}"; URL: ${p.url().replace(BASE, "")}.`];
};
T["CP-25"] = async () => {
  const p = await newPage(DESKTOP); await p.goto(BASE + "/admin/productos.html");
  await p.waitForURL(/login\.html/, { timeout: 4000 }).catch(() => {});
  return [/login\.html/.test(p.url()), `URL final: ${p.url().replace(BASE, "")}.`];
};
T["CP-26"] = async () => {
  const p = await newPage(DESKTOP); await seed(p, { admin: true }); await p.goto(BASE + "/admin/productos.html");
  const rows = await p.locator("#productsBody tr").count();
  const ed = await p.locator("#productsBody a[title='Editar']").count(); const del = await p.locator("#productsBody .delete-btn").count();
  await shot(p, "CP-26-admin-lista");
  return [rows === 9 && ed === 9 && del === 9, `${rows} filas; ${ed} botones editar; ${del} botones eliminar.`];
};
T["CP-27"] = async () => {
  const p = await newPage(DESKTOP); await seed(p, { admin: true }); await p.goto(BASE + "/admin/producto-form.html");
  await p.fill("#pname", "Bomba de pie Test"); await p.selectOption("#pcat", "Accesorios"); await p.fill("#pprice", "120"); await p.fill("#pdesc", "Producto de prueba");
  await shot(p, "CP-27-formulario");
  await p.click("#saveBtn"); await p.waitForURL(/productos\.html/);
  const inAdmin = await p.locator("#productsBody tr", { hasText: "Bomba de pie Test" }).count();
  await p.goto(BASE + "/tienda.html");
  const inShop = await p.locator(".product-card", { hasText: "Bomba de pie Test" }).count();
  return [inAdmin === 1 && inShop === 1, `En el panel: ${inAdmin}; en la tienda: ${inShop}.`];
};
async function formAlert(name, price, id) {
  const p = await newPage(DESKTOP); await seed(p, { admin: true }); await p.goto(BASE + "/admin/producto-form.html");
  let msg = null; p.once("dialog", async d => { msg = d.message(); await d.accept(); });
  if (name) await p.fill("#pname", name); await p.fill("#pprice", price);
  await p.click("#saveBtn"); await p.waitForTimeout(300);
  const total = await p.evaluate(() => JSON.parse(localStorage.getItem("rambike_products")).length);
  return { msg, total, url: p.url().replace(BASE, "") };
}
T["CP-28"] = async () => { const r = await formAlert("", "50"); return [!!r.msg && r.total === 9 && /producto-form/.test(r.url), `Aviso: ${JSON.stringify(r.msg)}; productos guardados: ${r.total}; URL: ${r.url}.`]; };
T["CP-29"] = async () => { const r = await formAlert("Prueba", "0"); return [!!r.msg && r.total === 9 && /producto-form/.test(r.url), `Aviso: ${JSON.stringify(r.msg)}; productos guardados: ${r.total}; URL: ${r.url}.`]; };
T["CP-30"] = async () => {
  const p = await newPage(DESKTOP); await seed(p, { admin: true }); await p.goto(BASE + "/admin/producto-form.html?id=1");
  await p.fill("#pprice", "250"); await p.click("#saveBtn"); await p.waitForURL(/productos\.html/);
  await p.goto(BASE + "/tienda.html");
  const price = (await p.locator(".product-card", { hasText: "Llanta" }).locator(".pprice").innerText()).trim();
  return [price === "S/ 250.00", `Precio de la Llanta en la tienda: ${price}.`];
};
T["CP-31"] = async () => {
  const p = await newPage(DESKTOP); await seed(p, { admin: true }); await p.goto(BASE + "/admin/producto-form.html?id=3");
  await p.locator(".switch .slider").click();
  await p.click("#saveBtn"); await p.waitForURL(/productos\.html/);
  await p.goto(BASE + "/producto.html?id=3");
  const dis = await p.locator("#addBtn").isDisabled(); const st = (await p.locator(".stock-badge").innerText()).trim();
  return [dis, `Estado: "${st}"; botón de compra ${dis ? "deshabilitado" : "habilitado"}.`];
};
T["CP-32"] = async () => {
  const p = await newPage(DESKTOP); await seed(p, { admin: true }); await p.goto(BASE + "/admin/productos.html");
  p.once("dialog", d => d.accept());
  await p.locator('.delete-btn[data-id="6"]').click();
  const rows = await p.locator("#productsBody tr").count(); const still = await p.locator("#productsBody tr", { hasText: "Kit de Parches" }).count();
  return [rows === 8 && still === 0, `${rows} filas; "Kit de Parches" presente: ${still ? "sí" : "no"}.`];
};
T["CP-33"] = async () => {
  const p = await newPage(DESKTOP); await seed(p, { admin: true }); await p.goto(BASE + "/admin/categorias.html");
  p.once("dialog", d => d.accept("Ropa")); await p.click("#newCatBtn");
  const inAdmin = await p.locator(".cat-row", { hasText: "Ropa" }).count();
  await p.goto(BASE + "/tienda.html");
  const chip = await p.locator("#catChips .chip", { hasText: "Ropa" }).count();
  return [inAdmin === 1 && chip === 1, `En el panel: ${inAdmin}; chip en la tienda: ${chip}.`];
};
T["CP-34"] = async () => {
  const p = await newPage(DESKTOP); await seed(p, { admin: true }); await p.goto(BASE + "/admin/categorias.html");
  let msg = null; p.once("dialog", async d => { msg = d.message(); await d.accept(); });
  await p.locator('.delete-cat-btn[data-idx="2"]').click(); await p.waitForTimeout(200);
  const still = await p.locator(".cat-row", { hasText: "Luces" }).count();
  return [!!msg && /No se puede eliminar/.test(msg) && still === 1, `Aviso: ${JSON.stringify(msg)}; "Luces" sigue en la lista: ${still ? "sí" : "no"}.`];
};
T["CP-35"] = async () => {
  const p = await newPage(DESKTOP); await seed(p, { admin: true }); await p.goto(BASE + "/admin/categorias.html");
  await p.locator('.edit-cat-btn[data-idx="2"]').click(); await p.fill("#editInput", "Iluminación"); await p.click("#saveEditBtn");
  await p.goto(BASE + "/tienda.html?cat=" + encodeURIComponent("Iluminación"));
  const n = await p.locator(".product-card").count();
  const cat = await p.evaluate(() => JSON.parse(localStorage.getItem("rambike_products")).find(x => x.id === 4).category);
  await p.setViewportSize(MOBILE); await shot(p, "CP-35-categoria-renombrada");
  return [n === 1, `El filtro "Iluminación" muestra ${n} producto(s); la Luz LED conserva la categoría "${cat}" en los datos.`];
};
T["CP-36"] = async () => {
  const p = await newPage(DESKTOP); await seed(p, { admin: true }); await p.goto(BASE + "/admin/productos.html");
  await p.click("#logoutLink"); await p.waitForURL(/login\.html/);
  await p.goto(BASE + "/admin/productos.html"); await p.waitForURL(/login\.html/, { timeout: 4000 }).catch(() => {});
  return [/login\.html/.test(p.url()), `URL tras reintentar abrir el panel: ${p.url().replace(BASE, "")}.`];
};
T["CP-37"] = async () => {
  const p = await newPage(MOBILE); await seed(p, { admin: true });
  await p.goto(BASE + "/admin/producto-form.html");
  await p.fill("#pname", '<img src=x onerror="window.__xss=1">'); await p.fill("#pprice", "10"); await p.click("#saveBtn"); await p.waitForURL(/productos\.html/);
  await p.goto(BASE + "/tienda.html"); await p.waitForTimeout(500);
  const r = await p.evaluate(() => ({ xss: window.__xss === 1, imgs: document.querySelectorAll(".pname img").length }));
  await p.evaluate(() => { const c = document.querySelectorAll(".product-card"); c[c.length - 1].scrollIntoView({ block: "center" }); });
  await shot(p, "CP-37-html-en-nombre");
  return [!r.xss && r.imgs === 0, `Código ejecutado: ${r.xss ? "sí" : "no"}; imágenes creadas dentro del nombre: ${r.imgs}.`];
};
T["E2E-01"] = async () => {
  const p = await newPage(MOBILE); await p.goto(BASE + "/index.html"); let clicks = 0;
  await p.locator(".bottom-nav a", { hasText: "Tienda" }).click(); clicks++; await p.waitForURL(/tienda/);
  await p.locator(".product-card", { hasText: "Manillar" }).click(); clicks++; await p.waitForURL(/producto/);
  await p.click("#addBtn"); clicks++;
  await p.locator("header a[href='carrito.html']").click(); clicks++; await p.waitForURL(/carrito/);
  await p.click("#sendBtn"); clicks++;
  const href = await p.locator("#confirmWaBtn").getAttribute("href");
  return [/wa\.me\/\d+\?text=/.test(href) && clicks <= 5, `Se llegó al enlace de WhatsApp en ${clicks} clics.`];
};

(async () => {
  browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
  for (const c of cases) {
    let pass = false, observed = "";
    try { [pass, observed] = await T[c.id](); } catch (e) { pass = false; observed = "Error durante la ejecución: " + String(e).split("\n")[0]; }
    results[c.id] = { status: pass ? "Pasó" : "Falló", observed };
    console.log((pass ? "PASS " : "FAIL ") + c.id + " | " + observed);
  }
  fs.writeFileSync(path.join(OUT, "results.json"), JSON.stringify(results, null, 2));

  // ---- Accesibilidad con axe-core ----
  const axeSrc = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
  const targets = [
    ["Inicio", "/index.html", MOBILE, {}], ["Tienda", "/tienda.html", MOBILE, {}], ["Producto", "/producto.html?id=7", MOBILE, {}],
    ["Carrito", "/carrito.html", MOBILE, { cart: CART2 }], ["Login admin", "/admin/login.html", DESKTOP, {}],
    ["Productos admin", "/admin/productos.html", DESKTOP, { admin: true }], ["Formulario admin", "/admin/producto-form.html", DESKTOP, { admin: true }],
    ["Categorías admin", "/admin/categorias.html", DESKTOP, { admin: true }],
  ];
  const axeOut = [];
  for (const [name, url, vp, opt] of targets) {
    const p = await newPage(vp); await seed(p, opt); await p.goto(BASE + url); await p.waitForTimeout(300);
    await p.evaluate(axeSrc);
    const res = await p.evaluate(async () => { const r = await axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] } }); return { violations: r.violations.map(v => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length, targets: v.nodes.slice(0, 3).map(n => n.target.join(" ")) })), passes: r.passes.length }; });
    axeOut.push({ page: name, url, ...res });
    console.log("AXE", name, res.violations.map(v => `${v.id}(${v.nodes})`).join(", ") || "sin violaciones");
  }
  fs.writeFileSync(path.join(OUT, "axe.json"), JSON.stringify(axeOut, null, 2));

  // ---- Contraste calculado ----
  const lum = (h) => { const c = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
  const pairs = [["Texto blanco sobre encabezado naranja", "#FFFFFF", "#F5A623"], ["Precio naranja sobre fondo blanco", "#F5A623", "#FFFFFF"], ["Texto principal sobre fondo blanco", "#1A1A1A", "#FFFFFF"], ["Texto blanco sobre botón WhatsApp", "#FFFFFF", "#25D366"], ["Descripción gris sobre blanco", "#666666", "#FFFFFF"], ["Texto blanco sobre etiqueta Disponible", "#FFFFFF", "#1E8E3E"], ["Texto blanco sobre etiqueta Agotado", "#FFFFFF", "#888888"]];
  const contrast = pairs.map(([n, f, b]) => ({ par: n, fg: f, bg: b, ratio: Number(ratio(f, b).toFixed(2)), aa: ratio(f, b) >= 4.5 }));
  fs.writeFileSync(path.join(OUT, "contrast.json"), JSON.stringify(contrast, null, 2));
  contrast.forEach(c => console.log("CONTRASTE", c.par, c.ratio, c.aa ? "AA" : "NO AA"));

  // ---- Peso del sitio (sin imágenes remotas) ----
  const root = process.env.PROJECT_DIR || path.join(__dirname, "..", "rambike-prototype"); let bytes = 0; const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach(e => e.isDirectory() ? walk(path.join(d, e.name)) : (!/README/.test(e.name) && (bytes += fs.statSync(path.join(d, e.name)).size)));
  walk(root); fs.writeFileSync(path.join(OUT, "weight.json"), JSON.stringify({ kb: Number((bytes / 1024).toFixed(1)) }));
  console.log("PESO", (bytes / 1024).toFixed(1), "KB");

  const fallos = Object.keys(results).filter(k => results[k].status !== "Pasó");
  console.log("RESUMEN", (Object.keys(results).length - fallos.length) + "/" + Object.keys(results).length, fallos.length ? "FALLAN: " + fallos.join(", ") : "");
  if (fallos.length) process.exitCode = 1; // hace fallar el pipeline de CI

  await browser.close();
})();
