import Zoom from 'react-medium-image-zoom';
import { FaDownload } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import { downloadFile } from '../utils';
import { useImagesContext } from '../hooks';
import { FormButton } from '../common/components';
import { EmptyResultsCard, PredictionsTable } from '../components';
import './image-zoom-styles.css';

export const ShowPrediction = () => {
	const [t] = useTranslation('global');
	const { predictionData } = useImagesContext();

	if (!predictionData) return <EmptyResultsCard />;

	const tableData = predictionData?.jsonData?.tableData;

	const speed = predictionData?.jsonData?.speed;

	const numberDetections = predictionData?.jsonData?.summary?.length;

	const name = predictionData?.jsonData?.name;

	return (
		<section className='flex flex-col md:grid md:grid-cols-2 gap-x-6 items-start md:justify-between w-full text-white animate-fade'>
			{/* Left */}
			<div className='flex flex-col w-full items-center justify-center mb-4'>
				<Zoom>
					<img src={predictionData?.image} alt='Imagen predicha' className='rounded-lg max-h-96' />
				</Zoom>
			</div>
			<div className='flex flex-col w-full'>
				<h2 className='w-full text-center text-lg font-bold mb-3'>
					{t('showResultsPage.subtitle')}
				</h2>

				<p className='mb-2'>
					<strong>{t('showResultsPage.summary.numberDetectionsLabel')}:</strong> {numberDetections}
				</p>
				<p className='mb-2'>
					<strong>{t('showResultsPage.summary.inferenceTimeLabel')}: </strong>{' '}
					{t('showResultsPage.summary.valueFormat', { value: speed?.inference.toFixed(4) })}
				</p>
				<p className='mb-2'>
					<strong>{t('showResultsPage.summary.processingTimeLabel')}:</strong>{' '}
					{t('showResultsPage.summary.valueFormat', { value: speed?.preprocess.toFixed(4) })}
				</p>
				<p className='mb-6'>
					<strong>{t('showResultsPage.summary.postprocessingTimeLabel')}:</strong>{' '}
					{t('showResultsPage.summary.valueFormat', { value: speed?.postprocess.toFixed(4) })}
				</p>

				<PredictionsTable tableData={tableData} />

				<div className='flex justify-end'>
					<FormButton
						className='mt-4'
						onClick={() => downloadFile(predictionData?.file, `inference_${name}`, 'zip')}
					>
						<FaDownload />
						{t('showResultsPage.downloadResults')}
					</FormButton>
				</div>
			</div>
		</section>
	);
};
