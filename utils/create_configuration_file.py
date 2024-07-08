import yaml

default_config_yaml = '''
path: /path/to/dataset

train: train/images
val: valid/images
test: test/images

names:
  0: class_a
  1: class_b
  2: class_c


# Train settings -------------------------------------------------------------------------------------------------------
imgsz: 640 # (int | list) input images size as int for train and val modes, or list[w,h] for predict and export modes
epochs: 100 # (int) number of epochs to train for
patience: 100 # (int) epochs to wait for no observable improvement for early stopping of training
batch: 8 # (int) number of images per batch (-1 for AutoBatch)
optimizer: auto # (str) optimizer to use, choices=[SGD, Adam, Adamax, AdamW, NAdam, RAdam, RMSProp, auto]

# Val/Test settings ----------------------------------------------------------------------------------------------------
split: val # (str) dataset split to use for validation, i.e. 'val', 'test' or 'train'
save_json: True # (bool) save results to JSON file
iou: 0.7 # (float) intersection over union (IoU) threshold for NMS
max_det: 300 # (int) maximum number of detections per image

# Hyperparameters ------------------------------------------------------------------------------------------------------
lr0: 0.01 # (float) initial learning rate (i.e. SGD=1E-2, Adam=1E-3)
lrf: 0.01 # (float) final learning rate (lr0 * lrf)
momentum: 0.937 # (float) SGD momentum/Adam beta1
weight_decay: 0.0005 # (float) optimizer weight decay 5e-4
hsv_h: 0.015 # (float) image HSV-Hue augmentation (fraction)
hsv_s: 0.7 # (float) image HSV-Saturation augmentation (fraction)
hsv_v: 0.4 # (float) image HSV-Value augmentation (fraction)
degrees: 0.0 # (float) image rotation (+/- deg)
translate: 0.1 # (float) image translation (+/- fraction)
flipud: 0.0 # (float) image flip up-down (probability)
fliplr: 0.5 # (float) image flip left-right (probability)
mosaic: 1.0 # (float) image mosaic (probability)
erasing: 0.4 # (float) random cutout (probability)
crop_fraction: 1.0 # (float) fraction of image to crop
'''

base_config = {
    'path': '/path/to/dataset',
    'train': 'train/images',
    'val': 'valid/images',
    'test': 'test/images',
    'names': {
        0: 'class_a',
        1: 'class_b',
        2: 'class_c'
    },
}

default_config = {
    'imgsz': 640,
    'epochs': 100,
    'patience': 100,
    'batch': 8,
    'optimizer': 'auto',
    'split': 'val',
    'save_json': True,
    'iou': 0.7,
    'max_det': 300,
    'lr0': 0.01,
    'lrf': 0.01,
    'momentum': 0.937,
    'weight_decay': 0.0005,
    'hsv_h': 0.015,
    'hsv_s': 0.7,
    'hsv_v': 0.4,
    'degrees': 0.0,
    'translate': 0.1,
    'flipud': 0.0,
    'fliplr': 0.5,
    'mosaic': 1.0,
    'erasing': 0.4,
    'crop_fraction': 1.0,
}


def create_configuration_file(data: dict = None, filename: str = 'data.yaml', use_default_config: bool = False):
    '''Create configuration file with default values

    Args:
    ----
        data (dict): Data to write to configuration file
        filename (str): Name of the configuration file
        use_default_config (bool): Create configuration file with default values

    Returns:
    --------
        str: Name of the configuration file
    '''
    data = data or {}

    # Set default values if not provided
    data['path'] = data['path'] if 'path' in data else base_config['path']
    data['train'] = data['train'] if 'train' in data else base_config['train']
    data['val'] = data['val'] if 'val' in data else base_config['val']
    data['test'] = data['test'] if 'test' in data else base_config['test']
    data['names'] = data['names'] if 'names' in data else base_config['names']

    if use_default_config:

        data = {**data, **default_config}

    # Create configuration file
    with open(filename, 'w') as file:
        yaml.dump(data, file, default_flow_style=False)

    return filename
