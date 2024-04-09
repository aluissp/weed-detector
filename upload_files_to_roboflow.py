import yaml
from imutils import paths
from datasets import UploadDatasetRoboflow


with open('roboflow.config.yaml') as file:
    config = yaml.safe_load(file)

image_paths = list(paths.list_images(config['dataset-dir']))


uploader = UploadDatasetRoboflow(
    image_paths=image_paths,
    api_key=config['api-key'],
    batch_name=config['batch-name'],
    project_id=config['project-id'],
    workspace_id=config['workspace-id'],
)

uploader.run()
