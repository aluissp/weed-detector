import argparse
import fix_paths
from imutils import paths
from preprocessing import AspectAwarePreprocessor, ManualDatasetSplitter


ap = argparse.ArgumentParser()
ap.add_argument(
    '-d', '--dataset-dir', required=True,
    help='Path to the dataset directory.'
)
ap.add_argument(
    '-o', '--output-dir', required=True,
    help='Path where the correct images will be saved.'
)
ap.add_argument(
    '--preprocess-aspect-aware-size', type=int, default=-1,
    help='Preprocess the images to be aspect-aware.'
)
ap.add_argument(
    '-r', '--reset-register', action='store_true',
    help='Reset the register of the images.'
)

args = vars(ap.parse_args())

image_paths = list(paths.list_images(args['dataset_dir']))


preprocessors = []

if args['preprocess_aspect_aware_size'] > 0:

    size = args['preprocess_aspect_aware_size']
    preprocessors.append(AspectAwarePreprocessor(size, size))


splitter = ManualDatasetSplitter(
    image_paths=image_paths,
    dir_to_save_images=args['output_dir'],
    preprocessors=preprocessors,
    reset_register=args['reset_register']
)


splitter.run()
