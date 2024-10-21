import os
import argparse
from imutils import paths


def get_train_path():
    '''Get path to clean.
    '''

    ap = argparse.ArgumentParser()
    ap.add_argument(
        '-p', '--path', required=True,
        help='Path to clean.'
    )

    args = vars(ap.parse_args())

    path = os.path.realpath(args['path'])

    return path


def clean_directory(path: str):
    '''Helps you clean the given path.
    '''

    # Valid files
    valid_extensions = '.zip', '.pt'
    filenames = list(paths.list_files(path, validExts=valid_extensions))

    for filename in filenames:

        best_model_name, last_model_name = 'best.pt', 'last.pt'

        if filename.endswith(best_model_name) or filename.endswith(last_model_name):
            continue

        print(f'[INFO] Deleting {filename}')
        os.remove(filename)



if __name__ == '__main__':

    path = get_train_path()

    clean_directory(path)
