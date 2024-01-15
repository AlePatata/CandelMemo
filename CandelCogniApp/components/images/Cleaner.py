import os

directorio_descargas = r"..\CogniApp\CandelCogniApp\assets\reptiles"

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
archivo_js_existente = '..\CogniApp\CandelCogniApp\components\images\pattern.js'

# Genera el contenido adicional del arreglo
js_content_addition = ''

# Agrega las rutas de las imágenes al contenido adicional
for i, img_path in enumerate(image_paths, start=1):
    img_path_normalized = img_path.replace("\\", "/")
    name = img_path_normalized[:-4]
    js_content_addition += f'        {{id: {i}, path: require("../../assets/reptiles/{img_path_normalized}"), "name":"{name}", "size_w":300, "size_h":300}},\n'


# Abre el archivo existente en modo de escritura (append)
with open(archivo_js_existente, 'a') as js_file:
    # Agrega el contenido adicional al final del archivo
    js_file.write(js_content_addition)

print(f"Se han agregado las nuevas rutas al archivo JS existente: {archivo_js_existente}")


