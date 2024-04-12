# MEMO guia uso

## Carpetas y archivos importantes
- Archivo para controlar navegación temporalmente: `App.js`
### /components
   - Lógica principal del juego: `WithImages.js`
   - Componente encargada de la visualización de las tarjetas: `Matriz.js`
   - Tutorial: `Tutorial.js`
   - Modal final del juego: `FinishModal.js`
   - Pantalla de inicio temporal: `MainPage.js`
   - Lógica primera versión del juego (trabaja con iconos. En desuso): `Game.js`
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

## Tareas pendientes

### Repetición de la animación de voltear cartas
Este bug ocurre cuando luego de pasados los 3 segundos para voltear las tarjetas se abre y cierra el tutorial. Esto causa que la animación se repita nuevamente 4 veces para finalmente quedarse como tarjetas boca abajo (con el simbolo '?'). Posterior a esto el juego se reanuda con normalidad.

### Delay
Existen ciertos delay que no afectan el funcionamiento principal del juego pero están ahí. 
Estos son: 
- Delay visualización del temporizador de la terapia. La visualización de los 4 minutos suele atrasarse con respecto al tiempo real, pero en funcionamiento se termina correctamente a los 4 minutos. En general esto podría causar confusión al usuario al ver que se termina el juego cuando aún sale que le quedan unos 10 segundos en la pantalla.
- Delay al modificar variable de puntuación score. Este se solucionó parcialmente con dos funciones que usan variables auxiliares para actualizar la puntuación.

