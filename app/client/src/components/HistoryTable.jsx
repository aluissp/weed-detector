/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useIndexedDB } from 'react-indexed-db-hook';
import {
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { FormButton } from '../common/components';
import { dbStoreName, pageNames, status } from '../constants';
import { useImagesContext } from '../hooks/useImagesContext';
import { useUiContext } from '../hooks/useUiContext';
import { downloadFile, unzipImageResponse } from '../utils';
import { imageTypes } from '../types';

const columns = [
	{ header: 'id', accessorKey: 'id' },
	{ header: 'Nombre', accessorKey: 'fileName' },
	{ header: 'Fecha', accessorKey: 'date' },
];

export const HistoryTable = ({ predictedHistory }) => {
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

	return (
		<>
			<div className='flex justify-between items-center flex-col min-[461px]:flex-row gap-4 mb-4'>
				<input
					className='bg-white rounded-lg p-[6px] outline-none placeholder:text-dark text-sm w-full text-dark min-[461px]:w-auto'
					type='text'
					value={filtering}
					onChange={({ target }) => setFiltering(target.value)}
					placeholder='Buscar un registro...'
				/>

				<FormButton
					className='sm:px-4 min-[461px]:w-auto w-full hover:bg-red-700'
					onClick={() => handleClearAllHistory()}
				>
					Limpiar todo el historial
				</FormButton>
			</div>
			<div className='relative overflow-x-auto shadow-md rounded-lg'>
				<table className='w-full text-sm text-left rtl:text-right text-gray-300 '>
					<thead className='text-xs uppercase bg-zinc-700'>
						<tr>
							<th
								onClick={table.getColumn('id').getToggleSortingHandler()}
								scope='col'
								className='px-6 py-3 min-w-[75px]'
							>
								{table.getColumn('id').columnDef.header}
								{{ asc: ' ↑', desc: ' ↓' }[table.getColumn('id').getIsSorted() ?? null]}
							</th>
							<th
								onClick={table.getColumn('fileName').getToggleSortingHandler()}
								scope='col'
								className='px-6 py-3 min-w-28'
							>
								{table.getColumn('fileName').columnDef.header}
								{{ asc: ' ↑', desc: ' ↓' }[table.getColumn('fileName').getIsSorted() ?? null]}
							</th>
							<th
								onClick={table.getColumn('date').getToggleSortingHandler()}
								scope='col'
								className='px-6 py-3 min-w-28'
							>
								{table.getColumn('date').columnDef.header}
								{{ asc: ' ↑', desc: ' ↓' }[table.getColumn('date').getIsSorted() ?? null]}
							</th>
							<th scope='col' className='px-6 py-3' colSpan='3'>
								Acciones
							</th>
						</tr>
					</thead>
					<tbody>
						{table.getRowModel().rows.map(row => (
							<tr className='border-b bg-zinc-800 border-zinc-700 hover:bg-zinc-700' key={row.id}>
								<th scope='row' className='px-6 py-2 font-medium whitespace-nowrap text-white w-16'>
									{row.getValue('id')}
								</th>
								<td className='px-6 py-2'>{row.getValue('fileName')}</td>
								<td className='px-6 py-2'>{row.getValue('date')}</td>
								<td className='px-6 py-2'>
									<FormButton
										className='sm:px-2 h-6 rounded-md'
										onClick={() => showPrediction(row.getValue('id'))}
									>
										Ver
									</FormButton>
								</td>
								<td className='px-6 py-2'>
									<FormButton
										className='sm:px-2 h-6 rounded-md hover:bg-sky-800'
										onClick={() => handleDownloadFile(row.getValue('id'))}
									>
										Descargar
									</FormButton>
								</td>
								<td className='px-6 py-2'>
									<FormButton
										className='sm:px-2 h-6 rounded-md hover:bg-red-700'
										onClick={() => handleDeleteHistory(row.getValue('id'))}
									>
										Eliminar
									</FormButton>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className='flex items-center flex-col min-[461px]:flex-row justify-start gap-2 my-4'>
				<FormButton
					className='sm:px-4 h-6 rounded-md disabled:cursor-not-allowed'
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					Anterior
				</FormButton>
				<FormButton
					className='sm:px-4 h-6 rounded-md disabled:cursor-not-allowed'
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					Siguiente
				</FormButton>
				<p>-</p>
				<FormButton
					className='sm:px-4 h-6 rounded-md disabled:cursor-not-allowed truncate'
					onClick={() => table.firstPage()}
					disabled={!table.getCanPreviousPage()}
				>
					Primera página
				</FormButton>
				<FormButton
					className='sm:px-4 h-6 rounded-md disabled:cursor-not-allowed truncate'
					onClick={() => table.lastPage()}
					disabled={!table.getCanNextPage()}
				>
					Ultima página
				</FormButton>
			</div>
		</>
	);
};
