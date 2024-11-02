/* eslint-disable react/prop-types */
import { useTranslation } from 'react-i18next';
import { modelClassKeys } from '../constants';

export const PredictionsTable = ({ tableData }) => {
	const [t] = useTranslation('global');

	return (
		<div className='relative overflow-x-auto shadow-md rounded-lg'>
			<table className='w-full text-sm text-left rtl:text-right text-gray-300 '>
				<thead className='text-xs uppercase bg-zinc-700'>
					<tr>
						<th scope='col' className='px-6 py-3'>
							{t('showResultsPage.predictionsTable.nameColumn')}
						</th>
						<th scope='col' className='px-6 py-3'>
							{t('showResultsPage.predictionsTable.colorColumn')}
						</th>
						<th scope='col' className='px-6 py-3'>
							{t('showResultsPage.predictionsTable.numberPlantsColumn')}
						</th>
						<th scope='col' className='px-6 py-3'>
							{t('showResultsPage.predictionsTable.confidenceColumn')}
						</th>
					</tr>
				</thead>
				<tbody>
					{tableData[modelClassKeys.papa] && (
						<tr className='border-b bg-zinc-800 border-zinc-700 hover:bg-zinc-700'>
							<th scope='row' className='px-6 py-4 font-medium whitespace-nowrap text-white'>
								{t('modelClasses.potato')}
							</th>
							<td className='px-6 py-4'>{t('modelClassColors.potato')}</td>
							<td className='px-6 py-4'>{tableData[modelClassKeys.papa].count}</td>
							<td className='px-6 py-4'>{tableData[modelClassKeys.papa].avgConfidence}</td>
						</tr>
					)}
					{tableData[modelClassKeys.diente_leon] && (
						<tr className='border-b bg-zinc-800 border-zinc-700 hover:bg-zinc-700'>
							<th scope='row' className='px-6 py-4 font-medium whitespace-nowrap text-white'>
								{t('modelClasses.dandelion')}
							</th>
							<td className='px-6 py-4'>{t('modelClassColors.dandelion')}</td>
							<td className='px-6 py-4'>{tableData[modelClassKeys.diente_leon].count}</td>
							<td className='px-6 py-4'>{tableData[modelClassKeys.diente_leon].avgConfidence}</td>
						</tr>
					)}
					{tableData[modelClassKeys.kikuyo] && (
						<tr className='border-b bg-zinc-800 border-zinc-700 hover:bg-zinc-700'>
							<th scope='row' className='px-6 py-4 font-medium whitespace-nowrap text-white'>
								{t('modelClasses.grass')}
							</th>
							<td className='px-6 py-4'>{t('modelClassColors.grass')}</td>
							<td className='px-6 py-4'>{tableData[modelClassKeys.kikuyo].count}</td>
							<td className='px-6 py-4'>{tableData[modelClassKeys.kikuyo].avgConfidence}</td>
						</tr>
					)}
					{tableData[modelClassKeys.lengua_vaca] && (
						<tr className='border-b bg-zinc-800 border-zinc-700 hover:bg-zinc-700'>
							<th scope='row' className='px-6 py-4 font-medium whitespace-nowrap text-white'>
								{t('modelClasses.cowTongue')}
							</th>
							<td className='px-6 py-4'>{t('modelClassColors.cowTongue')}</td>
							<td className='px-6 py-4'>{tableData[modelClassKeys.lengua_vaca].count}</td>
							<td className='px-6 py-4'>{tableData[modelClassKeys.lengua_vaca].avgConfidence}</td>
						</tr>
					)}
					{tableData[modelClassKeys.otro] && (
						<tr className='border-b bg-zinc-800 border-zinc-700 hover:bg-zinc-700'>
							<th scope='row' className='px-6 py-4 font-medium whitespace-nowrap text-white'>
								{t('modelClasses.others')}
							</th>
							<td className='px-6 py-4'>{t('modelClassColors.others')}</td>
							<td className='px-6 py-4'>{tableData[modelClassKeys.otro].count}</td>
							<td className='px-6 py-4'>{tableData[modelClassKeys.otro].avgConfidence}</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
};
