from roboflow import Roboflow


rf = Roboflow(api_key="YOUR_PRIVATE_API_KEY")

print(rf.workspace())

workspaceId = 'my-workspace'
projectId = 'my-project'
project = rf.workspace(workspaceId).project(projectId)

project.upload("UPLOAD_IMAGE.jpg")


project.upload(
    image_path="UPLOAD_IMAGE.jpg",
    batch_name="YOUR_BATCH_NAME",
    num_retry_uploads=10,
)
