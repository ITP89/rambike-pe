# RAMBIKE.PE — Prototipo funcional (datos estáticos)

Prototipo de demostración construido en HTML, CSS y JavaScript puro (sin frameworks, sin instalación de dependencias). Usa `localStorage` del navegador como "base de datos" simulada, así que los cambios que hagas (agregar producto, editar, etc.) persisten mientras no borres los datos del sitio en tu navegador.

## Cómo correrlo en local

**Opción más simple:** haz doble clic en `index.html` y se abre en tu navegador. Funciona para casi todo, pero algunos navegadores restringen `localStorage` al abrir archivos con `file://`.

**Opción recomendada (evita problemas):** levanta un servidor local simple.

Si tienes Python instalado:
```
cd rambike-prototype
python3 -m http.server 8080
```
Luego abre `http://localhost:8080` en tu navegador.

Si tienes Node.js instalado:
```
cd rambike-prototype
npx serve .
```

## Flujo de Cliente
- `index.html` — Home
- `tienda.html` — Catálogo con búsqueda y filtro por categoría
- `producto.html?id=N` — Detalle de producto
- `carrito.html` — Carrito con envío de pedido a WhatsApp

## Flujo de Administrador
- `admin/login.html` — Usuario: `admin` / Contraseña: `rambike2026`
- `admin/productos.html` — Lista de productos (buscar, filtrar, editar, eliminar)
- `admin/producto-form.html` — Agregar/editar producto
- `admin/categorias.html` — Gestión de categorías

## Notas para pruebas (TA2)
- Los productos agregados/editados desde el panel admin se reflejan de inmediato en la tienda del cliente, porque ambos leen del mismo `localStorage` (simula la base de datos compartida).
- Para reiniciar los datos a su estado original antes de grabar el video o repetir una prueba, abre la consola del navegador (F12) estando en cualquier página del sitio y ejecuta:
  ```js
  resetDemoData()
  ```
  luego recarga la página.
- El envío por WhatsApp abre `wa.me` con el mensaje precargado; el número de demo está en `js/data.js` (`WHATSAPP_NUMBER`) y puedes cambiarlo por uno real.
- No hay backend ni base de datos real: es intencional, ya que el proyecto está en fase de prototipo (ver Plan de Pruebas, Sección 1 del informe TA2, "Fuera del alcance").
