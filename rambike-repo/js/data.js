/* ===== RAMBIKE.PE - Datos estáticos de demostración ===== */

const WHATSAPP_NUMBER = "51999999999"; // Reemplaza por el número real del negocio

const DEFAULT_CATEGORIES = ["Accesorios", "Repuestos", "Luces", "Manillares", "Suspensiones"];

const DEFAULT_PRODUCTS = [
  { id: 1, name: "Llanta Continental GP5 Race", category: "Repuestos", price: 240, stock: true,
    desc: "Llanta de alto rendimiento para ruta, compuesto de baja fricción y excelente agarre en mojado.",
    img: "https://picsum.photos/seed/rambike-llanta/500/500" },
  { id: 2, name: "Cadena Shimano XT 12v", category: "Repuestos", price: 165, stock: true,
    desc: "Cadena de 12 velocidades compatible con grupos Shimano XT/SLX, tratamiento anticorrosión.",
    img: "https://picsum.photos/seed/rambike-cadena/500/500" },
  { id: 3, name: "Casco Enduro Pro", category: "Accesorios", price: 380, stock: true,
    desc: "Casco con protección extendida en la nuca, ventilación de 18 puntos y visera ajustable.",
    img: "https://picsum.photos/seed/rambike-casco/500/500" },
  { id: 4, name: "Luz LED Trasera 100LM", category: "Luces", price: 65, stock: true,
    desc: "Luz trasera recargable USB, 5 modos de iluminación, visible hasta 500m.",
    img: "https://picsum.photos/seed/rambike-luz/500/500" },
  { id: 5, name: "Inflador de Mano Pro", category: "Accesorios", price: 90, stock: false,
    desc: "Inflador compacto de doble acción, compatible con válvulas Presta y Schrader.",
    img: "https://picsum.photos/seed/rambike-inflador/500/500" },
  { id: 6, name: "Kit de Parches Premium", category: "Accesorios", price: 20, stock: true,
    desc: "Set de 12 parches autoadhesivos + lija, estuche resistente al agua.",
    img: "https://picsum.photos/seed/rambike-parches/500/500" },
  { id: 7, name: "Manillar de Carbono MTB Pro", category: "Manillares", price: 500, stock: true,
    desc: "Manillar de fibra de carbono ultraliviano de 780mm, diseñado para máximo control en enduro y cross-country.",
    img: "https://picsum.photos/seed/rambike-manillar/500/500" },
  { id: 8, name: "Suspensión Delantera Air 120mm", category: "Suspensiones", price: 890, stock: true,
    desc: "Horquilla de aire con recorrido de 120mm, ajuste de rebote y bloqueo remoto.",
    img: "https://picsum.photos/seed/rambike-susp/500/500" },
  { id: 9, name: "Pedales de Aluminio CNC", category: "Repuestos", price: 180, stock: true,
    desc: "Pedales planos de aluminio mecanizado CNC, pins reemplazables de alto agarre.",
    img: "https://picsum.photos/seed/rambike-pedales/500/500" },
];

/* ---- Acceso a datos (localStorage simula "base de datos" para la demo) ---- */
function getProducts() {
  const raw = localStorage.getItem("rambike_products");
  if (!raw) {
    localStorage.setItem("rambike_products", JSON.stringify(DEFAULT_PRODUCTS));
    return structuredClone(DEFAULT_PRODUCTS);
  }
  try { return JSON.parse(raw); } catch (e) { return structuredClone(DEFAULT_PRODUCTS); }
}

function saveProducts(products) {
  localStorage.setItem("rambike_products", JSON.stringify(products));
}

function getProductById(id) {
  return getProducts().find(p => p.id === Number(id));
}

function getCategories() {
  const raw = localStorage.getItem("rambike_categories");
  if (!raw) {
    localStorage.setItem("rambike_categories", JSON.stringify(DEFAULT_CATEGORIES));
    return [...DEFAULT_CATEGORIES];
  }
  try { return JSON.parse(raw); } catch (e) { return [...DEFAULT_CATEGORIES]; }
}

function saveCategories(cats) {
  localStorage.setItem("rambike_categories", JSON.stringify(cats));
}

function nextProductId() {
  const products = getProducts();
  return products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
}

/* Escapa texto antes de insertarlo con innerHTML (evita inyección de HTML/XSS) */
function escapeHtml(v) {
  return String(v == null ? "" : v)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function formatPrice(n) {
  return "S/ " + Number(n).toFixed(2);
}

/* ---- Reset de datos (útil para reiniciar la demo antes de grabar el video) ---- */
function resetDemoData() {
  localStorage.setItem("rambike_products", JSON.stringify(DEFAULT_PRODUCTS));
  localStorage.setItem("rambike_categories", JSON.stringify(DEFAULT_CATEGORIES));
  localStorage.removeItem("rambike_cart");
  localStorage.removeItem("rambike_admin_session");
}
