import os
from flask import Flask, request, send_file
from .inference import InferenceImages
from .utils import (delete_files, save_image, get_folderpath,
                    get_runs_path, compress_directory, get_img_predict_params)


app = Flask(__name__)
app.config['imgs'] = get_folderpath(__file__, 'imgs')
app.config['models'] = get_folderpath(__file__, 'weights')


@app.get("/")
def show_homepage():
    return 'Hello world!'


@app.post("/predict")
def predict_weeds():
    try:
        image = request.files['image']
    except KeyError:
        return {'mesagge': 'No image found'}, 400

    filepath, error = save_image(image)

    if error:
        return {'message': error}, 400

    runs_path = get_runs_path(__file__)

    inference_params = get_img_predict_params(request.args)

    InferenceImages(
        model_path=os.path.join(app.config['models'], 'rt-detr-best.pt'),
        images_dir=app.config['imgs'],
        save_inferences=True,
        runs_path=runs_path,
        inference_params=inference_params,
    ).run()

    file_compressed_path = compress_directory(runs_path)

    delete_files(filepath)

    file_to_send = send_file(
        file_compressed_path, download_name='inferences.zip', as_attachment=True
    )

    return file_to_send, 200
