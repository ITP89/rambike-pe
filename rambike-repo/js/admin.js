/* ===== RAMBIKE Admin - guardia de sesión + sidebar compartido ===== */

function requireAdminSession() {
  if (sessionStorage.getItem("rambike_admin_session") !== "1") {
    window.location.href = "login.html";
  }
}

function renderAdminSidebar(activePage) {
  const items = [
    { href: "productos.html", icon: "📦", label: "Productos" },
    { href: "categorias.html", icon: "🏷️", label: "Categorías" },
  ];
  const nav = items.map(it => `
    <a href="${it.href}" class="${it.href === activePage ? 'active' : ''}">${it.icon} ${it.label}</a>
  `).join("");

  return `
    <aside class="admin-sidebar">
      <div class="brand">RAMBIKE.PE</div>
      <nav>${nav}</nav>
      <a href="#" class="logout" id="logoutLink">🚪 Cerrar sesión</a>
    </aside>
  `;
}

function wireLogout() {
  const link = document.getElementById("logoutLink");
  if (link) {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      sessionStorage.removeItem("rambike_admin_session");
      window.location.href = "login.html";
    });
  }
}
