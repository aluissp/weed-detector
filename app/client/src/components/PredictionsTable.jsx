/* eslint-disable react/prop-types */
import { useTranslation } from 'react-i18next';
import { modelClassKeys } from '../constants';

export const PredictionsTable = ({ tableData }) => {
	const [t] = useTranslation('global');

	const modelKeyNameColor = [
		[modelClassKeys.papa, t('modelClasses.potato'), t('modelClassColors.potato')],
		[modelClassKeys.diente_leon, t('modelClasses.dandelion'), t('modelClassColors.dandelion')],
		[modelClassKeys.kikuyo, t('modelClasses.grass'), t('modelClassColors.grass')],
		[modelClassKeys.lengua_vaca, t('modelClasses.broadleafDock'), t('modelClassColors.broadleafDock')],
		[modelClassKeys.otro, t('modelClasses.others'), t('modelClassColors.others')],
	];

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
							{t('showResultsPage.predictionsTable.countPlantsColumn')}
						</th>
						<th scope='col' className='px-6 py-3'>
							{t('showResultsPage.predictionsTable.coverageColumn')}
						</th>
					</tr>
				</thead>
				<tbody>
					{modelKeyNameColor.map(
						([key, name, color]) =>
							tableData[key] && (
								<tr key={key} className='border-b bg-zinc-800 border-zinc-700 hover:bg-zinc-700'>
									<th scope='row' className='px-6 py-4 font-medium whitespace-nowrap text-white'>
										{name}
									</th>
									<td className='px-6 py-4'>{color}</td>
									<td className='px-6 py-4'>{tableData[key].count}</td>
									<td className='px-6 py-4'>{tableData[key].coverage.toFixed(2) + ' %'}</td>
								</tr>
							)
					)}
				</tbody>
			</table>
		</div>
	);
};
