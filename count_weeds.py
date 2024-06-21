import argparse
from inference import InferenceVideo


ap = argparse.ArgumentParser()
ap.add_argument(
    '-d', '--video-dir', required=True,
    help='Directory containing the video to be tested'
)
ap.add_argument(
    '-m', '--model-path', required=True,
    help='Path to the model to be used for the inferences.'
)
ap.add_argument(
    '-r', '--raw-prediction', action='store_true',
    help='Raw prediction?'
)
ap.add_argument(
    '-v', '--view-img', action='store_true',
    help='View image?'
)
ap.add_argument(
    '-i', '--inference-video-name', default='inference_video.avi',
    help='Name of the inference video.'
)


args = vars(ap.parse_args())

# Define classes names
classes_names = {
    0: 'Diente de leon', 1: 'Kikuyo',
    2: 'Lengua de vaca', 3: 'Otro', 4: 'Papa'
}

InferenceVideo(**args, classes_names=classes_names).run()
