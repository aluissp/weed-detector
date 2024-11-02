import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useImagesContext, useUiContext } from '../hooks';
import { dropzoneStatus, exampleImagePaths } from '../constants';

export const ExampleImages = () => {
	const [t] = useTranslation('global');
	const [imageSelected, setImageSelected] = useState('');
	const { handleSaveImageInContext } = useImagesContext();
	const { handleDropzoneVisibility } = useUiContext();

	const handleSetCurrentImage = async path => {
		const response = await fetch(path);
		const imageBlob = await response.blob();
		const imageFile = new File([imageBlob], path.replace('/', ''), { type: imageBlob.type });

		const target = { result: path };

		// Save image in context
		handleSaveImageInContext({ imageFile, target });

		// Hide dropzone
		handleDropzoneVisibility({ status: dropzoneStatus.SHOW_IMAGE });

		// Set image selected
		setImageSelected(path);
	};

	return (
		<div className='mb-4 md:mb-0 grid grid-cols-3 gap-x-4 gap-y-2'>
			<h2 className='w-full text-center font-bold col-span-3'>
				{t('predictionPage.subtitles.imageExamples')}
			</h2>

			{exampleImagePaths.map((path, index) => (
				<div key={index} className='relative max-w-xs overflow-hidden bg-cover bg-no-repeat'>
					<img
						src={path}
						alt={`${t('predictionPage.exampleImages.imgAlt')} ${index + 1}`}
						className='w-full h-full rounded-lg'
					/>
					<div
						className='absolute w-full h-full top-0 left-0 bg-black opacity-0 z-10 transition-opacity duration-300 hover:opacity-60 flex items-center justify-center'
						onClick={() => handleSetCurrentImage(path)}
					>
						<p className='font-bold text-sm sm:text-lg'>
							{imageSelected === path
								? t('predictionPage.exampleImages.imgSelected')
								: t('predictionPage.exampleImages.imgToSelect')}
						</p>
					</div>
				</div>
			))}
		</div>
	);
};
