/* eslint-disable react/prop-types */
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

const defaultStyles =
	'flex flex-col items-center w-full justify-center h-64 border-2 border-zinc-500 border-dashed rounded-lg cursor-pointer bg-zinc-800 hover:bg-zinc-700 outline-none transition-colors';

export const SquareDropzone = ({
	onDrop,
	className,
	validFileFormatMessage,
	maxFiles = 1,
	disabled = false,
}) => {
	const [t] = useTranslation('global');
	const { isDragAccept, getRootProps, getInputProps } = useDropzone({
		disabled,
		maxFiles,
		onDrop,
	});

	const renderText = () => {
		if (isDragAccept) return t('predictionPage.dropzone.isDragAcceptedMessage');

		if (validFileFormatMessage) return validFileFormatMessage;

		return 'JPG, JPEG o PNG';
	};

	const isDragAcceptStyle = isDragAccept && 'bg-teal-900 border-gray-200';

	return (
		<div {...getRootProps()} className={twMerge(defaultStyles, className, isDragAcceptStyle)}>
			<div className='flex flex-col items-center justify-center py-6 px-4'>
				<svg
					className='w-8 h-8 mb-4'
					aria-hidden='true'
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='0 0 20 16'
				>
					<path
						stroke='currentColor'
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2'
					/>
				</svg>

				<p className='mb-2'>
					<span>{t('predictionPage.dropzone.selectFileMessage')}</span>{' '}
					{t('predictionPage.dropzone.dragFileMessage')}
				</p>
				<p className='text-gray-500 dark:text-gray-400'>{renderText()}</p>
			</div>
			<input {...getInputProps()} />
		</div>
	);
};
