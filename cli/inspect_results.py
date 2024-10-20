import os
import json
import argparse
import fix_paths
from imutils import paths
from utils.inspect_results import search_word, get_best_metrics

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


def inspection_parser():
    '''Parse the arguments of the inspection cli script.

    Returns:
        argparse.ArgumentParser: The arguments of the inspection cli script.
    '''

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
        '-s', '--save-inspection', action='store_true',
        help='Save inspection in JSON format.'
    )
    ap.add_argument(
        '-d', '--destination-path', type=str, default='out',
        help='The path where the inspection file will be save.'
    )

    return ap


class InspectionResults:
    '''Class to store the inspection results.'''

    def __init__(self, cli_parser: argparse.ArgumentParser):
        '''Initialize the inspection results.

        Args:
            cli_parser (argparse.ArgumentParser): CLI parser object.
        '''

        args = vars(cli_parser.parse_args())

        # CLI arguments
        self.train_path = os.path.realpath(args['path'])
        self.destination_path = args['destination_path']
        self.word = args['word']
        self.mode = args['mode']
        self.save_inspection = args['save_inspection']
        self.cli_parser = cli_parser

        # Valid files
        valid_extensions = '.csv', '.pt', '.json', '.yaml', '.yml', '.txt', '.log'
        self.filenames = list(paths.list_files(self.train_path, validExts=valid_extensions))

        # Paths that will be used in the inspection
        self.results_csv_path = None
        self.best_model_path = None
        self.last_model_path = None
        self.output_log_paths = []

        # Inspection results
        self.inspection_results = {
            'path': self.train_path,
            'word': self.word,
            'mode': self.mode,
            'inspection_name': None,
            'metrics': None,
            'logs': None,
            'models': None
        }

        if self.mode in [inspection_modes['all'], inspection_modes['logs']] and self.word is None:
            self.cli_parser.error(
                f'The word argument is required for {inspection_modes["all"]} or {inspection_modes["logs"]} mode.'
            )

        print(f'[INFO] Inspecting the results at: {self.train_path}')

    def load_file_paths(self):
        '''Load the file paths.'''

        for filename in self.filenames:

            results_csv_name = 'results.csv'

            if filename.endswith(results_csv_name) and self.results_csv_path is None:
                self.results_csv_path = filename
            elif filename.endswith(results_csv_name) and self.results_csv_path is not None:
                self.cli_parser.error(
                    'It looks like the folder has more than one results.csv file. The inspection was aborted!'
                )

            best_model_name, last_model_name = 'best.pt', 'last.pt'

            if filename.endswith(best_model_name) and self.best_model_path is None:
                self.best_model_path = filename
            elif filename.endswith(best_model_name) and self.best_model_path is not None:
                self.cli_parser.error(
                    'It looks like the folder has more than one best.pt file. The inspection was aborted!'
                )

            if filename.endswith(last_model_name) and self.last_model_path is None:
                self.last_model_path = filename
            elif filename.endswith(last_model_name) and self.last_model_path is not None:
                self.cli_parser.error(
                    'It looks like the folder has more than one last.pt file. The inspection was aborted!'
                )

            output_log_name = 'output.log'

            if filename.endswith(output_log_name):
                self.output_log_paths.append(filename)

    def check_missing_files(self):
        '''Check if the required files are missing.'''

        if self.results_csv_path is None:
            print('[WARNING] The results.csv file is missing.')

        if self.best_model_path is None:
            print('[WARNING] The best.pt file is missing.')

        if self.last_model_path is None:
            print('[WARNING] The last.pt file is missing.')

        if len(self.output_log_paths) == 0:
            print('[WARNING] The output.log file is missing.')

    def inspect_metrics(self):
        '''Inspect the metrics of the training.'''

        if self.mode not in [inspection_modes['all'], inspection_modes['metrics']]:
            return

        try:
            best_metrics, last_metrics = get_best_metrics(self.results_csv_path)
            self.inspection_results['metrics'] = {
                'path': self.results_csv_path,
                'best_metrics': best_metrics,
                'last_metrics': last_metrics
            }
        except Exception as e:
            print(f'[WARNING] {e}')

    def inspect_logs(self):
        '''Inspect the logs of the training.'''

        if self.mode not in [inspection_modes['all'], inspection_modes['logs']]:
            return

        logs_inspection = []

        for output in self.output_log_paths:
            try:
                lines = search_word(output, self.word)
                logs_inspection.append({'path': output, 'lines': lines})
            except Exception as e:
                print(f'[WARNING] {e}')

        self.inspection_results['logs'] = logs_inspection

    def inspect_models(self):
        '''Inspect the models of the training.'''

        if self.mode not in [inspection_modes['all'], inspection_modes['model']]:
            return

        models_args = []

        if self.best_model_path is not None:
            models_args.append({
                'name': 'best',
                'path': self.best_model_path,
                'train_args': None
            })

        if self.last_model_path is not None:
            models_args.append({
                'name': 'last',
                'path': self.last_model_path,
                'train_args': None
            })

        self.inspection_results['models'] = models_args

    def print_metrics(self):
        '''Print the metrics of the training.'''

        if not self.inspection_results['metrics']:
            return

        epoch = self.inspection_results['metrics']['best_metrics']['epoch']
        mAP_5 = self.inspection_results['metrics']['best_metrics']['metrics/mAP50(B)']
        mAP_5_95 = self.inspection_results['metrics']['best_metrics']['metrics/mAP50-95(B)']
        recall = self.inspection_results['metrics']['best_metrics']['metrics/recall(B)']
        precision = self.inspection_results['metrics']['best_metrics']['metrics/precision(B)']
        fitness = self.inspection_results['metrics']['best_metrics']['fitness']

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

    def print_logs(self):
        '''Print the logs of the training.'''

        if not self.inspection_results['logs']:
            return

        for log in self.inspection_results['logs']:
            print(f'Log file: {log["path"]}')
            for line in log['lines']:
                print(line)

    def save_inspection_in_json(self):
        '''Save the inspection in JSON format.'''

        if not self.save_inspection:
            return

        parent_dir = self.train_path.split(os.path.sep)[-1]
        inspection_name = f'{parent_dir}_inspection.json'

        if not os.path.exists(self.destination_path):
            os.makedirs(self.destination_path)

        is_name_ok = False

        while not is_name_ok:

            input_message = f'\nPlease, type the filename. Press enter to use the default name: {inspection_name}\n'
            user_inspection_name = input(input_message)

            if user_inspection_name == '':
                is_name_ok = True

            elif user_inspection_name.endswith('.json'):
                inspection_name = user_inspection_name
                is_name_ok = True

            else:
                print('The inspection name must end with .json')

            if os.path.exists(os.path.join(self.destination_path, inspection_name)):
                print('The inspection file already exists. Please, choose another name.')
                is_name_ok = False

        self.inspection_results['inspection_name'] = inspection_name

        destination_path = os.path.join(self.destination_path, inspection_name)

        with open(destination_path, 'w') as file:
            json.dump(self.inspection_results, file, indent=4)

        print(f'[INFO] The inspection was saved at: {destination_path}')

    def inspect(self):
        '''Inspect the results of the training.'''

        # Load the file paths
        self.load_file_paths()

        # Check missing files
        self. check_missing_files()

        # Inspect the metrics
        self.inspect_metrics()

        # Inspect the logs
        self.inspect_logs()

        # Inspect models
        self.inspect_models()

        # Print the metrics
        self.print_metrics()

        # Print the logs
        self.print_logs()

        # Save the inspection
        self.save_inspection_in_json()


if __name__ == '__main__':

    # Parse the arguments
    ap = inspection_parser()

    # Inspect the results
    InspectionResults(ap).inspect()
