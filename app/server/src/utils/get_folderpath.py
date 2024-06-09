import os


def get_folderpath(base_path: str, subpath: str) -> str:
    return os.path.join(os.path.dirname(base_path), subpath)


def get_runs_path(base_path: str) -> str:
    base_path = os.path.dirname(base_path)
    base_path = base_path.split(os.path.sep)
    base_path.pop()

    base_path = f'{os.path.sep}{os.path.join(*base_path)}'

    os.chdir(base_path)

    return os.path.join(base_path, 'runs', 'detect')
