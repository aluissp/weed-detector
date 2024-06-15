import { useForm } from 'react-hook-form';
import { TbPhotoSearch } from 'react-icons/tb';
import { SquareDropzone } from '../components';
import { defaultPredictParameters, inputNames } from '../constants';
import { FormButton, FormInput, RangeInput, ToggleInput } from '../common/components';

export const PredictImage = () => {
	const {
		register,
		handleSubmit,
		control,
		formState: { errors, isSubmitting },
	} = useForm({ defaultValues: defaultPredictParameters });

	const { [inputNames.imgsz]: errorImgz, [inputNames.max_det]: errorMaxDet } = errors;

	console.log('Submitting:', isSubmitting);

	return (
		<section className='grid md:grid-cols-2 gap-x-2 items-start md:justify-between w-full text-white '>
			{/* Left */}
			<div className='flex flex-col w-full'>
				{/* Dropzone */}
				<SquareDropzone onDrop={console.log} />

				{/* Class to predict */}
				<div className='mt-4 grid sm:grid-cols-3 gap-4'>
					<h2 className='w-full text-center font-bold mb-3 sm:col-span-3'>
						Elija las clases a predecir
					</h2>

					<ToggleInput id={inputNames.papa} labelText='Papa' {...register(inputNames.papa)} />
					<ToggleInput
						id={inputNames.lengua_vaca}
						labelText='Lengua de vaca'
						{...register(inputNames.lengua_vaca)}
					/>
					<ToggleInput
						id={inputNames.diente_leon}
						labelText='Diente de león'
						{...register(inputNames.diente_leon)}
					/>
					<ToggleInput id={inputNames.kikuyo} labelText='Kikuyo' {...register(inputNames.kikuyo)} />
					<ToggleInput id={inputNames.otro} labelText='Otros' {...register(inputNames.otro)} />
				</div>
			</div>
			{/* Parameters */}
			<div className='flex flex-col w-full md:pl-4 pb-4'>
				<h2 className='w-full text-center text-lg font-bold mb-3'>Ajuste de parámetros</h2>

				<form onSubmit={handleSubmit(console.log)}>
					<div className='grid grid-cols-2 gap-x-2'>
						<h3 className='w-full text-left font-bold mb-3 col-span-2'>Parámetros de inferencia</h3>

						<FormInput
							id={inputNames.imgsz}
							type='number'
							labelText='Tamaño de la imagen para la inferencia'
							error={errorImgz?.message}
							placeholder='Ingrese un valor en pixeles'
							{...register(inputNames.imgsz, {
								min: { value: 32, message: 'El valor mínimo es 32' },
								max: { value: 1920, message: 'El valor máximo es 1920' },
							})}
						/>

						<FormInput
							id={inputNames.max_det}
							type='number'
							labelText='Número máximo de detecciones'
							error={errorMaxDet?.message}
							placeholder='Ingrese un valor entero'
							{...register(inputNames.max_det, {
								min: { value: 1, message: 'El valor mínimo es 1' },
								max: { value: 1000, message: 'El valor máximo es 1000' },
							})}
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
							thickNumber={9}
							className='col-span-2 sm:col-span-1'
						/>

						<FormButton type='submit' className='col-span-2'>
							<TbPhotoSearch className='text-xl' />
							Detectar malezas
						</FormButton>
					</div>
				</form>
			</div>
		</section>
	);
};
