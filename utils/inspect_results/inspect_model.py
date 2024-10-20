import torch


def get_model_train_args(path: str):
    '''Get the train arguments from a model.

    Args:
        path (str): The path to the model.

    Returns:
        dict: The train arguments.
    '''
    model = torch.load(path)

    return model['train_args']
