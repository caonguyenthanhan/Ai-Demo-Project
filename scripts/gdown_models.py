import gdown
import os

# Google Drive folder ID
folder_url = "https://drive.google.com/drive/folders/1vi95ZM9cfAD75l1NpoMjEo-X4wQZperD?usp=sharing"
output_dir = os.path.join(os.getcwd(), "models")

# Tải toàn bộ folder
gdown.download_folder(folder_url, output=output_dir, quiet=False, use_cookies=False)
