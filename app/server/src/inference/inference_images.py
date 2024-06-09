import os
import json
from shutil import rmtree
from random import choices
from imutils import paths
from ultralytics import RTDETR


class InferenceImages:

    def __init__(
        self,
        model_path: str,
        images_dir: str,
        num_images: int = -1,
        runs_path: str = None,
        save_inferences: bool = False,
        inference_params: dict = None,
    ):

        self.runs_path = runs_path
        self.model_path = model_path
        self.images_dir = images_dir
        self.num_images = num_images
        self.save_inferences = save_inferences
        self.inference_params = inference_params

        self.model = None
        self.image_paths = None
        self.results = None

    def load_model(self):

        print('[INFO] Loading model...')
        self.model = RTDETR(self.model_path)

    def predict(self):

        print('[INFO] Predicting...')

        rmtree(self.runs_path) if os.path.exists(self.runs_path) else None

        params = {
            'show_labels': True,
            'show_conf': True,
            'save_txt': True,
            'save_conf': True,
            'line_width': 3,
            **self.inference_params
        }

        self.results = self.model.predict(
            self.image_paths,
            save=self.save_inferences,
            **params
        )

    def process_results(self):

        message = 'and saving results' if self.save_inferences else ''

        print(f'[INFO] Processing {len(self.results)} results {message}...')

        inference_results = {}

        for result in self.results:
            filename = os.path.basename(result.path)
            inference_results[filename] = {
                'message': result.verbose(),
                'speed': result.speed
            }

            json_path = os.path.join(self.runs_path, 'inference_results.json')

            with open(json_path, 'w') as file:
                json.dump(inference_results, file)

    def load_images(self):

        print('[INFO] Loading images...')

        self.image_paths = list(paths.list_images(self.images_dir))

        if self.num_images < 0:
            return

        self.image_paths = choices(self.image_paths, k=self.num_images)

    def run(self):

        self.load_model()
        self.load_images()
        self.predict()
        self.process_results()
