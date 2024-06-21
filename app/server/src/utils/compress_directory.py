import os
import shutil


def compress_directory(directory_path: str):

    foldername = directory_path.split(os.path.sep).pop()

    shutil.make_archive(foldername, 'zip', directory_path)

    filename = f'{foldername}.zip'

    file_compressed_path = os.path.join(os.getcwd(), filename)

    shutil.move(file_compressed_path, directory_path)

    return os.path.join(directory_path, filename)
