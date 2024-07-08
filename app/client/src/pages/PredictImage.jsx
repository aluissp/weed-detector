import { PiBroomBold } from 'react-icons/pi';
import { TbPhotoSearch } from 'react-icons/tb';
import { ExampleImages, SquareDropzone } from '../components';
import { FormButton, FormInput, RangeInput, ToggleInput } from '../common/components';
import { useImagePredictForm, useReadDropzoneImage, useUiContext } from '../hooks';
import {
	status,
	inputNames,
	modelClassNames,
	modelClassKeys,
	dropzoneStatus as constantDropzoneStatus,
} from '../constants';

export const PredictImage = () => {
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
						<h2 className='w-full text-center text-lg font-bold mb-2'>Imagen cargada</h2>
						<div className='flex items-center justify-center'>
							<img src={readImage} alt='Imagen cargada' className='w-auto h-64 rounded-lg' />
						</div>
					</>
				)}

				{/* Class to predict */}
				<div className='my-4 grid sm:grid-cols-3 gap-4'>
					<h2 className='w-full text-center font-bold sm:col-span-3'>
						Elija las clases a predecir
					</h2>

					<ToggleInput
						id={inputNames.papa}
						labelText={modelClassNames[modelClassKeys.papa]}
						{...register(inputNames.papa)}
					/>
					<ToggleInput
						id={inputNames.lengua_vaca}
						labelText={modelClassNames[modelClassKeys.lengua_vaca]}
						{...register(inputNames.lengua_vaca)}
					/>
					<ToggleInput
						id={inputNames.diente_leon}
						labelText={modelClassNames[modelClassKeys.diente_leon]}
						{...register(inputNames.diente_leon)}
					/>
					<ToggleInput
						id={inputNames.kikuyo}
						labelText={modelClassNames[modelClassKeys.kikuyo]}
						{...register(inputNames.kikuyo)}
					/>
					<ToggleInput
						id={inputNames.otro}
						labelText={modelClassNames[modelClassKeys.otro]}
						{...register(inputNames.otro)}
					/>
				</div>

				{/* Examples */}
				<ExampleImages />
			</div>
			{/* Parameters */}
			<div className='flex flex-col w-full md:pl-4 pb-4'>
				<h2 className='w-full text-center text-lg font-bold mb-3'>Ajuste de parámetros</h2>

				<form onSubmit={handleSubmit(handlePredictImage)}>
					<div className='grid grid-cols-2 gap-x-2 text-sm'>
						<h3 className='w-full text-left font-bold mb-3 col-span-2'>Parámetros de inferencia</h3>

						<FormInput
							id={inputNames.max_det}
							type='number'
							labelText='Número máximo de detecciones'
							error={errorMaxDet?.message}
							placeholder='Ingrese un valor entero'
							className='col-span-2 sm:col-span-1'
							{...register(inputNames.max_det, {
								required: 'Este campo es requerido',
								min: { value: 1, message: 'El valor mínimo es 1' },
								max: { value: 1000, message: 'El valor máximo es 1000' },
							})}
						/>

						<RangeInput
							id={inputNames.imgsz}
							name={inputNames.imgsz}
							labelText='Tamaño de imagen para la predicción'
							step={64}
							control={control}
							min={128}
							max={1920}
							thickNumber={11}
							className='col-span-2 sm:col-span-1'
						/>

						<RangeInput
							id={inputNames.conf}
							name={inputNames.conf}
							labelText='Umbral mínimo de confianza'
							step={0.01}
							control={control}
							min={0.01}
							max={1}
							thickNumber={9}
							className='col-span-2 sm:col-span-1'
						/>

						<RangeInput
							id={inputNames.iou}
							name={inputNames.iou}
							labelText='Umbral mínimo de IoU'
							step={0.01}
							control={control}
							min={0.01}
							max={1}
							thickNumber={9}
							className='col-span-2 sm:col-span-1'
						/>

						<ToggleInput
							id={inputNames.augment}
							labelText='Aumento en inferencia'
							className='my-3 sm:my-6 col-span-2 sm:col-span-1'
							{...register(inputNames.augment)}
						/>

						<ToggleInput
							id={inputNames.agnostic_nms}
							labelText='Supresión No Máxima (NMS)'
							className='my-3 sm:my-6 col-span-2 sm:col-span-1'
							{...register(inputNames.agnostic_nms)}
						/>

						<h3 className='w-full text-left font-bold mt-3 col-span-2'>
							Parámetros de visualización
						</h3>

						<ToggleInput
							id={inputNames.show_labels}
							labelText='Mostrar etiquetas'
							className='my-3 sm:my-6 col-span-2 sm:col-span-1'
							{...register(inputNames.show_labels)}
						/>

						<ToggleInput
							id={inputNames.show_conf}
							labelText='Mostrar nivel de confianza'
							className='my-3 sm:my-6 col-span-2 sm:col-span-1'
							{...register(inputNames.show_conf)}
						/>

						<ToggleInput
							id={inputNames.save_txt}
							labelText='Guardar resultados en texto'
							className='my-3 sm:my-6 col-span-2 sm:col-span-1'
							{...register(inputNames.save_txt)}
						/>

						<ToggleInput
							id={inputNames.save_conf}
							labelText='Incluir puntuaciones de confianza'
							className='my-3 sm:my-6 col-span-2 sm:col-span-1'
							{...register(inputNames.save_conf)}
						/>

						<ToggleInput
							id={inputNames.save_crop}
							labelText='Guardar recortes de detecciones'
							className='my-3 sm:my-6 col-span-2 sm:col-span-1'
							{...register(inputNames.save_crop)}
						/>

						<RangeInput
							id={inputNames.line_width}
							name={inputNames.line_width}
							labelText='Ancho de línea del bounding box'
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
							Limpiar imagen
						</FormButton>

						<FormButton
							type='submit'
							disabled={imageStatus === status.LOADING}
							className='col-span-2 sm:col-span-1 mt-2 sm:mt-0 mb-16 sm:mb-0' // check mb-16 sm:mb-0
						>
							<TbPhotoSearch className='text-xl' />
							Detectar malezas
						</FormButton>
					</div>
				</form>
			</div>
		</section>
	);
};
