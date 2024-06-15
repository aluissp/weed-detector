import { uiTypes } from '../../types';

export const uiReducer = (uiState, action) => {
	switch (action.type) {
		case uiTypes.SET_CURRENT_PAGE:
			return { ...uiState, currentPage: action.payload };

		default:
			return uiState;
	}
};
