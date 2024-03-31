import cv2
import imutils
from numpy import typing as npt
from . import BasePreprocessor


class AspectAwarePreprocessor(BasePreprocessor):
    def __init__(self, width: int, height: int, inter: int = cv2.INTER_AREA):
        '''
        Store the target image width, height, and interpolation, method used when resizing

        Args:
        -   width (int): Target image width
        -   height (int): Target image height
        -   interpolation (int, optional): Interpolation method used when resizing. Defaults to cv2.INTER_AREA.
        '''
        self.width = width
        self.height = height
        self.inter = inter

    def preprocess(self, image: npt.NDArray) -> npt.NDArray:
        '''
        Resize the image while maintaining the aspect ratio

        Args:
        -----
        -   image (npt.NDArray): Image to be preprocessed

        Returns:
        --------
        -   npt.NDArray: Preprocessed image
        '''

        h, w = image.shape[:2]
        dW, dH = 0, 0

        # if the width is smaller than the height, then resize
        # along the width (i.e., the smaller dimension) and then
        # update the deltas to crop the height to the desired dimension
        if w < h:
            image = imutils.resize(image, width=self.width, inter=self.inter)
            dH = int((image.shape[0] - self.height) / 2.0)

        # otherwise, the height is smaller than the width so resize
        # along the height and then update the deltas to crop along
        # the width
        else:
            image = imutils.resize(image, height=self.height, inter=self.inter)
            dW = int((image.shape[1] - self.width) / 2.0)

        # now that our images have been resized, we need to re-grab the
        # width and height, followed by performing the crop
        h, w = image.shape[:2]
        image = image[dH:h - dH, dW:w - dW]

        # finally, resize the image to the provided spatial dimensions to
        # ensure our output image is always a fixed size
        return cv2.resize(image, (self.width, self.height), interpolation=self.inter)
