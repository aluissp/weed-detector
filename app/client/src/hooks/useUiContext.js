import { useContext } from 'react';
import { imageTypes, uiTypes } from '../types';
import { ImagesContext, UiContext } from '../context';
import { dropzoneStatus as constantDropzoneStatus } from '../constants';
import { useTranslation } from 'react-i18next';

export const useUiContext = () => {
	const [, i18n] = useTranslation('global')
	const { currentPage, lang, dropzoneStatus, uiDispatch } = useContext(UiContext);
	const { imagesDispatch } = useContext(ImagesContext);

	const handleSetCurrentPage = ({ pageName }) => {
		localStorage.setItem('currentPage', pageName);
		uiDispatch({ type: uiTypes.SET_CURRENT_PAGE, payload: pageName });
	};

	const handleSetCurrentLang = ({ lang }) => {
		lang = lang === 'es' ? 'en' : 'es';
		i18n.changeLanguage(lang);
		localStorage.setItem('lang', lang);
		uiDispatch({ type: uiTypes.SET_CURRENT_LANG, payload: lang });
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

	const handleDropzoneVisibility = ({ status }) => {
		uiDispatch({ type: uiTypes.SET_DROPZONE_STATUS, payload: status });
	};

	return {
		// state
		lang,
		currentPage,
		dropzoneStatus,

		// actions
		handleSetCurrentPage,
		handleSetCurrentLang,
		handleCleanDropzoneData,
		handleDropzoneVisibility,
	};
};
