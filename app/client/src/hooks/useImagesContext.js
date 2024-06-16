import { useContext } from 'react';
import { imageTypes } from '../types';
import { ImagesContext } from '../context';

export const useImagesContext = () => {
	const {
		readImage,
		message,
		predictedImage,
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

	const handleSaveImageInContext = ({ target }) => {
		imagesDispatch({ type: imageTypes.SET_CURRENT_DATA, payload: { readImage: target?.result } });
	};

	return {
		// status
		readImage,
		message,
		predictedImage,
		predictionData,
		predictedHistory,
		status,
		errorMessage,

		// actions
		handleSetMessages,
		handleSaveImageInContext,
	};
};
