# MEMO guia uso

## Carpetas y archivos importantes
- Archivo para controlar navegación temporalmente: `App.js`
### /components
   - Lógica principal del juego: `WithImages.js`
   - Componente encargada de la visualización de las tarjetas: `Matriz.js`
   - Tutorial: Tutorial.js
   - Modal final del juego: `FinishModal.js`
   - Pantalla de inicio temporal: `MainPage.js`
   - Lógica primera versión del juego (en desuso): `Game.js`
### /components/images
   - Lista con las rutas de las imagenes: `pattern.js`
   - Script auxiliar para escribir rutas de imagenes en formato: `Cleaner.py`
   - Script auxiliar parar descargar imagenes png: `ToDownload.py`
### /components/buttons
   - Botón (CustomButton): button.js
### /components/elementos
   - Temporizador para duración la sesión de terapia: `timer.js`
### /assets
   - Pool de imágenes: se encuentran ordenadas por carpetas dentro de la carpeta assets, y son: `animals`, `Arrows`, `Birds`, `fruits`, `marineAnimals`, `objects`, `reptiles` 
### /styles
   - Estilos globales: `globalStyles.js`
   - Colores: `colors.js`
   - Estilos para el tutorial (basado en tutorialModalStyle del RALO): `tutorialModalStyle.js`