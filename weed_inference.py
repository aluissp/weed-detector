import argparse
from imutils import paths


ap = argparse.ArgumentParser()
ap.add_argument(
    '-d', '--image-testing-dir', required=True,
    help='Path to the directory containing the images to be tested'
)
ap.add_argument(
    '-m', '--model-path', required=True,
    help='Path to the model to be used for the inferences.'
)
ap.add_argument(
    '-s', '--save-inferences', action='store_true',
    help='Save the inferences?'
)
ap.add_argument(
    '-o', '--output-dir', type=str, default='out/inferences',
    help='Path where the inferences will be saved.'
)


args = vars(ap.parse_args())

image_paths = list(paths.list_images(args['image_testing_dir']))

print('args:', args)
