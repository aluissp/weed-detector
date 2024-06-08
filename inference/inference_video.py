import cv2
from ultralytics import RTDETR
from ultralytics.solutions.object_counter import ObjectCounter


class InferenceVideo:

    def __init__(self, model_path: str, video_dir: str,
                 view_img: bool = False,
                 classes_names: dict = None,
                 raw_prediction: bool = False,
                 region_points: list[dict] = None,
                 inference_video_name: str = 'inference_video.avi'):

        self.model_path = model_path
        self.video_dir = video_dir
        self.classes_names = classes_names
        self.region_points = region_points
        self.inference_video_name = inference_video_name
        self.view_img = view_img
        self.raw_prediction = raw_prediction

        self.model = None
        self.video_writer = None
        self.capture = None

    def load_model(self):

        print('[INFO] Loading model...')
        self.model = RTDETR(self.model_path)

        if self.classes_names:
            return

        self.classes_names = self.model.names

    def inference(self):

        print('[INFO] Inferring on video...')

        counter = ObjectCounter()
        counter.set_args(
            view_img=self.view_img,
            reg_pts=self.region_points,
            classes_names=self.classes_names,
            line_thickness=2,
        )

        while self.capture.isOpened():

            success, frame = self.capture.read()

            if not success:
                print(
                    'Video frame is empty or video processing has been successfully completed.')
                break

            tracks = self.model.track(frame, persist=True, show=False)

            frame = counter.start_counting(frame, tracks)
            self.video_writer.write(frame)

        print('[INFO] Saving inference video...')

        self.capture.release()
        self.video_writer.release()
        cv2.destroyAllWindows()

        print('[INFO] Inference completed.')

    def load_video(self):

        print('[INFO] Loading video...')

        self.capture = cv2.VideoCapture(self.video_dir)
        assert self.capture.isOpened(), 'Error reading video file'

        w, h, fps = (int(self.capture.get(x)) for x in (cv2.CAP_PROP_FRAME_WIDTH,
                                                        cv2.CAP_PROP_FRAME_HEIGHT, cv2.CAP_PROP_FPS))

        if self.region_points is None:
            self.region_points = [(0, 0), (w, 0), (w, h), (0, h)]

        self.video_writer = cv2.VideoWriter(
            self.inference_video_name,
            cv2.VideoWriter_fourcc(*'mp4v'), fps, (w, h)
        )

    def raw_predict(self):

        print('[INFO] Raw prediction...')

        results = self.model.predict(
            self.video_dir, stream=True,
            save=True, show_labels=True,
            show_conf=True, verbose=True,
            line_width=2
        )

        for _ in results:
            pass

        print('[INFO] Raw prediction completed.')

    def run(self):

        self.load_model()

        if self.raw_prediction:
            self.raw_predict()
            return

        self.load_video()
        self.inference()
