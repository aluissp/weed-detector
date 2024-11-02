import { useState } from 'react';
import { useIndexedDB } from 'react-indexed-db-hook';
import {
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { imageTypes } from '../types';
import { useUiContext } from './useUiContext';
import { useTranslation } from 'react-i18next';
import { useImagesContext } from './useImagesContext';
import { dbStoreName, pageNames, status } from '../constants';
import { downloadFile, unzipImageResponse } from '../utils';



export const useHistoryTable = ({ predictedHistory }) => {
	const [t] = useTranslation('global');
	const [sorting, setSorting] = useState([]);
	const [filtering, setFiltering] = useState('');

	const { getByID, deleteRecord, clear } = useIndexedDB(dbStoreName);
	const { handleSetCurrentPage } = useUiContext();
	const { handleSetPredictionData, handleImageStatus, handleSetMessages } = useImagesContext();

	const columns = [
		{ header: t('historyPage.historyTable.idColumn'), accessorKey: 'id' },
		{ header: t('historyPage.historyTable.nameColumn'), accessorKey: 'fileName' },
		{ header: t('historyPage.historyTable.dateColumn'), accessorKey: 'date' },
	]

	const table = useReactTable({
		columns,
		data: predictedHistory,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		state: { sorting, globalFilter: filtering },
		onSortingChange: setSorting,
		onGlobalFilterChange: setFiltering,
	});

	const showPrediction = async id => {
		const { file } = await getByID(id);
		const data = await unzipImageResponse(file);
		handleSetPredictionData({ data });
		handleSetCurrentPage({ pageName: pageNames.resultsPage });
	};

	const handleDownloadFile = async id => {
		const { file, name } = await getByID(id);
		await downloadFile(file, `inference_${name}`, 'zip');
	};

	const handleClearAllHistory = async () => {
		try {
			handleImageStatus({ status: status.LOADING });
			await clear();
			handleSetMessages({
				type: imageTypes.SET_MESSAGE,
				message: t('historyPage.messages.cleanHistory'),
				cleanMessage: true,
			});
			handleImageStatus({ status: status.COMPLETED });
		} catch (error) {
			handleSetMessages({
				type: imageTypes.SET_ERROR_MESSAGE,
				message: t('historyPage.alerts.cleanHistory'),
				cleanMessage: true,
			});
			handleImageStatus({ status: status.FAILED });
		}
	};

	const handleDeleteHistory = async id => {
		try {
			handleImageStatus({ status: status.LOADING });
			await deleteRecord(id);
			handleSetMessages({
				type: imageTypes.SET_MESSAGE,
				message: t('historyPage.messages.deleteHistory'),
				cleanMessage: true,
			});
			handleImageStatus({ status: status.COMPLETED });
		} catch (error) {
			handleSetMessages({
				type: imageTypes.SET_ERROR_MESSAGE,
				message: t('historyPage.alerts.deleteHistory'),
				cleanMessage: true,
			});
			handleImageStatus({ status: status.FAILED });
		}
	};

	return {
		// state
		table,
		filtering,

		// actions
		setFiltering,
		showPrediction,
		handleDownloadFile,
		handleClearAllHistory,
		handleDeleteHistory,
	};
};
