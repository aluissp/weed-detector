import { imageTypes } from '../../types';

export const imagesReducer = (imageState, action) => {
	switch (action.type) {
		case imageTypes.SET_CURRENT_DATA:
			return { ...imageState, ...action.payload };

		case imageTypes.SET_ERROR_MESSAGE:
			return { ...imageState, errorMessage: action.payload };

		case imageTypes.SET_MESSAGE:
			return { ...imageState, message: action.payload };

		case imageTypes.SET_IMAGE_STATUS:
			return { ...imageState, status: action.payload };

		case imageTypes.LOAD_HISTORY:
			return { ...imageState, predictedHistory: action.payload };

		default:
			return imageState;
	}
};
