import cv2
from . import BasePreprocessor
from numpy import typing as npt


class MeanPreprocessor(BasePreprocessor):

    def __init__(self, r_mean: float, g_mean: float, b_mean: float):
        '''
        Create a mean preprocessor

        Args:
        -----
        r_mean: float
            Mean value of the red channel
        g_mean: float
            Mean value of the green channel
        b_mean: float
            Mean value of the blue channel
        '''
        self.r_mean = r_mean
        self.g_mean = g_mean
        self.b_mean = b_mean

    def preprocess(self, image: npt.NDArray) -> npt.NDArray:
        '''
        Preprocess the image by subtracting the means from each channel

        Args:
        -----
        image: npt.NDArray
            The image to be preprocessed

        Returns:
        --------
        npt.NDArray
            The preprocessed image
        '''

        # Split the image into its respective channels
        (B, G, R) = cv2.split(image.astype('float32'))

        # Subtract the means for each channel
        R -= self.r_mean
        G -= self.g_mean
        B -= self.b_mean

        # Merge the channels back together
        return cv2.merge([B, G, R])
