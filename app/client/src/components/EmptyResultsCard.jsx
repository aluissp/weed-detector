import { useTranslation } from 'react-i18next';

export const EmptyResultsCard = () => {
	const [t] = useTranslation('global');
	return (
		<div className='text-white text-center '>
			<h2 className='w-full text-lg font-bold mb-2'>{t('showResultsPage.emptyCard.title')}</h2>
			<p>{t('showResultsPage.emptyCard.message')}</p>
		</div>
	);
};
