# Weed detector

The Real-Time Detection Transformer (RT-DETR) architecture was employed for the automated detection of various weeds, including kikuyo, dandelion, broadleaf dock, and other unidentified species, within potato fields. A DJI Mavic 2 Pro drone captured the dataset at an altitude of 9-10 meters while traveling at 1 m/s to ensure broader coverage of the crop field.

## Table of contents

- [Weed detector](#weed-detector)
  - [Table of contents](#table-of-contents)
  - [Project structure](#project-structure)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Resources](#resources)

## Project structure

```
weed_detector
├── app
│   ├── client
│   ├── server
├── cli
├── inference
├── notebooks
├── out
├── preprocessing
├── roboflow
└── utils
```

- `app`: Contains client and server applications for the weed detector, containerized in Docker.
- `cli`: Command-line interface to analyze training results and perform weed inference.
- `inference`: Includes classes for image and video inference.
- `notebooks`: Jupyter notebooks for model training and evaluation.
- `out`: Output directory for model checkpoints and logs.
- `preprocessing`: Scripts for data preprocessing.
- `roboflow`: Scripts to upload images to a Roboflow project.
- `utils`: Utility functions for the project.

## Installation

1. First of all, clone the repository to your workspace.

```bash
git clone https://github.com/aluissp/weed-detector.git
cd weed-detector
```

2. Then, install miniconda from the official website: https://docs.anaconda.com/miniconda.
3. Create a new conda environment and install the required dependencies.

```bash
conda env create -f .conda.yml
conda activate weed-detector
```

Finally, if you want run weed detector app, follow [this instructions](app/README.md).

## Usage

Run this command to perform weed detection:

```bash
python cli/perform_prediction.py -m /path/to/model.pth -i /directory/with/images --show-tag
```

## Resources
* [Dataset without annotations](https://www.kaggle.com/datasets/luisperugachi/papas-malezas-dataset)
* [Dataset with annotations](https://www.kaggle.com/datasets/f50d53884d81757caff683a23399bc80a2f7da95937ad15efe00826aab46f4f5)
* [Best model achieved](https://www.kaggle.com/models/luisperugachi/best-rt-detr-model-to-detect-weeds)
