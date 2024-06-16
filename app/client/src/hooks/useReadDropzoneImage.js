import { useContext } from 'react';
import { UiContext } from '../context';
import { imageTypes, uiTypes } from '../types';
import { useImagesContext } from './useImagesContext';
import { dropzoneStatus as constantDropzoneStatus } from '../constants';

const fileTypes = ['image/jpeg', 'image/png', 'image/jpg'];

export const useReadDropzoneImage = () => {
	const { dropzoneStatus, uiDispatch } = useContext(UiContext);
	const { readImage, handleSaveImageInContext, handleSetMessages } = useImagesContext();

	const handleChangeFile = files => {
		const [selectedFile] = files;
		const fileName = selectedFile?.name;

		if (!selectedFile)
			return handleSetMessages({
				type: imageTypes.SET_ERROR_MESSAGE,
				message: 'No se ha seleccionado ningún archivo',
				cleanMessage: true,
			});

		if (!fileTypes.includes(selectedFile.type))
			return handleSetMessages({
				type: imageTypes.SET_ERROR_MESSAGE,
				message: 'El archivo seleccionado no tiene un formato de imagen válido',
				cleanMessage: true,
			});

		const reader = new FileReader();

		reader.readAsDataURL(selectedFile);

		reader.onload = ({ target }) => {
			// Save image in context
			handleSaveImageInContext({ target });

			// Set success message
			handleSetMessages({
				type: imageTypes.SET_MESSAGE,
				message: `El archivo ${fileName} se ha cargado correctamente!`,
			});

			// Hide dropzone
			uiDispatch({ type: uiTypes.SET_DROPZONE_STATUS, payload: constantDropzoneStatus.SHOW_IMAGE });
		};
	};

	return { readImage, dropzoneStatus, handleChangeFile };
};
