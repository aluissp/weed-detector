import { imageTypes } from '../types';
import { useUiContext } from './useUiContext';
import { useTranslation } from 'react-i18next';
import { useImagesContext } from './useImagesContext';
import { dropzoneStatus as constantDropzoneStatus } from '../constants';

const fileTypes = ['image/jpeg', 'image/png', 'image/jpg'];

export const useReadDropzoneImage = () => {
	const [t] = useTranslation('global');
	const { dropzoneStatus, handleDropzoneVisibility } = useUiContext();
	const { readImage, readImageFile, handleSaveImageInContext, handleSetMessages } =
		useImagesContext();

	const handleChangeFile = files => {
		const [selectedFile] = files;
		const fileName = selectedFile?.name;

		if (!selectedFile)
			return handleSetMessages({
				type: imageTypes.SET_ERROR_MESSAGE,
				message: t('predictionPage.alerts.noFileSelected'),
				cleanMessage: true,
			});

		if (!fileTypes.includes(selectedFile.type))
			return handleSetMessages({
				type: imageTypes.SET_ERROR_MESSAGE,
				message: t('predictionPage.alerts.noValidFormat'),
				cleanMessage: true,
			});

		const reader = new FileReader();

		reader.readAsDataURL(selectedFile);

		reader.onload = ({ target }) => {
			// Save image in context
			handleSaveImageInContext({ imageFile: selectedFile, target });

			// Set success message
			handleSetMessages({
				type: imageTypes.SET_MESSAGE,
				message: t('predictionPage.messages.fileLoadedSuccess', { fileName }),
				cleanMessage: true,
			});

			// Hide dropzone
			handleDropzoneVisibility({ status: constantDropzoneStatus.SHOW_IMAGE });
		};
	};

	return { readImage, readImageFile, dropzoneStatus, handleChangeFile };
};
