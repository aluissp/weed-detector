from werkzeug.datastructures import ImmutableMultiDict


# All arguments
['conf', 'iou', 'imgsz', 'max_det',
 'augment', 'classes', 'save_crop',
 'save_txt', 'save_conf', 'show_labels',
 'show_conf', 'line_width']

float_arguments = ['conf', 'iou']
integer_arguments = ['imgsz', 'max_det', 'line_width']
list_arguments = ['classes']
boolean_arguments = ['augment', 'save_crop', 'save_txt',
                     'save_conf', 'show_labels', 'show_conf']


def get_img_predict_params(params: ImmutableMultiDict):
    params = params.to_dict()

    inference_params = {}

    for key, value in params.items():

        if key in float_arguments:
            try:
                inference_params[key] = float(value)
            except ValueError:
                continue

        elif key in integer_arguments:
            try:
                inference_params[key] = int(value)
            except ValueError:
                continue

        elif key in list_arguments:
            try:
                inference_params[key] = [int(i) for i in list(value)]
            except ValueError:
                continue

        elif key in boolean_arguments:
            try:
                inference_params[key] = value.lower() == 'true'
            except ValueError:
                continue

    return inference_params
