from abc import ABCMeta, abstractmethod


class Inference(metaclass=ABCMeta):

    @abstractmethod
    def predict(self, data):
        pass

    @abstractmethod
    def run(self):
        pass
