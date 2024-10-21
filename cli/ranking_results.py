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


class RankingResults:
    '''Class to rank the best metrics from the train results folder.
    '''

    def __init__(self, cli_parser: argparse.ArgumentParser):
        '''Constructor of the RankingResults class.

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
        self.best_metrics = pd.DataFrame()
        self.last_metrics = pd.DataFrame()
        self.metrics = {}

    def load_metrics(self):
        '''Load the metrics from the train results folder.
        '''

        for filename in self.filenames:

            if filename.endswith('metrics.json'):
                continue

            with open(filename, 'r') as file:
                data = json.load(file)

            for key in ['best_metrics', 'last_metrics']:

                data['metrics'][key]['path'] = data['metrics']['path']

                data_df = pd.DataFrame([data['metrics'][key]])

                setattr(self, key, pd.concat([getattr(self, key), data_df], ignore_index=True))

    def save_results(self):
        '''Save the best metrics in a json/excel files.
        '''

        # Save ranking in excel file
        file_path = os.path.join(self.path, 'ranking.xlsx')

        with pd.ExcelWriter(file_path) as writer:

            for name in ['best_metrics', 'last_metrics']:

                self.metrics[name] = {}

                df = getattr(self, name)

                for key in ['metrics/mAP50(B)', 'metrics/mAP50-95(B)', 'fitness']:

                    # Sort and get best metric
                    df.sort_values(by=key, ascending=False, inplace=True)

                    self.metrics[name][key] = df.iloc[0].to_dict()

                    # Save in excel file
                    key = key.replace('/', '-')
                    df.to_excel(writer, sheet_name=f'{key}-ranking', index=False)

        # Save best metrics in json file
        file_path = os.path.join(self.path, 'metrics.json')

        with open(file_path, 'w') as file:
            json.dump(self.metrics, file, indent=4)

    def run(self):

        # Sort the metrics
        self.load_metrics()

        # Save the results
        self.save_results()


if __name__ == '__main__':
    cli_parser = parser()
    RankingResults(cli_parser).run()
