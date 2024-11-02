/* eslint-disable react/prop-types */
import { useReducer } from 'react';
import { uiReducer } from './uiReducer';
import { UiContext } from '../contextBuilder';
import { pageNames, dropzoneStatus } from '@/constants';

const initialState = {
	currentPage: pageNames.predictPage,
	dropzoneStatus: dropzoneStatus.SHOW_DROPZONE,
	lang: 'es',
};

const init = () => {
	const currentPage = localStorage.getItem('currentPage') || initialState.currentPage;
	const lang = localStorage.getItem('lang') || initialState.lang;

	return { ...initialState, currentPage, lang };
};

export const UiProvider = ({ children }) => {
	const [ui, uiDispatch] = useReducer(uiReducer, initialState, init);

	return <UiContext.Provider value={{ ...ui, uiDispatch }}>{children}</UiContext.Provider>;
};
