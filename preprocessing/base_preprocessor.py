from numpy import typing as npt
from abc import ABCMeta, abstractmethod


class BasePreprocessor(metaclass=ABCMeta):

    @abstractmethod
    def preprocess(self, image: npt.NDArray) -> npt.NDArray:
        pass
