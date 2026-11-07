// Catálogo único de casos de prueba (fuente para el script de ejecución y para el Word)
// Campos: id, hu, nombre, pre, pasos[], datos, esperado, criterio

const C = [];
const add = (o) => C.push(o);

// ---------- HU-01 Explorar catálogo ----------
add({ id: "CP-01", hu: "HU-01", nombre: "Catálogo muestra productos en cuadrícula",
  pre: "Datos de demostración cargados (9 productos).",
  pasos: ["Abrir tienda.html", "Observar la cuadrícula de productos"],
  datos: "Catálogo inicial", esperado: "Se listan los 9 productos y cada tarjeta muestra foto, nombre y precio.",
  criterio: "Pasó si hay 9 tarjetas y todas tienen foto, nombre y precio. Falló en otro caso." });
add({ id: "CP-02", hu: "HU-01", nombre: "Filtrar por categoría",
  pre: "Catálogo inicial cargado.",
  pasos: ["Abrir tienda.html", "Pulsar el chip \"Repuestos\""],
  datos: "Categoría: Repuestos", esperado: "Solo se muestran los 3 productos de la categoría Repuestos (Llanta, Cadena, Pedales).",
  criterio: "Pasó si se muestran exactamente los 3 productos de Repuestos." });
add({ id: "CP-03", hu: "HU-01", nombre: "Producto sin stock indica \"Agotado\"",
  pre: "El producto \"Inflador de Mano Pro\" tiene stock = no.",
  pasos: ["Abrir tienda.html", "Ubicar la tarjeta del Inflador de Mano Pro", "Buscar la etiqueta de disponibilidad"],
  datos: "Producto id 5", esperado: "La tarjeta muestra la etiqueta \"Agotado\" visible dentro de la tarjeta.",
  criterio: "Pasó si la etiqueta \"Agotado\" existe y está dentro del área visible de la tarjeta." });

// ---------- HU-02 Buscar ----------
add({ id: "CP-04", hu: "HU-02", nombre: "Buscar por nombre",
  pre: "Catálogo inicial cargado.",
  pasos: ["Abrir tienda.html", "Escribir \"cadena\" en el buscador"],
  datos: "Texto: cadena", esperado: "Solo aparece \"Cadena Shimano XT 12v\".",
  criterio: "Pasó si el resultado es 1 producto cuyo nombre contiene \"Cadena\"." });
add({ id: "CP-05", hu: "HU-02", nombre: "Búsqueda sin resultados",
  pre: "Catálogo inicial cargado.",
  pasos: ["Abrir tienda.html", "Escribir \"zzzz\" en el buscador"],
  datos: "Texto: zzzz", esperado: "Se muestra el mensaje \"No se encontraron productos\".",
  criterio: "Pasó si el mensaje es visible y no hay tarjetas." });
add({ id: "CP-06", hu: "HU-02", nombre: "Búsqueda ignora mayúsculas",
  pre: "Catálogo inicial cargado.",
  pasos: ["Abrir tienda.html", "Escribir \"LLANTA\" en el buscador"],
  datos: "Texto: LLANTA", esperado: "Aparece \"Llanta Continental GP5 Race\".",
  criterio: "Pasó si el resultado es 1 producto con \"Llanta\"." });

// ---------- HU-03 Detalle ----------
add({ id: "CP-07", hu: "HU-03", nombre: "Detalle completo del producto",
  pre: "Catálogo inicial cargado.",
  pasos: ["Abrir producto.html?id=7"],
  datos: "Manillar de Carbono MTB Pro", esperado: "Se ven foto, nombre, precio S/ 500.00, descripción y estado \"En stock\".",
  criterio: "Pasó si los cinco elementos están presentes con los valores indicados." });
add({ id: "CP-08", hu: "HU-03", nombre: "Producto agotado bloquea el botón de compra",
  pre: "Producto id 5 con stock = no.",
  pasos: ["Abrir producto.html?id=5", "Observar el botón principal"],
  datos: "Inflador de Mano Pro", esperado: "El botón está deshabilitado y dice \"Producto agotado\".",
  criterio: "Pasó si el botón está deshabilitado." });
add({ id: "CP-09", hu: "HU-03", nombre: "Producto inexistente",
  pre: "Ninguna.",
  pasos: ["Abrir producto.html?id=999"],
  datos: "id = 999", esperado: "Se muestra \"Producto no encontrado\" sin errores en pantalla.",
  criterio: "Pasó si aparece el mensaje." });

// ---------- HU-04 Agregar al carrito ----------
add({ id: "CP-10", hu: "HU-04", nombre: "Agregar con cantidad y actualizar contador",
  pre: "Carrito vacío.",
  pasos: ["Abrir producto.html?id=3", "Pulsar \"+\" una vez (cantidad 2)", "Pulsar \"Añadir al carro\""],
  datos: "Casco Enduro Pro x2", esperado: "El contador del carrito muestra 2 y el carrito guarda 2 unidades.",
  criterio: "Pasó si el contador visible es 2." });
add({ id: "CP-11", hu: "HU-04", nombre: "Agregar un producto repetido suma cantidades",
  pre: "Carrito vacío.",
  pasos: ["Abrir producto.html?id=7", "Pulsar \"Añadir al carro\" dos veces"],
  datos: "Manillar x1 + x1", esperado: "El carrito tiene una sola línea con cantidad 2.",
  criterio: "Pasó si hay 1 línea con cantidad 2." });
add({ id: "CP-12", hu: "HU-04", nombre: "Confirmación visual al agregar",
  pre: "Carrito vacío.",
  pasos: ["Abrir producto.html?id=7", "Pulsar \"Añadir al carro\""],
  datos: "Manillar x1", esperado: "Aparece un aviso breve \"Producto agregado al carrito\".",
  criterio: "Pasó si el aviso se hace visible tras el clic." });

// ---------- HU-05 Gestionar carrito ----------
add({ id: "CP-13", hu: "HU-05", nombre: "Carrito muestra ítems y total",
  pre: "Carrito con Manillar x1 y Casco x2.",
  pasos: ["Abrir carrito.html"],
  datos: "500.00 + 2 x 380.00", esperado: "Dos líneas y total S/ 1260.00.",
  criterio: "Pasó si hay 2 líneas y el total es S/ 1260.00." });
add({ id: "CP-14", hu: "HU-05", nombre: "Aumentar cantidad recalcula el total",
  pre: "Carrito con Manillar x1 y Casco x2.",
  pasos: ["Abrir carrito.html", "Pulsar \"+\" en el Manillar"],
  datos: "Manillar x2", esperado: "Total S/ 1760.00.",
  criterio: "Pasó si el total pasa a S/ 1760.00." });
add({ id: "CP-15", hu: "HU-05", nombre: "Reducir cantidad hasta cero elimina el ítem",
  pre: "Carrito con Casco x1.",
  pasos: ["Abrir carrito.html", "Pulsar \"−\" en el Casco"],
  datos: "Casco x1", esperado: "El ítem desaparece y se muestra el carrito vacío.",
  criterio: "Pasó si el carrito queda vacío." });
add({ id: "CP-16", hu: "HU-05", nombre: "Eliminar producto con la papelera",
  pre: "Carrito con Manillar x1 y Casco x2.",
  pasos: ["Abrir carrito.html", "Pulsar la papelera del Manillar"],
  datos: "Manillar", esperado: "Queda solo el Casco y el total es S/ 760.00.",
  criterio: "Pasó si queda 1 línea y el total es S/ 760.00." });
add({ id: "CP-17", hu: "HU-05", nombre: "Estado de carrito vacío",
  pre: "Carrito vacío.",
  pasos: ["Abrir carrito.html"],
  datos: "Sin datos", esperado: "Se muestra \"Tu carrito está vacío\" y un botón \"Ver catálogo\".",
  criterio: "Pasó si ambos elementos están visibles." });
add({ id: "CP-18", hu: "HU-05", nombre: "El carrito persiste entre páginas",
  pre: "Carrito vacío.",
  pasos: ["Agregar el Manillar desde su ficha", "Navegar a Tienda, luego a Inicio, luego a Carrito", "Recargar la página"],
  datos: "Manillar x1", esperado: "El Manillar sigue en el carrito tras navegar y tras recargar.",
  criterio: "Pasó si el ítem permanece en ambos momentos." });

// ---------- HU-06 WhatsApp ----------
add({ id: "CP-19", hu: "HU-06", nombre: "Resumen del pedido antes de enviar",
  pre: "Carrito con Manillar x1 y Casco x2.",
  pasos: ["Abrir carrito.html", "Pulsar \"Enviar pedido por WhatsApp\""],
  datos: "Pedido de 2 productos", esperado: "Se abre un resumen con los productos, cantidades y TOTAL S/ 1260.00.",
  criterio: "Pasó si el resumen lista ambos productos y el total correcto." });
add({ id: "CP-20", hu: "HU-06", nombre: "Enlace de WhatsApp con el mensaje armado",
  pre: "Resumen del pedido abierto (CP-19).",
  pasos: ["Leer el enlace del botón \"Confirmar y abrir WhatsApp\"", "Decodificar el parámetro text"],
  datos: "Pedido de 2 productos", esperado: "El enlace es https://wa.me/<número>?text=… y el texto decodificado contiene los productos, cantidades, subtotales y el total.",
  criterio: "Pasó si el texto decodificado coincide con el mensaje esperado." });
add({ id: "CP-21", hu: "HU-06", nombre: "No se puede enviar con carrito vacío",
  pre: "Carrito vacío.",
  pasos: ["Abrir carrito.html", "Buscar el botón \"Enviar pedido por WhatsApp\""],
  datos: "Sin datos", esperado: "El botón no está disponible.",
  criterio: "Pasó si el botón no existe o está deshabilitado." });
add({ id: "CP-22", hu: "HU-06", nombre: "Botón flotante de WhatsApp con carrito vacío (exploratoria)",
  pre: "Carrito vacío.",
  pasos: ["Abrir producto.html?id=7", "Leer el enlace del botón flotante de WhatsApp"],
  datos: "Sin datos", esperado: "No debe enviarse un pedido vacío (sin total S/ 0.00).",
  criterio: "Pasó si el mensaje no representa un pedido vacío." });

// ---------- HU-07 Administración ----------
add({ id: "CP-23", hu: "HU-07", nombre: "Inicio de sesión válido",
  pre: "Sin sesión iniciada.",
  pasos: ["Abrir admin/login.html", "Ingresar usuario y contraseña", "Pulsar \"Iniciar sesión\""],
  datos: "admin / rambike2026", esperado: "Se redirige a la lista de productos.",
  criterio: "Pasó si la URL final es admin/productos.html." });
add({ id: "CP-24", hu: "HU-07", nombre: "Inicio de sesión inválido",
  pre: "Sin sesión iniciada.",
  pasos: ["Abrir admin/login.html", "Ingresar credenciales incorrectas", "Pulsar \"Iniciar sesión\""],
  datos: "admin / clave-erronea", esperado: "Aparece \"Usuario o contraseña incorrectos.\" y no se accede.",
  criterio: "Pasó si el mensaje es visible y se permanece en el login." });
add({ id: "CP-25", hu: "HU-07", nombre: "Acceso directo al panel sin sesión",
  pre: "Sin sesión iniciada.",
  pasos: ["Abrir directamente admin/productos.html"],
  datos: "Sin datos", esperado: "Se redirige al login.",
  criterio: "Pasó si la URL final es admin/login.html." });
add({ id: "CP-26", hu: "HU-07", nombre: "Listado de productos en el panel",
  pre: "Sesión de administrador iniciada.",
  pasos: ["Abrir admin/productos.html"],
  datos: "Catálogo inicial", esperado: "Se listan los 9 productos con opciones de editar y eliminar.",
  criterio: "Pasó si hay 9 filas, cada una con editar y eliminar." });
add({ id: "CP-27", hu: "HU-07", nombre: "Agregar producto y verlo en la tienda",
  pre: "Sesión de administrador iniciada.",
  pasos: ["Abrir admin/producto-form.html", "Completar el formulario", "Pulsar \"Guardar producto\"", "Abrir tienda.html"],
  datos: "Bomba de pie Test / Accesorios / 120.00 / Disponible", esperado: "El producto aparece en el panel y en la tienda.",
  criterio: "Pasó si aparece en ambas listas." });
add({ id: "CP-28", hu: "HU-07", nombre: "Validación: nombre obligatorio",
  pre: "Sesión de administrador iniciada.",
  pasos: ["Abrir admin/producto-form.html", "Dejar el nombre vacío y poner precio 50", "Pulsar \"Guardar producto\""],
  datos: "Nombre vacío / precio 50", esperado: "Se avisa que falta el nombre y no se guarda.",
  criterio: "Pasó si hay aviso y el catálogo sigue con 9 productos." });
add({ id: "CP-29", hu: "HU-07", nombre: "Validación: precio mayor que cero",
  pre: "Sesión de administrador iniciada.",
  pasos: ["Abrir admin/producto-form.html", "Nombre \"Prueba\" y precio 0", "Pulsar \"Guardar producto\""],
  datos: "Precio 0", esperado: "Se avisa que el precio no es válido y no se guarda.",
  criterio: "Pasó si hay aviso y el catálogo sigue con 9 productos." });
add({ id: "CP-30", hu: "HU-07", nombre: "Editar precio y ver el cambio en la tienda",
  pre: "Sesión de administrador iniciada.",
  pasos: ["Abrir admin/producto-form.html?id=1", "Cambiar el precio a 250", "Guardar", "Abrir tienda.html"],
  datos: "Llanta: 240.00 → 250.00", esperado: "La tienda muestra S/ 250.00 para la Llanta.",
  criterio: "Pasó si el precio visible en la tienda es S/ 250.00." });
add({ id: "CP-31", hu: "HU-07", nombre: "Marcar un producto como agotado",
  pre: "Sesión de administrador iniciada.",
  pasos: ["Abrir admin/producto-form.html?id=3", "Apagar el interruptor de disponibilidad", "Guardar", "Abrir producto.html?id=3"],
  datos: "Casco Enduro Pro → Agotado", esperado: "La ficha muestra \"Agotado\" y el botón de compra está deshabilitado.",
  criterio: "Pasó si el botón está deshabilitado." });
add({ id: "CP-32", hu: "HU-07", nombre: "Eliminar un producto",
  pre: "Sesión de administrador iniciada.",
  pasos: ["Abrir admin/productos.html", "Pulsar eliminar en \"Kit de Parches Premium\"", "Confirmar"],
  datos: "Producto id 6", esperado: "El producto desaparece y quedan 8.",
  criterio: "Pasó si la lista queda con 8 productos." });
add({ id: "CP-33", hu: "HU-07", nombre: "Crear una categoría",
  pre: "Sesión de administrador iniciada.",
  pasos: ["Abrir admin/categorias.html", "Pulsar \"+ Nueva categoría\"", "Escribir \"Ropa\"", "Abrir tienda.html"],
  datos: "Nombre: Ropa", esperado: "La categoría aparece en el panel y como filtro en la tienda.",
  criterio: "Pasó si el chip \"Ropa\" existe en la tienda." });
add({ id: "CP-34", hu: "HU-07", nombre: "No eliminar una categoría con productos",
  pre: "Sesión de administrador iniciada.",
  pasos: ["Abrir admin/categorias.html", "Pulsar eliminar en \"Luces\""],
  datos: "Categoría Luces (1 producto)", esperado: "Se avisa que no se puede eliminar y la categoría permanece.",
  criterio: "Pasó si hay aviso y \"Luces\" sigue en la lista." });
add({ id: "CP-35", hu: "HU-07", nombre: "Renombrar categoría mantiene sus productos",
  pre: "Sesión de administrador iniciada.",
  pasos: ["Abrir admin/categorias.html", "Editar \"Luces\" y guardar como \"Iluminación\"", "Abrir tienda.html y filtrar por \"Iluminación\""],
  datos: "Luces → Iluminación", esperado: "El filtro \"Iluminación\" muestra la Luz LED Trasera (1 producto).",
  criterio: "Pasó si el filtro nuevo muestra 1 producto." });
add({ id: "CP-36", hu: "HU-07", nombre: "Cerrar sesión protege el panel",
  pre: "Sesión de administrador iniciada.",
  pasos: ["Pulsar \"Cerrar sesión\"", "Abrir admin/productos.html"],
  datos: "Sin datos", esperado: "Se vuelve al login y el panel ya no abre.",
  criterio: "Pasó si el acceso posterior redirige al login." });
add({ id: "CP-37", hu: "HU-07", nombre: "Texto con código HTML en el nombre (exploratoria)",
  pre: "Sesión de administrador iniciada.",
  pasos: ["Crear un producto cuyo nombre sea una etiqueta HTML con un evento", "Abrir tienda.html"],
  datos: "Nombre: <img src=x onerror=…>", esperado: "El nombre se muestra como texto y no ejecuta código.",
  criterio: "Pasó si no se ejecuta el código ni se crea una imagen dentro del nombre." });

// ---------- Flujo E2E ----------
add({ id: "E2E-01", hu: "HU-01 a HU-06", nombre: "Compra completa del cliente hasta WhatsApp",
  pre: "Catálogo inicial y carrito vacío.",
  pasos: ["Inicio → Tienda", "Abrir el Manillar", "Añadir al carro", "Abrir el carrito", "Enviar pedido por WhatsApp"],
  datos: "Manillar x1", esperado: "Se llega al resumen con enlace de WhatsApp válido en 5 clics o menos.",
  criterio: "Pasó si el resumen y el enlace existen y los clics son 5 o menos." });

module.exports = C;
