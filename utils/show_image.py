import cv2
from numpy import typing as npt


def show_image(image: npt.NDArray, title: str = 'Image', wait_key: bool = True, destroy_window: bool = True, window_type=cv2.WINDOW_NORMAL):
    '''
    Show an image in a window with a title.

    Args:
    -----
        image (numpy.ndarray): The image to show.
        title (str): The title of the window.
        wait_key (bool): If True, the window will wait for a key press before closing.
        destroy_window (bool): If True, the window will be destroyed after the image is shown.
        window_type (int): The type of window to create. Default is cv2.WINDOW_NORMAL.
    '''

    cv2.namedWindow(title, window_type)
    cv2.imshow(title, image)

    if wait_key:
        cv2.waitKey(0)

    if destroy_window:
        cv2.destroyAllWindows()
