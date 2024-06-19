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
import { useImagesContext } from './useImagesContext';
import { dbStoreName, pageNames, status } from '../constants';
import { downloadFile, unzipImageResponse } from '../utils';

const columns = [
	{ header: 'id', accessorKey: 'id' },
	{ header: 'Nombre', accessorKey: 'fileName' },
	{ header: 'Fecha', accessorKey: 'date' },
];

export const useHistoryTable = ({ predictedHistory }) => {
	const [sorting, setSorting] = useState([]);
	const [filtering, setFiltering] = useState('');

	const { getByID, deleteRecord, clear } = useIndexedDB(dbStoreName);
	const { handleSetCurrentPage } = useUiContext();
	const { handleSetPredictionData, handleImageStatus, handleSetMessages } = useImagesContext();

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
				message: 'Historial limpiado con éxito',
				cleanMessage: true,
			});
			handleImageStatus({ status: status.COMPLETED });
		} catch (error) {
			handleSetMessages({
				type: imageTypes.SET_ERROR_MESSAGE,
				message: 'Error al limpiar el historial',
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
				message: 'Registro eliminado con éxito',
				cleanMessage: true,
			});
			handleImageStatus({ status: status.COMPLETED });
		} catch (error) {
			handleSetMessages({
				type: imageTypes.SET_ERROR_MESSAGE,
				message: 'Error al eliminar el registro',
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
