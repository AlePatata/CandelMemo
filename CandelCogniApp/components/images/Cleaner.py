'''
Cleaner.py es un script que se encarga de agregar las rutas de las imágenes a pattern.js
para ser utilizadas en la aplicación. Este conserva el patrón de {id, path, name} para cada imagen.
Recibe como parámetro el nombre de la carpeta donde se encuentran las imágenes, en este caso 'Arrows'
y escribe la final de pattern una lista con el patron para cada imagen en la carpeta. Luego se debe categorizar
en el nivel deseado directamente desde pattern.js.

'''

import os

# Nombre carpeta imágenes
carpeta = 'Arrows'

# Ruta absoluta del directorio actual
images = os.path.dirname(os.path.abspath(__file__))
components = os.path.dirname(images)
CandelCogniApp = os.path.dirname(components)

directorio_descargas = os.path.join(CandelCogniApp, 'assets', carpeta)

# Lista para almacenar las rutas relativas de las imágenes
image_paths = []

# Recorre los archivos en el directorio de descargas
for root, dirs, files in os.walk(directorio_descargas):
    for file in files:
        # Verifica si el archivo es una imagen en formato PNG
        if file.endswith('.png'):
            img_path = os.path.join(file)
            image_paths.append(img_path)

# Ruta del archivo JS existente
archivo_js_existente = os.path.join(images, 'pattern.js')

# Genera el contenido adicional del arreglo
js_content_addition = ''

print(f'Image paths: {image_paths}')

# Agrega las rutas de las imágenes al contenido adicional
for i, img_path in enumerate(image_paths, start=1):
    img_path_normalized = img_path.replace("\\", "/")
    name = img_path_normalized[:-4]
    js_content_addition += f'        {{id: {i}, path: require("../../assets/{carpeta}/{img_path_normalized}"), "name":"{name}"}},\n'

print(f'Contenido a agregar: {js_content_addition}')

# Abre el archivo existente en modo de escritura (append)
with open(archivo_js_existente, 'a') as f:
    # Escribe el contenido adicional en el archivo
    f.write(js_content_addition)

print(f"Se han agregado las nuevas rutas al archivo JS existente: {archivo_js_existente}")


