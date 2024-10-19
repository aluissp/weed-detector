
def search_word(file_path, word):
    '''Search for a word in a log/text file.

    Args:
        file_path (str): The path to the file.
        word (str): The word to search.

    Returns:
        list: A list with the lines found with the word.
    '''
    with open(file_path, encoding='utf8') as file:

        lines_found = []

        for line in file:
            line = line.strip()

            if word not in line:
                continue

            lines_found.append(line)

        if not lines_found:
            raise ValueError(f'No lines found with the word "{word}".')

        return lines_found
