import { PiBroomBold } from 'react-icons/pi';
import { TbPhotoSearch } from 'react-icons/tb';
import { useTranslation } from 'react-i18next';
import { ExampleImages, SquareDropzone } from '../components';
import { FormButton, FormInput, RangeInput, ToggleInput } from '../common/components';
import { useImagePredictForm, useReadDropzoneImage, useUiContext } from '../hooks';
import { status, inputNames, dropzoneStatus as constantDropzoneStatus } from '../constants';

export const PredictImage = () => {
	const [t] = useTranslation('global');
	const { handleCleanDropzoneData } = useUiContext();
	const { readImage, dropzoneStatus, handleChangeFile } = useReadDropzoneImage();
	const { control, errorMaxDet, imageStatus, handlePredictImage, handleSubmit, register } =
		useImagePredictForm();

	return (
		<section className='grid md:grid-cols-2 gap-x-2 items-start md:justify-between w-full text-white animate-fade'>
			{/* Left */}
			<div className='flex flex-col w-full'>
				{/* Dropzone */}
				{dropzoneStatus === constantDropzoneStatus.SHOW_DROPZONE ? (
					<SquareDropzone onDrop={handleChangeFile} />
				) : (
					<>
						<h2 className='w-full text-center text-lg font-bold mb-2'>
							{t('predictionPage.subtitles.imageLoaded')}
						</h2>
						<div className='flex items-center justify-center'>
							<img
								src={readImage}
								alt={t('predictionPage.subtitles.imageLoaded')}
								className='w-auto h-64 rounded-lg'
							/>
						</div>
					</>
				)}

				{/* Class to predict */}
				<div className='my-4 grid sm:grid-cols-3 gap-4'>
					<h2 className='w-full text-center font-bold sm:col-span-3'>
						{t('predictionPage.subtitles.imageClasses')}
					</h2>

					<ToggleInput
						id={inputNames.papa}
						labelText={t('modelClasses.potato')}
						{...register(inputNames.papa)}
					/>
					<ToggleInput
						id={inputNames.lengua_vaca}
						labelText={t('modelClasses.broadleafDock')}
						{...register(inputNames.lengua_vaca)}
					/>
					<ToggleInput
						id={inputNames.diente_leon}
						labelText={t('modelClasses.dandelion')}
						{...register(inputNames.diente_leon)}
					/>
					<ToggleInput
						id={inputNames.kikuyo}
						labelText={t('modelClasses.grass')}
						{...register(inputNames.kikuyo)}
					/>
					<ToggleInput
						id={inputNames.otro}
						labelText={t('modelClasses.others')}
						{...register(inputNames.otro)}
					/>
				</div>

				{/* Examples */}
				<ExampleImages />
			</div>
			{/* Parameters */}
			<div className='flex flex-col w-full md:pl-4 pb-4'>
				<h2 className='w-full text-center text-lg font-bold mb-3'>
					{t('predictionPage.subtitles.parameters')}
				</h2>

				<form onSubmit={handleSubmit(handlePredictImage)}>
					<div className='grid grid-cols-2 gap-x-2 text-sm'>
						<h3 className='w-full text-left font-bold mb-3 col-span-2 text-base'>
							{t('predictionPage.subtitles.inferenceParameters')}
						</h3>

						<FormInput
							id={inputNames.max_det}
							type='number'
							labelText={t('predictionPage.inferenceParameters.maxDetections')}
							error={errorMaxDet?.message}
							placeholder={t('common.inputPlaceholder')}
							className='col-span-2 sm:col-span-1'
							{...register(inputNames.max_det, {
								required: t('common.required'),
								min: { value: 1, message: t('common.minValue', { min: 1 }) },
								max: {
									value: 1000,
									message: t('common.maxValue', { max: 1000 }),
								},
							})}
						/>

						<ToggleInput
							id={inputNames.augment}
							labelText={t('predictionPage.inferenceParameters.augment')}
							className='col-span-2 sm:col-span-1 md:mt-3'
							{...register(inputNames.augment)}
						/>

						<RangeInput
							id={inputNames.conf}
							name={inputNames.conf}
							labelText={t('predictionPage.inferenceParameters.conf')}
							step={0.01}
							control={control}
							min={0.01}
							max={1}
							thickNumber={9}
							className='my-3 sm:my-5 col-span-2 sm:col-span-1'
						/>

						<RangeInput
							id={inputNames.imgsz}
							name={inputNames.imgsz}
							labelText={t('predictionPage.inferenceParameters.imageSize')}
							step={32}
							control={control}
							min={448}
							max={1024}
							thickNumber={11}
							className='my-3 sm:my-5 col-span-2 sm:col-span-1'
						/>

						<h3 className='w-full text-left font-bold mt-3 col-span-2 text-base'>
							{t('predictionPage.subtitles.visualizationParameters')}
						</h3>

						<ToggleInput
							id={inputNames.show_labels}
							labelText={t('predictionPage.visualizationParameters.showLabels')}
							className='my-3 sm:my-5 col-span-2 sm:col-span-1'
							{...register(inputNames.show_labels)}
						/>

						<ToggleInput
							id={inputNames.show_conf}
							labelText={t('predictionPage.visualizationParameters.showConf')}
							className='my-3 sm:my-5 col-span-2 sm:col-span-1'
							{...register(inputNames.show_conf)}
						/>

						<ToggleInput
							id={inputNames.save_txt}
							labelText={t('predictionPage.visualizationParameters.saveTxt')}
							className='my-3 sm:my-5 col-span-2 sm:col-span-1'
							{...register(inputNames.save_txt)}
						/>

						<ToggleInput
							id={inputNames.save_conf}
							labelText={t('predictionPage.visualizationParameters.saveConf')}
							className='my-3 sm:my-5 col-span-2 sm:col-span-1'
							{...register(inputNames.save_conf)}
						/>

						<ToggleInput
							id={inputNames.save_crop}
							labelText={t('predictionPage.visualizationParameters.saveCrop')}
							className='my-3 sm:my-5 col-span-2 sm:col-span-1'
							{...register(inputNames.save_crop)}
						/>

						<RangeInput
							id={inputNames.line_width}
							name={inputNames.line_width}
							labelText={t('predictionPage.visualizationParameters.lineWidth')}
							step={1}
							control={control}
							min={1}
							max={10}
							thickNumber={8}
							className='col-span-2 sm:col-span-1'
						/>

						<FormButton
							type='button'
							className='col-span-2 sm:col-span-1'
							onClick={handleCleanDropzoneData}
							disabled={imageStatus === status.LOADING}
						>
							<PiBroomBold className='text-xl' />
							{t('predictionPage.buttons.clean')}
						</FormButton>

						<FormButton
							type='submit'
							disabled={imageStatus === status.LOADING}
							className='col-span-2 sm:col-span-1 mt-2 sm:mt-0 mb-16 sm:mb-0' // check mb-16 sm:mb-0
						>
							<TbPhotoSearch className='text-xl' />
							{t('predictionPage.buttons.detect')}
						</FormButton>
					</div>
				</form>
			</div>
		</section>
	);
};
