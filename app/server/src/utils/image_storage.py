import os
from flask import current_app
from werkzeug.utils import secure_filename
from werkzeug.datastructures import FileStorage


def save_image(image: FileStorage) -> tuple[str]:

    if image.content_type is None:
        return None, 'No image found'

    if image.content_type not in ['image/jpeg', 'image/png', 'image/jpg']:
        return None, 'Invalid image format'

    filename = secure_filename(image.filename)
    filepath = os.path.join(current_app.config['imgs'], filename)
    image.save(filepath)

    return filepath, None


def delete_files(*files) -> None:
    for file in files:
        os.remove(file)
