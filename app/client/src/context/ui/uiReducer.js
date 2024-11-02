import { uiTypes } from '@/types';

export const uiReducer = (uiState, action) => {
	switch (action.type) {
		case uiTypes.SET_CURRENT_PAGE:
			return { ...uiState, currentPage: action.payload };

		case uiTypes.SET_CURRENT_LANG:
			return { ...uiState, lang: action.payload };

		case uiTypes.SET_DROPZONE_STATUS:
			return { ...uiState, dropzoneStatus: action.payload };

		default:
			return uiState;
	}
};
