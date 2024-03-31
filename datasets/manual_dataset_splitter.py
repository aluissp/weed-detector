import os
import cv2
import json
from utils import show_image
from preprocessing import BasePreprocessor


class ManualDatasetSplitter:
    def __init__(self,
                 image_paths: list[str],
                 dir_to_save_images: str,
                 preprocessors: list[BasePreprocessor] = None):
        '''
        This class helps you detach the images that you consider wrong and save the
        correct ones in another folder.

        Args:
        ----
            image_paths (list[str]): A list of paths to the images that you want to split.
            dir_to_save_images (str): The directory where the correct images will be saved.
            preprocessors (list[BasePreprocessor]): A list of preprocessors to be applied to the images.
        '''
        self.image_paths = image_paths
        self.dir_to_save_images = dir_to_save_images
        self.preprocessors = preprocessors

        if self.preprocessors is None:
            self.preprocessors = []

        json_path = ['out', 'dataset', 'dataset_splitter_info.json']

        dataset_splitter_info = os.path.join(json_path[0], json_path[1])

        try:
            os.makedirs(dataset_splitter_info, exist_ok=True)
            os.makedirs(dir_to_save_images, exist_ok=True)
        except:
            pass

        dataset_splitter_info = os.path.join(*json_path)

        if os.path.exists(dataset_splitter_info):

            with open(dataset_splitter_info, 'r') as file:
                data = json.load(file)

            self.dataset_splitter_info = data
        else:
            data = {
                'current_file_id': 1,
                'images_read': [],
                'json_path': json_path
            }

            with open(dataset_splitter_info, 'w') as file:
                json.dump(data, file)

            self.dataset_splitter_info = data

    def run(self):
        '''
        This method will start the process of splitting the images.
        '''

        current_id = self.dataset_splitter_info['current_file_id']
        images_read = self.dataset_splitter_info['images_read']
        image_paths = list(
            filter(lambda p: p not in images_read, self.image_paths)
        )
        json_path = os.path.join(*self.dataset_splitter_info['json_path'])

        for image_path in image_paths:
            image = cv2.imread(image_path)

            image_name = os.path.split(image_path)[-1]

            title = f'Image: {image_name}'
            show_image(image, title=title)

            correct = input('Is this image correct? ([Y]/n): ')

            if correct.lower() == 'n':
                continue

            for preprocessor in self.preprocessors:
                image = preprocessor.preprocess(image)

            image_name = f'{str(current_id).zfill(5)}.jpg'

            path_to_save = os.path.join(self.dir_to_save_images, image_name)

            cv2.imwrite(path_to_save, image)

            current_id += 1

            self.dataset_splitter_info['current_file_id'] = current_id
            self.dataset_splitter_info['images_read'].append(image_path)

            with open(json_path, 'w') as file:
                json.dump(self.dataset_splitter_info, file)
