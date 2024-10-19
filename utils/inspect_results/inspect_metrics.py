import pandas as pd


def get_best_metrics(path: str):
    '''Get the best metrics based on best epoch. The file must be a ultralytics `results.csv` file.

    Args:
        path (str): The path to the results file, it must be a CSV file.

    Returns:
        dict: The best metrics.

    Raises:
        ValueError: If the file is not a CSV file.
        KeyError: If the `results.csv` doesn't have metrics keys.
    '''

    if not path.endswith('.csv'):
        raise ValueError('The file must be a CSV file.')

    results = pd.read_csv(path)

    results.columns = results.columns.str.strip()

    mAP_5_key, mAP_5_95_key = 'metrics/mAP50(B)', 'metrics/mAP50-95(B)'

    for key in [mAP_5_key, mAP_5_95_key]:

        if key in results.columns:
            continue

        raise KeyError(f'The file must have the column {key} like ultralytics results.csv format.')

    results['fitness'] = results[mAP_5_key] * 0.1 + results[mAP_5_95_key] * 0.9

    best_epoch = results['fitness'].idxmax()

    best_metrics = dict(results.iloc[best_epoch, :])

    return best_metrics
