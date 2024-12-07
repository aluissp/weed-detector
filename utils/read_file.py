

def read_file(file_path: str, mode: str = 'r') -> list[str]:
    '''Read file content

    Args:
    ----
        file_path (str): Path to the file
        mode (str): Mode to open the file

    Returns:
    --------
        list[str]: Content of the file
    '''
    with open(file_path, mode) as file:
        content = file.readlines()

    return content
