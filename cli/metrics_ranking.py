import os
import json
import argparse
import pandas as pd
from imutils import paths


help_message = '''
This cli script helps you to get the best metrics from the train results folder.
'''


def parser():
    '''Parse the arguments of the inspection cli script.

    Returns:
        argparse.ArgumentParser: The arguments of the inspection cli script.
    '''

    ap = argparse.ArgumentParser(description=help_message)
    ap.add_argument(
        '-p', '--path', required=True,
        help='Path to the train results folder.'
    )

    return ap


class MetricsRanking:
    '''Class to rank the best metrics from the train results folder.
    '''

    def __init__(self, cli_parser: argparse.ArgumentParser):
        '''Constructor of the MetricsRanking class.

        Args:
            cli_parser (argparse.ArgumentParser): The arguments of the inspection cli script.
        '''

        args = vars(cli_parser.parse_args())

        # CLI arguments
        self.path = os.path.realpath(args['path'])

        # Valid files
        valid_extensions = ('.json',)
        self.filenames = list(paths.list_files(self.path, validExts=valid_extensions))

        # Results
        self.metrics_sorted = pd.DataFrame()
        self.best_metric = {}

    def sort_metrics(self):
        '''Sort the metrics from the train results folder.
        '''

        for filename in self.filenames:

            if filename.endswith('best_metric.json'):
                continue

            with open(filename, 'r') as file:
                data = json.load(file)

            metric = data['metrics']['best_metrics']
            metric['path'] = data['metrics']['path']

            metric = pd.DataFrame([metric])

            self.metrics_sorted = pd.concat([self.metrics_sorted, metric], ignore_index=True)

        self.metrics_sorted.sort_values(by='fitness', ascending=False, inplace=True)

        self.best_metric = self.metrics_sorted.iloc[0].to_dict()

    def save_results(self):
        '''Save the best metrics in a excel file.
        '''

        file_path = os.path.join(self.path, 'ranking.xlsx')

        self.metrics_sorted.to_excel(file_path, index=False)

        file_path = os.path.join(self.path, 'best_metric.json')

        with open(file_path, 'w') as file:
            json.dump(self.best_metric, file)

    def run(self):
        '''Run the MetricsRanking class.
        '''

        # Sort the metrics
        self.sort_metrics()

        # Save the results
        self.save_results()


if __name__ == '__main__':
    cli_parser = parser()
    MetricsRanking(cli_parser).run()
