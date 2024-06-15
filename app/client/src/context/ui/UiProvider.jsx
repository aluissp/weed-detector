/* eslint-disable react/prop-types */
import { useReducer } from 'react';
import { uiReducer } from './uiReducer';
import { UiContext } from '../contextBuilder';

const initialState = { currentPage: 1 };

const init = () => {
	const currentPage = localStorage.getItem('currentPage') || 1;

	return { currentPage };
};

export const UiProvider = ({ children }) => {
	const [ui, uiDispatch] = useReducer(uiReducer, initialState, init);

	return <UiContext.Provider value={{ ...ui, uiDispatch }}>{children}</UiContext.Provider>;
};
