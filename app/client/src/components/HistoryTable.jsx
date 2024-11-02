/* eslint-disable react/prop-types */
import { useTranslation } from 'react-i18next';
import { useHistoryTable } from '../hooks';
import { FormButton } from '../common/components';

export const HistoryTable = ({ predictedHistory }) => {
	const [t] = useTranslation('global');
	const {
		table,
		filtering,
		setFiltering,
		handleClearAllHistory,
		handleDeleteHistory,
		handleDownloadFile,
		showPrediction,
	} = useHistoryTable({ predictedHistory });
	return (
		<>
			<div className='flex justify-between items-center flex-col min-[461px]:flex-row gap-4 mb-4'>
				<input
					className='bg-white rounded-lg p-[6px] outline-none placeholder:text-dark text-sm w-full text-dark min-[461px]:w-auto'
					type='text'
					name='filtering'
					value={filtering}
					onChange={({ target }) => setFiltering(target.value)}
					placeholder={t('historyPage.historyTable.filterInput')}
				/>

				<FormButton
					className='sm:px-4 min-[461px]:w-auto w-full hover:bg-red-700'
					onClick={() => handleClearAllHistory()}
				>
					{t('historyPage.historyTable.cleanHistory')}
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
								{/* { asc: ' ↑', desc: ' ↓' } this is correct however in this particular
								case I'll change the icons*/}
								{{ asc: ' ↓', desc: ' ↑' }[table.getColumn('id').getIsSorted() ?? null]}
							</th>
							<th
								onClick={table.getColumn('fileName').getToggleSortingHandler()}
								scope='col'
								className='px-6 py-3 min-w-28'
							>
								{table.getColumn('fileName').columnDef.header}
								{{ asc: ' ↓', desc: ' ↑' }[table.getColumn('fileName').getIsSorted() ?? null]}
							</th>
							<th
								onClick={table.getColumn('date').getToggleSortingHandler()}
								scope='col'
								className='px-6 py-3 min-w-28'
							>
								{table.getColumn('date').columnDef.header}
								{{ asc: ' ↓', desc: ' ↑' }[table.getColumn('date').getIsSorted() ?? null]}
							</th>
							<th scope='col' className='px-6 py-3' colSpan='3'>
								{t('historyPage.historyTable.actionsColumn')}
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
										{t('historyPage.historyTable.viewButton')}
									</FormButton>
								</td>
								<td className='px-6 py-2'>
									<FormButton
										className='sm:px-2 h-6 rounded-md hover:bg-sky-800'
										onClick={() => handleDownloadFile(row.getValue('id'))}
									>
										{t('historyPage.historyTable.downloadButton')}
									</FormButton>
								</td>
								<td className='px-6 py-2'>
									<FormButton
										className='sm:px-2 h-6 rounded-md hover:bg-red-700'
										onClick={() => handleDeleteHistory(row.getValue('id'))}
									>
										{t('historyPage.historyTable.deleteButton')}
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
					{t('historyPage.historyTable.previousButton')}
				</FormButton>
				<FormButton
					className='sm:px-4 h-6 rounded-md disabled:cursor-not-allowed'
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					{t('historyPage.historyTable.nextButton')}
				</FormButton>
				<p>-</p>
				<FormButton
					className='sm:px-4 h-6 rounded-md disabled:cursor-not-allowed truncate'
					onClick={() => table.firstPage()}
					disabled={!table.getCanPreviousPage()}
				>
					{t('historyPage.historyTable.firstPageButton')}
				</FormButton>
				<FormButton
					className='sm:px-4 h-6 rounded-md disabled:cursor-not-allowed truncate'
					onClick={() => table.lastPage()}
					disabled={!table.getCanNextPage()}
				>
					{t('historyPage.historyTable.lastPageButton')}
				</FormButton>
			</div>
		</>
	);
};
