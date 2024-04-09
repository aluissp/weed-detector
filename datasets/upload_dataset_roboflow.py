import os
import json
from tqdm import tqdm
from roboflow import Roboflow


class UploadDatasetRoboflow:
    def __init__(
        self,
        image_paths: list[str],
        api_key: str,
        batch_name: str,
        project_id: str,
        workspace_id: str,
    ):
        '''
        This class helps you to upload images to Roboflow.

        Args:
        ----
            image_paths (list[str]): A list of paths to the images that you want to split.
            api_key (str): Your Roboflow API key.
            batch_name (str): The name of the batch that you want to upload.
            project_id (str): The project id where you want to upload the images.
            workspace_id (str): The workspace id where you want to upload the images.
        '''
        self.image_paths = image_paths
        self.rf = Roboflow(api_key=api_key)
        self.batch_name = batch_name

        self.project = self.rf.workspace(workspace_id).project(project_id)

        json_path = ['out', 'dataset', 'dataset_roboflow_info.json']

        dataset_roboflow_info = os.path.join(json_path[0], json_path[1])

        try:
            os.makedirs(dataset_roboflow_info, exist_ok=True)
        except:
            pass

        dataset_roboflow_info = os.path.join(*json_path)

        if os.path.exists(dataset_roboflow_info):

            with open(dataset_roboflow_info, 'r') as file:
                data = json.load(file)

        else:
            data = {'images_uploaded': [], 'json_path': json_path}

            with open(dataset_roboflow_info, 'w') as file:
                json.dump(data, file)

        self.roboflow_info = data

    def run(self):
        '''
        This method uploads the images to Roboflow.
        '''

        images_uploaded = self.roboflow_info['images_uploaded']

        image_paths = list(
            filter(lambda p: p not in images_uploaded, self.image_paths)
        )

        json_path = os.path.join(*self.roboflow_info['json_path'])

        for image_path in tqdm(image_paths, desc='[INFO] Uploading images'):
            self.project.upload(
                image_path=image_path,
                batch_name=self.batch_name,
                num_retry_uploads=3,
            )
            self.roboflow_info['images_uploaded'].append(image_path)

            with open(json_path, 'w') as file:
                json.dump(self.roboflow_info, file)
