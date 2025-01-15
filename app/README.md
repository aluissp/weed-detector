# Weed detector app

This application allows you to detect weeds in images using a trained model. You can found the model [here](https://www.kaggle.com/models/luisperugachi/best-rt-detr-model-to-detect-weeds).

## Installation with Docker

1. Download the trained model from this link: https://www.kaggle.com/models/luisperugachi/best-rt-detr-model-to-detect-weeds.
2. Move the downloaded model to the `app/server/src/weights` folder.
3. Build the Docker image:

```bash
docker compose build
```

4. Run the Docker container:

```bash
docker compose up
```
