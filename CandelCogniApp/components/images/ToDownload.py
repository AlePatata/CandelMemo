'''

ToDownload.py es un script que se encarga de descargar las imágenes de la página https://pngimg.com/images/
para ser utilizadas en la aplicación. Se puede configurar la variable url para descargar desde cualquier página
que contenga imágenes en formato PNG y que lo permita. Recomiendo usar esa página ya que fue la que se utilizó
para encontrar la mayoría de las imágenes que se usan en la aplicación.
Además se debe configurar la variable output_directory para que las imágenes se guarden en la carpeta deseada.

'''

import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

# URL de la página
url = "https://pngimg.com/images/fruits/"
# Realiza la solicitud GET a la página
response = requests.get(url)

# Verifica si la solicitud fue exitosa
if response.status_code == 200:
    # Parsea el contenido HTML de la página
    soup = BeautifulSoup(response.text, 'html.parser')

    # Encuentra todos los elementos 'img' en la página
    img_tags = soup.find_all('img')

    # Directorio donde se guardarán las imágenes
    output_directory = 'fruits'
    os.makedirs(output_directory, exist_ok=True)

    # Descarga cada imagen encontrada
    for img_tag in img_tags:
        img_url = urljoin(url, img_tag['src'])
        img_name = os.path.join(output_directory, os.path.basename(img_url))
        
        # Descarga la imagen
        with open(img_name, 'wb') as img_file:
            img_file.write(requests.get(img_url).content)

        print(f"Descargada: {img_name}")
else:
    print(f"No se pudo acceder a la página. Código de estado: {response.status_code}")