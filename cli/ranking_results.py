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
    ap.add_argument(
        '-o', '--output', type=str,
        help='Path to the output folder to save the ranking results.'
    )
    ap.add_argument(
        '--excel', action='store_true',
        help='Read only excel files mode.'
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
        self.output = os.path.realpath(args['output']) if args['output'] else self.path
        self.read_excel = args['excel']

        # Valid files
        valid_extensions = ('.xlsx',) if self.read_excel else ('.json',)
        self.filenames = list(paths.list_files(self.path, validExts=valid_extensions))

        # Results
        self.metrics_names = ['best_metrics', 'last_metrics']
        setattr(self, self.metrics_names[0], pd.DataFrame())
        setattr(self, self.metrics_names[1], pd.DataFrame())

        # Default values
        self.excel_filename = 'ranking.xlsx'
        self.sheet_names = ['best-mAP50-ranking', 'last-mAP50-ranking']

    def load_json_files(self):
        '''Load the metrics from the train results folder. '''
        for filename in self.filenames:

            with open(filename, 'r') as file:
                data = json.load(file)

            if 'metrics' not in data:
                continue

            for metric in self.metrics_names:

                if metric not in data['metrics']:
                    continue

                data['metrics'][metric]['path'] = data['metrics']['path']

                data_df = pd.DataFrame([data['metrics'][metric]])

                setattr(self, metric, pd.concat([getattr(self, metric), data_df], ignore_index=True))

    def load_excel_files(self):
        '''Load excel files from the train results folder.'''

        for filename in self.filenames:

            for metric, sheet in zip(self.metrics_names, self.sheet_names):

                df = pd.read_excel(filename, sheet_name=sheet)

                setattr(self, metric, pd.concat([getattr(self, metric), df], ignore_index=True))

    def save_results(self):
        '''Save the best metrics in a json/excel files.
        '''
        is_name_ok = False
        excel_filename = ''

        while not is_name_ok:
            # Ask for the excel filename
            excel_filename = input('Enter the excel filename: ')
            excel_filename = self.excel_filename if excel_filename == '' else excel_filename
            excel_filename = excel_filename if excel_filename.endswith('.xlsx') else f'{excel_filename}.xlsx'

            print(f'Excel filename: {excel_filename}')

            is_name_ok = input('Is the name ok? (y/n): ').lower() == 'y'

        # Check if the output folder exists
        if not os.path.exists(self.output):
            os.makedirs(self.output)

        # Save ranking in excel file
        file_path = os.path.join(self.output, excel_filename)

        with pd.ExcelWriter(file_path) as writer:

            summary_df = pd.DataFrame()
            summary_df.to_excel(writer, sheet_name='summary', index=False)

            for name in self.metrics_names:

                df = getattr(self, name)

                for key in ['metrics/mAP50(B)', 'metrics/mAP50-95(B)', 'fitness']:

                    # Sort and get best metric
                    df.sort_values(by=key, ascending=False, inplace=True)

                    row = {
                        'metric-name': name,
                        'metric-sorted': key,
                        **df.iloc[0].to_dict()
                    }

                    summary_df = pd.concat([summary_df, pd.DataFrame([row])], ignore_index=True)

                    # Save in excel file
                    key = key.replace('metrics/', '').replace('(B)', '')
                    df.to_excel(writer, sheet_name=f"{name.replace('_metrics', '')}-{key}-ranking", index=False)

            summary_df.to_excel(writer, sheet_name='summary', index=False)

    def run(self):

        # Check if files exist
        if not self.filenames:
            extension = '.xlsx' if self.read_excel else '.json'
            print(f'[WARNING] It looks like there are no files with {extension} extension.')
            return

        # Load files
        if self.read_excel:
            self.load_excel_files()
        else:
            self.load_json_files()

        # Save the results
        self.save_results()


if __name__ == '__main__':
    cli_parser = parser()
    RankingResults(cli_parser).run()
