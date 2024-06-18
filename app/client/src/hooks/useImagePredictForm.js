import axios from 'axios';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { imageTypes } from '../types';
import { useUiContext } from './useUiContext';
import { useImagesContext } from './useImagesContext';
import { unzipImageResponse } from '../utils';
import {
	defaultPredictParameters,
	inputNames,
	modelClassKeys,
	pageNames,
	status,
} from '../constants';

export const useImagePredictForm = () => {
	const { handleSetCurrentPage } = useUiContext();

	const {
		readImage,
		readImageFile,
		status: imageStatus,
		handleSetMessages,
		handleImageStatus,
		handleSetPredictionData,
	} = useImagesContext();

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm({ defaultValues: defaultPredictParameters });

	const { [inputNames.imgsz]: errorImgz, [inputNames.max_det]: errorMaxDet } = errors;

	const handlePredictImage = data => {
		if (!readImage)
			return handleSetMessages({
				type: imageTypes.SET_ERROR_MESSAGE,
				message: 'No se ha cargado ninguna imagen',
				cleanMessage: true,
			});

		let classes = '';

		if (data[inputNames.diente_leon]) {
			classes += modelClassKeys.diente_leon;
			delete data[inputNames.diente_leon];
		}
		if (data[inputNames.kikuyo]) {
			classes += modelClassKeys.kikuyo;
			delete data[inputNames.kikuyo];
		}
		if (data[inputNames.lengua_vaca]) {
			classes += modelClassKeys.lengua_vaca;
			delete data[inputNames.lengua_vaca];
		}
		if (data[inputNames.otro]) {
			classes += modelClassKeys.otro;
			delete data[inputNames.otro];
		}
		if (data[inputNames.papa]) {
			classes += modelClassKeys.papa;
			delete data[inputNames.papa];
		}

		if (classes === '')
			return handleSetMessages({
				type: imageTypes.SET_ERROR_MESSAGE,
				message: 'Por favor, seleccione al menos una clase',
				cleanMessage: true,
			});

		// Set loading status
		handleImageStatus({ status: status.LOADING });

		data.classes = classes;

		// Generate query params
		const queryParams = new URLSearchParams(data).toString();

		// Form data
		const formData = new FormData();

		formData.append('image', readImageFile);

		const config = { headers: { 'Content-Type': 'multipart/form-data' }, responseType: 'blob' };

		const request = axios
			.post('api/predict?' + queryParams, formData, config)
			.then(response => response.data)
			.then(unzipImageResponse);

		toast.promise(request, {
			loading: 'Detectando malezas...',
			success: file => {
				handleSetPredictionData({ data: file });
				handleImageStatus({ status: status.COMPLETED });
				handleSetCurrentPage({ pageName: pageNames.resultsPage });
				return 'Detección de malezas exitosa!';
			},
			error: e => {
				console.log(e);
				handleImageStatus({ status: status.FAILED });
				return 'Error al detectar malezas';
			},
		});
	};

	return {
		// state
		control,
		errorImgz,
		errorMaxDet,
		imageStatus,

		// actions
		register,
		handleSubmit,
		handlePredictImage,
	};
};
