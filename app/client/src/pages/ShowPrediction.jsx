import Zoom from 'react-medium-image-zoom';
import { useImagesContext } from '../hooks';
import { EmptyResultsCard } from '../components';
import './image-zoom-styles.css';

export const ShowPrediction = () => {
	const { predictionData } = useImagesContext();

	// if (!predictionData) return <EmptyResultsCard />;

	return (
		<section className='grid md:grid-cols-2 gap-x-6 items-start md:justify-between w-full text-white animate-fade'>
			{/* Left */}
			<div className='flex flex-col w-full items-center justify-center'>
				<Zoom>
					{/* <img src='/00111.jpg' alt='Imagen predicha' className='rounded-lg max-h-96' /> */}
					<img src='/frame_01551.jpg' alt='Imagen predicha' className='rounded-lg max-h-96' />
				</Zoom>
			</div>
			<div className='flex flex-col w-full'>
				<h2 className='w-full text-center text-lg font-bold mb-3'>Resultados</h2>
			</div>
		</section>
	);
};
