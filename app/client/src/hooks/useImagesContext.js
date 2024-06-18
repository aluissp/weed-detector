import { useContext } from 'react';
import { imageTypes } from '../types';
import { ImagesContext } from '../context';

export const useImagesContext = () => {
	const {
		message,
		readImage,
		readImageFile,
		predictionData,
		predictedHistory,
		status,
		errorMessage,
		imagesDispatch,
	} = useContext(ImagesContext);

	const handleSetMessages = ({ type, message, cleanMessage = false }) => {
		imagesDispatch({ type, payload: message });

		if (!cleanMessage) return;

		setTimeout(() => {
			imagesDispatch({ type, payload: null });
		}, 100);
	};

	const handleSaveImageInContext = ({ imageFile, target }) => {
		imagesDispatch({
			type: imageTypes.SET_CURRENT_DATA,
			payload: { readImageFile: imageFile, readImage: target?.result },
		});
	};

	const handleImageStatus = ({ status }) => {
		imagesDispatch({ type: imageTypes.SET_IMAGE_STATUS, payload: status });
	};

	const handleSetPredictionData = ({ data }) => {
		imagesDispatch({ type: imageTypes.SET_CURRENT_DATA, payload: { predictionData: data } });
	};

	return {
		// status
		message,
		readImage,
		readImageFile,
		predictionData,
		predictedHistory,
		status,
		errorMessage,

		// actions
		handleSetMessages,
		handleSaveImageInContext,
		handleImageStatus,
		handleSetPredictionData,
	};
};
