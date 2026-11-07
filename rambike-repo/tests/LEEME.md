# Pruebas automatizadas de RAMBIKE.PE

Ejecuta los 38 casos de prueba del informe TA2 contra el prototipo y vuelve a generar
results.json, axe.json, contrast.json y las capturas (carpeta shots).

## Pasos (Windows)
1. Instala Node.js (nodejs.org) si no lo tienes.
2. Abre una terminal en esta carpeta y escribe:  npm install
3. Instala el navegador de pruebas:  npx playwright install chromium
4. En OTRA terminal, dentro de la carpeta del prototipo, levanta el sitio:
   python -m http.server 8080
5. En la primera terminal escribe:  npm test
   (si el prototipo está en otra carpeta: set PROJECT_DIR=C:\ruta\rambike-prototype)

Cada línea muestra PASS o FAIL con lo observado. Los casos que fallan hoy son
CP-03, CP-22, CP-35 y CP-37; después de corregir el código deben pasar (regresión).

Nota: las fotos de picsum.photos se sustituyen por un cuadro gris durante la prueba.
cases.js contiene las precondiciones, pasos, datos, resultado esperado y criterio de cada caso.
