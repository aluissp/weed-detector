import { useContext } from 'react';
import { imageTypes, uiTypes } from '../types';
import { ImagesContext, UiContext } from '../context';
import { dropzoneStatus as constantDropzoneStatus } from '../constants';

export const useUiContext = () => {
	const { currentPage, dropzoneStatus, uiDispatch } = useContext(UiContext);
	const { imagesDispatch } = useContext(ImagesContext);

	const handleSetCurrentPage = ({ pageName }) => {
		localStorage.setItem('currentPage', pageName);
		uiDispatch({ type: uiTypes.SET_CURRENT_PAGE, payload: pageName });
	};

	const handleCleanDropzoneData = () => {
		imagesDispatch({
			type: imageTypes.SET_CURRENT_DATA,
			payload: { readImage: null },
		});

		imagesDispatch({
			type: imageTypes.SET_MESSAGE,
			payload: null,
		});

		uiDispatch({
			type: uiTypes.SET_DROPZONE_STATUS,
			payload: constantDropzoneStatus.SHOW_DROPZONE,
		});
	};

	return {
		// state
		currentPage,
		dropzoneStatus,

		// actions
		handleSetCurrentPage,
		handleCleanDropzoneData,
	};
};
