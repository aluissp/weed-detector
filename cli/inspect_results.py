import os
import sys
import argparse
from imutils import paths

# Adding utils to sys path
current_dir = os.path.dirname(os.path.realpath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)

help_message = '''
This cli script helps you to inspect the results
of model training based on ultralytics results folder structure.
'''

inspection_modes = {
    'all': 'inspect-all',
    'logs': 'inspect-logs',
    'metrics': 'inspect-metrics',
    'model': 'inspect-model'
}

ap = argparse.ArgumentParser(description=help_message)
ap.add_argument(
    '-p', '--path', required=True,
    help='Path to the train results folder.'
)
ap.add_argument(
    '-w', '--word', type=str,
    help='The key word to search.'
)
ap.add_argument(
    '-m', '--mode', default=inspection_modes['all'],
    choices=inspection_modes.values(),
    help='Set the mode to inspect. Available options are: inspect-all (default), inspect-logs, inspect-metrics and inspect-model.'
)
ap.add_argument(
    '-v', '--verbose', action='store_true',
    help='Verbose mode.'
)
ap.add_argument(
    '-s', '--save-inspection', action='store_true',
    help='Save inspection in JSON format.'
)
ap.add_argument(
    '-d', '--destination-path', type=str, default='out',
    help='The path where the inspection file will be save.'
)

args = vars(ap.parse_args())

train_path = args['path']
destination_path = args['destination_path']
word = args['word']
mode = args['mode']
verbose = args['verbose']
save_inspection = args['save_inspection']


if mode in [inspection_modes['all'], inspection_modes['logs']] and word is None:
    ap.error(f'The word argument is required for {inspection_modes["all"]} or {inspection_modes["logs"]} mode.')


if verbose:
    print(f'[INFO] Inspecting the results at: {train_path}')

valid_extensions = '.csv', '.pt', '.json', '.yaml', '.yml', '.txt', '.log'
filenames = list(paths.list_files(train_path, validExts=valid_extensions))

# Paths that will be used in the inspection
results_csv_path = None
best_model_path = None
last_model_path = None
output_log_paths = []

# Inspection results
inspection_results = {
    'path': train_path,
    'word': word,
    'mode': mode,
    'inspection_name': None,
    'metrics': None,
    'logs': None,
    'models': None
}

for filename in filenames:

    results_csv_name = 'results.csv'

    if filename.endswith(results_csv_name) and results_csv_path is None:
        results_csv_path = filename
    elif filename.endswith(results_csv_name) and results_csv_path is not None:
        ap.error('It looks like the folder has more than one results.csv file. The inspection was aborted!')

    best_model_name, last_model_name = 'best.pt', 'last.pt'

    if filename.endswith(best_model_name) and best_model_path is None:
        best_model_path = filename
    elif filename.endswith(best_model_name) and best_model_path is not None:
        ap.error('It looks like the folder has more than one best.pt file. The inspection was aborted!')

    if filename.endswith(last_model_name) and last_model_path is None:
        last_model_path = filename
    elif filename.endswith(last_model_name) and last_model_path is not None:
        ap.error('It looks like the folder has more than one last.pt file. The inspection was aborted!')

    output_log_name = 'output.log'

    if filename.endswith(output_log_name):
        output_log_paths.append(filename)

if results_csv_path is None:
    print('[WARNING] The results.csv file is missing.')

if best_model_path is None:
    print('[WARNING] The best.pt file is missing.')

if last_model_path is None:
    print('[WARNING] The last.pt file is missing.')

if len(output_log_paths) == 0:
    print('[WARNING] The output.log file is missing.')


if mode in [inspection_modes['all'], inspection_modes['metrics']]:
    from utils.inspect_results import get_best_metrics

    try:
        best_metrics = get_best_metrics(results_csv_path)
        inspection_results['metrics'] = {
            'path': results_csv_path,
            'best_metrics': best_metrics
        }
    except Exception as e:
        print(f'[WARNING] {e}')

if mode in [inspection_modes['all'], inspection_modes['logs']]:
    from utils.inspect_results import search_word

    logs_inspection = []

    for output in output_log_paths:
        try:
            lines = search_word(output, word)
            logs_inspection.append({'path': output, 'lines': lines})
        except Exception as e:
            print(f'[WARNING] {e}')

    inspection_results['logs'] = logs_inspection


if mode in [inspection_modes['all'], inspection_modes['model']]:

    models_args = []

    if best_model_path is not None:
        models_args.append({
            'name': 'best',
            'path': best_model_path,
            'train_args': None
        })

    if last_model_path is not None:
        models_args.append({
            'name': 'last',
            'path': last_model_path,
            'train_args': None
        })

    inspection_results['models'] = models_args

if inspection_results['metrics']:

    epoch = inspection_results['metrics']['best_metrics']['epoch']
    mAP_5 = inspection_results['metrics']['best_metrics']['metrics/mAP50(B)']
    mAP_5_95 = inspection_results['metrics']['best_metrics']['metrics/mAP50-95(B)']
    recall = inspection_results['metrics']['best_metrics']['metrics/recall(B)']
    precision = inspection_results['metrics']['best_metrics']['metrics/precision(B)']
    fitness = inspection_results['metrics']['best_metrics']['fitness']

    print(f'''
[INFO] Best metrics:
Best model was saved at epoch: {epoch}
Metrics:
  - mAP50: {mAP_5}
  - mAP50-95: {mAP_5_95}
  - Recall: {recall}
  - Precision: {precision}
  - Fitness: {fitness}
''')


if inspection_results['logs']:

    print(f'[INFO] Logs inspection:')

    for log in inspection_results['logs']:
        print(f'Log file: {log["path"]}')
        for line in log['lines']:
            print(line)
