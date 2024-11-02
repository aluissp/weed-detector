import { useTranslation } from 'react-i18next';
import { useImagesContext } from '../hooks';
import { HistoryTable } from '../components';

export const ShowHistory = () => {
	const [t] = useTranslation('global');
	const { predictedHistory } = useImagesContext();

	if (predictedHistory?.length < 1)
		return (
			<div className='text-white text-center '>
				<h2 className='w-full text-lg font-bold mb-2'>{t('historyPage.subtitles.empty')}</h2>
			</div>
		);

	return (
		<section className='flex flex-col w-full text-white animate-fade'>
			<h2 className='w-full text-center text-lg font-bold mb-3'>
				{t('historyPage.subtitles.default')}
			</h2>

			<HistoryTable predictedHistory={predictedHistory} />
		</section>
	);
};
