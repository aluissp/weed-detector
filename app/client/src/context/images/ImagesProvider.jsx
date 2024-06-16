/* eslint-disable react/prop-types */
import { useReducer } from 'react';
import { ImagesContext } from '../contextBuilder';
import { imagesReducer } from './imagesReducer';
import { status } from '../../constants';

const initialState = {
	readImage: null,
	message: null,
	predictedImage: null,
	predictionData: null,
	predictedHistory: [],
	status: status.IDLE,
	errorMessage: null,
};

// const init = () => {
// 	const currentPage = localStorage.getItem('currentPage') || initialState.currentPage;

// 	return { ...initialState, currentPage };
// };

export const ImagesProvider = ({ children }) => {
	const [images, imagesDispatch] = useReducer(imagesReducer, initialState);

	return (
		<ImagesContext.Provider value={{ ...images, imagesDispatch }}>
			{children}
		</ImagesContext.Provider>
	);
};
