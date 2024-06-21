/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useReducer } from 'react';
import { useIndexedDB } from 'react-indexed-db-hook';
import { imageTypes } from '../../types';
import { ImagesContext } from '../contextBuilder';
import { imagesReducer } from './imagesReducer';
import { dbStoreName, status } from '../../constants';

const initialState = {
	message: null,
	readImage: null,
	readImageFile: null,
	predictionData: null,
	predictedHistory: [],
	status: status.IDLE,
	errorMessage: null,
};

export const ImagesProvider = ({ children }) => {
	const { getAll } = useIndexedDB(dbStoreName);
	const [images, imagesDispatch] = useReducer(imagesReducer, initialState);

	useEffect(() => {
		if (images.status !== status.COMPLETED && images.status !== status.IDLE) return;

		getAll().then(history => {
			history.sort((a, b) => b.id - a.id);

			history.forEach(item => delete item.file);

			imagesDispatch({ type: imageTypes.LOAD_HISTORY, payload: history });
		});
	}, [images.status]);

	return (
		<ImagesContext.Provider value={{ ...images, imagesDispatch }}>
			{children}
		</ImagesContext.Provider>
	);
};
