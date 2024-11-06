import axios from 'axios';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useIndexedDB } from 'react-indexed-db-hook';
import { imageTypes } from '../types';
import { useUiContext } from './useUiContext';
import { useImagesContext } from './useImagesContext';
import { unzipImageResponse } from '../utils';
import {
	dbStoreName,
	defaultPredictParameters,
	inputNames,
	modelClassKeys,
	pageNames,
	status,
} from '../constants';

const apiPrefix = import.meta.env.DEV ? '/api/' : '/';

export const useImagePredictForm = () => {
	const [t] = useTranslation('global');
	const { handleSetCurrentPage } = useUiContext();
	const { add, getAll, deleteRecord } = useIndexedDB(dbStoreName);

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
		if (!readImage || !readImageFile)
			return handleSetMessages({
				type: imageTypes.SET_ERROR_MESSAGE,
				message: t('predictionPage.alerts.imageNotFound'),
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
				message: t('predictionPage.alerts.noClassSelected'),
				cleanMessage: true,
			});

		// Set loading status
		handleImageStatus({ status: status.LOADING });

		// Set classes keys
		data.classes = classes;

		// If save_txt is not set, use save_conf
		data.save_txt = data.save_txt || data.save_conf;

		// Generate query params
		const queryParams = new URLSearchParams(data).toString();

		// Form data
		const formData = new FormData();

		formData.append('image', readImageFile);

		const config = { headers: { 'Content-Type': 'multipart/form-data' }, responseType: 'blob' };

		const request = axios
			.post(apiPrefix + 'predict?' + queryParams, formData, config)
			.then(response => response.data)
			.then(unzipImageResponse)
			.then(async file => {
				const predictions = await getAll();

				if (predictions.length > 99) {
					const [first] = predictions;
					await deleteRecord(first.id);
				}

				const dataToSerialize = { ...file, date: format(new Date(), 'dd/MM/yyyy HH:mm:ss') };

				await add(dataToSerialize);

				return dataToSerialize;
			});

		toast.promise(request, {
			loading: t('predictionPage.messages.loadingPrediction'),
			success: data => {
				handleSetPredictionData({ data });
				handleImageStatus({ status: status.COMPLETED });
				handleSetCurrentPage({ pageName: pageNames.resultsPage });
				return t('predictionPage.messages.detectionSuccess');
			},
			error: () => {
				handleImageStatus({ status: status.FAILED });
				return t('predictionPage.alerts.detectionFailed');
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
