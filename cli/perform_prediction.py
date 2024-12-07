import os
import cv2
import argparse
import fix_paths
import numpy as np
import supervision as sv
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
        '-i', '--image-path', required=True,
        help='Path to the image to predict.'
    )
    ap.add_argument(
        '-a', '--annotation-path', type=str,
        help='Path to the annotation file.'
    )
    ap.add_argument(
        '-l', '--show-label', action='store_true',
        help='Show the label of the predicted object.'
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
        self.image_path = args['image_path']
        self.annotation_path = args['annotation_path']
        self.show_label = args['show_label']

        self.labels = ['diente_leon', 'kikuyo', 'lengua_vaca', 'otros', 'papa']
        self.color_palette = sv.ColorPalette.from_hex(['#ffd803', '#0cdbeb', '#e16162', '#00e0b5', '#101e68'])

        self.model = RTDETR(args['model_path'])
        self.image = cv2.imread(self.image_path)
        self.destination_path = os.path.join('out', 'predictions')

        self.detections = None
        self.annotations = None

        print(f'[INFO] Performing prediction...')

    def get_detections(self):
        '''Get the detections of the image.'''

        [results] = self.model(self.image)
        self.detections = sv.Detections.from_ultralytics(results)

    def get_annotations(self):
        '''Get the annotations of the image.'''

        if self.annotation_path is None:
            return

        class_ids = []
        annotations = []
        annotations_line = read_file(self.annotation_path)
        image_height, image_width, _ = self.image.shape

        print(f'[INFO] Reading annotations from: {self.annotation_path}')

        for annotation in annotations_line:
            annotation = annotation.split()
            label = int(annotation[0])
            x_center, y_center, width, height = map(float, annotation[1:])

            annotation = xywhn2xyxy(np.array([x_center, y_center, width, height]), w=image_width, h=image_height)

            annotations.append(annotation)
            class_ids.append(label)

        self.annotations = sv.Detections(xyxy=np.array(annotations), class_id=np.array(class_ids))
        self.annotations['labels'] = [self.labels[id] for id in class_ids]

    def annotate_image(self, detections):
        '''Annotate the image with the detections.'''
        box_annotator = sv.BoxAnnotator(color=self.color_palette)

        annotated_image = box_annotator.annotate(
            scene=self.image.copy(), detections=detections)

        if self.show_label:
            label_annotator = sv.LabelAnnotator(color=self.color_palette)
            annotated_image = label_annotator.annotate(
                scene=annotated_image, detections=detections, labels=detections['labels'])

        return annotated_image

    def save_image(self, prefix_name: str, annotated_image):
        '''Save image with the detections.'''

        filename = self.image_path.split(os.path.sep)[-1]
        filename = f'{prefix_name}_{filename}'

        if not os.path.exists(self.destination_path):
            os.makedirs(self.destination_path)

        destination_path = os.path.join(self.destination_path, filename)

        cv2.imwrite(destination_path, annotated_image)

        print(f'[INFO] The image was saved at: {destination_path}')

    def predict(self):
        '''Inspect the results of the training.'''
        self.get_detections()

        predicted_image = self.annotate_image(self.detections)

        self.save_image('predicted', predicted_image)

        if self.annotation_path is None:
            return

        self.get_annotations()

        annotated_image = self.annotate_image(self.annotations)

        self.save_image('annotated', annotated_image)


if __name__ == '__main__':

    # Parse the arguments
    ap = inspection_parser()

    # Inspect the results
    PerformPrediction(ap).predict()
