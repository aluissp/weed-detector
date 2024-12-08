import os
import cv2
import argparse
import fix_paths
import numpy as np
import supervision as sv
from imutils import paths
from utils import read_file
from ultralytics import RTDETR
from ultralytics.utils.ops import xywhn2xyxy

help_message = '''
This cli script helps you to perform a prediction using a trained model.
'''


def inspection_parser():
    '''Parse the arguments of the inspection cli script.

    Returns:
        argparse.ArgumentParser: The arguments of the inspection cli script.
    '''

    ap = argparse.ArgumentParser(description=help_message)
    ap.add_argument(
        '-m', '--model-path', required=True,
        help='Path to the model to use.'
    )
    ap.add_argument(
        '-i', '--images-path', required=True,
        help='Path to the image/folder to predict.'
    )
    ap.add_argument(
        '-l', '--labels-path', type=str,
        help='Path to the label file or labels folder.'
    )
    ap.add_argument(
        '-t', '--show-tag', action='store_true',
        help='Show the tag of the predicted object.'
    )

    return ap


class PerformPrediction:
    '''Class to perform a prediction using a trained model.'''

    def __init__(self, cli_parser: argparse.ArgumentParser):
        '''Initialize the PerformPrediction class.

        Args:
            cli_parser (argparse.ArgumentParser): CLI parser object.
        '''

        args = vars(cli_parser.parse_args())

        # CLI arguments
        self.images_path = args['images_path']
        self.labels_path = args['labels_path']
        self.show_tag = args['show_tag']

        # Tags for each class
        self.tags = ['diente_leon', 'kikuyo', 'lengua_vaca', 'otros', 'papa']
        color_palette = sv.ColorPalette.from_hex(['#ffd803', '#0cdbeb', '#e16162', '#89659b', '#101e68'])

        # Image/label or a list of images/labels
        self.images = None
        self.labels = None

        # A list of bounding boxes
        self.detections = None
        self.annotations = None

        self.model = RTDETR(args['model_path'])
        self.destination_path = os.path.join('out', 'predictions')

        self.box_annotator = sv.BoxAnnotator(color=color_palette)
        self.label_annotator = sv.LabelAnnotator(color=color_palette)

        if os.path.isfile(self.images_path):
            self.images = [self.images_path]

        elif os.path.isdir(self.images_path):
            valid_images = '.jpg', '.jpeg', '.png'
            self.images = list(paths.list_files(self.images_path, validExts=valid_images))

        if self.labels_path and os.path.isfile(self.labels_path):
            self.labels = [self.labels_path]

        elif self.labels_path and os.path.isdir(self.labels_path):
            self.labels = list(paths.list_files(self.labels_path, validExts='.txt'))

    def get_detections(self):
        '''Get the detections of the image.'''

        print(f'[INFO] Performing prediction...')

        detections = []

        results = self.model(self.images)

        for result in results:
            detections.append(sv.Detections.from_ultralytics(result))

        self.detections = detections

    def get_annotations(self):
        '''Get the annotations of the image.'''

        if self.labels is None:
            return

        print(f'[INFO] Reading annotations from: {self.labels_path}')

        all_annotations = []

        for image in self.images:
            image_name = image.split(os.path.sep)[-1]
            [image_name, *_] = image_name.split('.')
            [label_file, *_] = list(filter(lambda lb: image_name in lb, self.labels))

            annotation_lines = read_file(label_file)
            image_height, image_width, _ = cv2.imread(image).shape

            annotations = []
            class_labels = []

            for annotation in annotation_lines:
                annotation = annotation.split()
                label = int(annotation[0])
                x_center, y_center, width, height = map(float, annotation[1:])

                annotation = xywhn2xyxy(np.array([x_center, y_center, width, height]), w=image_width, h=image_height)

                annotations.append(annotation)
                class_labels.append(label)

            annotations = sv.Detections(xyxy=np.array(annotations), class_id=np.array(class_labels))
            annotations['labels'] = [self.tags[id] for id in class_labels]

            all_annotations.append(annotations)

        self.annotations = all_annotations

    def annotate_image(self, image, detections):
        '''Annotate the image with the detections.'''

        annotated_image = self.box_annotator.annotate(scene=image.copy(), detections=detections)

        if self.show_tag:
            annotated_image = self.label_annotator.annotate(
                scene=annotated_image,
                detections=detections,
                labels=detections['labels']
            )

        return annotated_image

    def save_image(self, dest: str, filename: str, annotated_image):
        '''Save image with the detections.'''

        if not os.path.exists(dest):
            os.makedirs(dest)

        destination_path = os.path.join(dest, filename)

        cv2.imwrite(destination_path, annotated_image)

        print(f'[INFO] The image was saved at: {destination_path}')

    def save_detections(self, subdir: str, detections):
        '''Save all the detections in a specific directory.'''
        dest = os.path.join(self.destination_path, subdir)

        if not os.path.exists(dest):
            os.makedirs(dest)

        for image, detection in zip(self.images, detections):
            image_name = image.split(os.path.sep)[-1]
            image = cv2.imread(image)

            annotated_image = self.annotate_image(image, detection)

            self.save_image(dest, image_name, annotated_image)

    def predict(self):
        '''Inspect the results of the training.'''
        self.get_detections()

        self.save_detections('predicted', self.detections)

        if self.labels is None:
            return

        self.get_annotations()

        self.save_detections('annotated', self.annotations)


if __name__ == '__main__':

    # Parse the arguments
    ap = inspection_parser()

    # Inspect the results
    PerformPrediction(ap).predict()
