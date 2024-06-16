import axios from 'axios';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { imageTypes } from '../types';
import { useUiContext } from './useUiContext';
import { useImagesContext } from './useImagesContext';
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

		// Set loading status
		handleImageStatus({ status: status.LOADING });

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

		data.classes = classes;

		// Generate query params
		const queryParams = new URLSearchParams(data).toString();

		// Form data
		const formData = new FormData();

		formData.append('image', readImageFile);

		const config = { headers: { 'Content-Type': 'multipart/form-data' }, responseType: 'blob' };

		const request = axios.post('api/predict?' + queryParams, formData, config);

		toast.promise(request, {
			loading: 'Detectando malezas...',
			success: async ({ data: file }) => {
				// const zip = await JSZip.loadAsync(file);
				// const jsonfile = await zip.file('inference_results.json').async('string');
				// console.log(jsonfile);

				handleSetPredictionData({ data: file });
				handleImageStatus({ status: status.COMPLETED });
				handleSetCurrentPage({ pageName: pageNames.resultsPage });
				return 'Detección de malezas exitosa!';
			},
			error: () => {
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

		// actions
		register,
		handleSubmit,
		handlePredictImage,
	};
};
