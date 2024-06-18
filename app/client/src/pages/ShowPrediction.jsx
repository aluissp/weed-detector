import Zoom from 'react-medium-image-zoom';
import { FaDownload } from 'react-icons/fa6';
import { downloadFile } from '../utils';
import { useImagesContext } from '../hooks';
import { FormButton } from '../common/components';
import { EmptyResultsCard, PredictionsTable } from '../components';
import './image-zoom-styles.css';

export const ShowPrediction = () => {
	const { predictionData } = useImagesContext();

	if (!predictionData) return <EmptyResultsCard />;

	const tableData = predictionData?.jsonData?.tableData;

	const speed = predictionData?.jsonData?.speed;

	const numberDetections = predictionData?.jsonData?.summary?.length;

	const fileName = predictionData?.jsonData?.fileName;

	return (
		<section className='grid md:grid-cols-2 gap-x-6 items-start md:justify-between w-full text-white animate-fade'>
			{/* Left */}

			<div className='flex flex-col w-full items-center justify-center mb-4'>
				<Zoom>
					<img src={predictionData?.image} alt='Imagen predicha' className='rounded-lg max-h-96' />
				</Zoom>
			</div>
			<div className='flex flex-col w-full'>
				<h2 className='w-full text-center text-lg font-bold mb-3'>Resultados</h2>

				<p className='mb-2'>
					<strong>Número total de detecciones:</strong> {numberDetections}
				</p>
				<p className='mb-2'>
					<strong>Tiempo de inferencia:</strong> {speed?.inference.toFixed(4)} milisegundos
				</p>
				<p className='mb-2'>
					<strong>Tiempo de preprocesado:</strong> {speed?.preprocess.toFixed(4)} milisegundos
				</p>
				<p className='mb-6'>
					<strong>Tiempo de postprocesado:</strong> {speed?.postprocess.toFixed(4)} milisegundos
				</p>

				<PredictionsTable tableData={tableData} />

				<div className='flex justify-end'>
					<FormButton
						className='mt-4'
						onClick={() => downloadFile(predictionData?.file, `inference_${fileName}`, 'zip')}
					>
						<FaDownload />
						Descargar resultados
					</FormButton>
				</div>
			</div>
		</section>
	);
};
