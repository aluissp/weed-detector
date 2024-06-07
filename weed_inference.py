import argparse
from inference import InferenceImages


ap = argparse.ArgumentParser()
ap.add_argument(
    '-d', '--images-dir', required=True,
    help='Directory containing the images to be tested'
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
    '-o', '--output-path', type=str, default='out/inferences',
    help='Path where the inferences will be saved.'
)
ap.add_argument(
    '-n', '--num-images', type=int, default=-1,
    help='Number of images to be tested, -1 for all images.'
)


args = vars(ap.parse_args())


InferenceImages(**args).run()
