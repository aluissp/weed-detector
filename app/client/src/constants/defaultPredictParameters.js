import { inputNames } from './inputNames';

export const defaultPredictParameters = {
	[inputNames.imgsz]: 640,
	[inputNames.max_det]: 300,
	[inputNames.line_width]: 3,
	[inputNames.conf]: 0.25,
	[inputNames.iou]: 0.7,
	[inputNames.augment]: false,
	[inputNames.agnostic_nms]: false,
	[inputNames.save_crop]: false,
	[inputNames.save_txt]: false,
	[inputNames.save_conf]: false,
	[inputNames.show_labels]: true,
	[inputNames.show_conf]: true,

	// Classes
	[inputNames.lengua_vaca]: true,
	[inputNames.papa]: true,
	[inputNames.diente_leon]: true,
	[inputNames.kikuyo]: true,
	[inputNames.otro]: true,
};
