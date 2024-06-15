import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { FaCircleHalfStroke } from 'react-icons/fa6';
import { LiaListSolid } from 'react-icons/lia';
import { MdImageSearch } from 'react-icons/md';
import { RiHistoryFill } from 'react-icons/ri';
import { FormInput, RangeInput } from './common/components';

export const App = () => {
	const disabled = false;
	const maxFiles = 1;
	const onDrop = () => console.log('onDrop');
	const { isDragAccept, getRootProps, getInputProps } = useDropzone({
		// disabled,
		// maxFiles,
		// onDrop,
		disabled,
		maxFiles,
		onDrop,
	});

	const {
		register,
		handleSubmit,
		control,
		formState: { errors, isSubmitting },
	} = useForm({
		defaultValues: {
			imgsz: 640,
			max_det: 300,
			line_width: 3,
			conf: 0.25,
			iou: 0.7,
		},
	});
	return (
		<>
			{/* Header */}
			<header className='absolute max-w-7xl mx-auto inset-x-0 top-0 z-50'>
				<nav className='flex items-center justify-between p-5 lg:px-7'>
					<div className='hidden sm:flex'></div>
					<h1 className='text-3xl font-extrabold tracking-tight text-white sm:text-5xl'>
						Detector de{' '}
						<span className='bg-gradient-to-tl from-slate-800 via-teal-500 to-zinc-400 bg-clip-text text-transparent'>
							Malezas
						</span>
					</h1>
					<div>
						<FaCircleHalfStroke className='text-3xl text-white' />
					</div>
				</nav>
			</header>

			{/* Background */}
			<div className='fixed dotted-background h-full top-0 left-0 right-0 z-0'></div>
			<div
				className='absolute right-[100px] z-10 h-[150px] w-[400px] rotate-[0deg] transform rounded-full bg-gradient-to-tl from-slate-800 via-teal-500 to-zinc-400 blur-[150px]'
				style={{ width: '600px', top: '-180px' }}
			></div>

			{/* Content */}
			<main className='relative isolate pt-10 sm:pt-16 pb-4 mx-auto max-w-7xl px-5 lg:px-7'>
				{/* Options nav */}
				<nav className='text-white text-xs sm:text-sm bg-transparent border-t border-b border-zinc-800 my-6'>
					<div className='py-4 mx-auto flex items-center justify-between gap-2'>
						<div className='flex gap-2 justify-start'>
							{/* button example */}
							{/* <button
							className='rounded-xl px-4 h-[35px] inline-flex items-center justify-center text-white bg-zinc-800 hover:bg-zinc-700 outline-none'
							type='button'
							>
							<div className='flex items-center justify-center gap-2'>
							<MdImageSearch className='text-xl' />
							Analizar imagen
							</div>
							</button> */}
							<button
								className='bg-teal-700 transition-colors px-4 h-[35px] rounded-xl outline-none items-center justify-center'
								type='button'
							>
								<div className='flex items-center justify-center gap-2'>
									<MdImageSearch className='text-xl' />
									Analizar imagen
								</div>
							</button>
							<button
								className='bg-zinc-800 hover:bg-teal-700 transition-colors px-4 h-[35px] rounded-xl outline-none items-center justify-center'
								type='button'
							>
								<div className='flex items-center justify-center gap-2'>
									<LiaListSolid className='text-xl' />
									Resultados
								</div>
							</button>
						</div>
						<button
							className='rounded-xl px-4 h-[35px] inline-flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 outline-none'
							type='button'
						>
							<div className='flex items-center justify-center gap-2'>
								<RiHistoryFill className='text-xl' />
								Historial
							</div>
						</button>
					</div>
				</nav>

				<section className='grid md:grid-cols-2 gap-x-2 items-start justify-between w-full text-white '>
					{/* Left */}
					<div className='flex flex-col w-full'>
						{/* Dropzone */}
						<div
							{...getRootProps()}
							className='flex flex-col items-center w-full justify-center h-64 border-2 border-zinc-500 border-dashed rounded-lg cursor-pointer bg-zinc-800 hover:bg-zinc-700 outline-none transition-colors'
						>
							<div className='flex flex-col items-center justify-center py-6 px-4'>
								{/* Dropzone Icon */}
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
									<span>Seleccionar un archivo</span> o arrastre y suéltelo aquí.
								</p>
								{/* <p className='text-gray-500 dark:text-gray-400'>{renderText()}</p> */}
								<p>Suelta el archivo para subirlo!</p>
							</div>
							<input {...getInputProps()} />
						</div>

						{/* Class to predict */}

						<div className='mt-4'>
							<h2 className='w-full text-center text-lg font-bold mb-3'>
								Elija las clases a predecir
							</h2>
						</div>
					</div>
					{/* Parameters */}
					<div className='flex flex-col w-full pl-4 pb-4'>
						<h2 className='w-full text-center text-lg font-bold mb-3'>Ajuste de parámetros</h2>

						<form onSubmit={handleSubmit(console.log)}>
							<div className='grid md:grid-cols-2 gap-x-2'>
								<h3 className='w-full text-left font-bold mb-3 col-span-2'>
									Parámetros de inferencia
								</h3>

								<FormInput
									type='number'
									labelText='Tamaño de la imagen para la inferencia'
									// step='0.01'
									// error={namesError?.message}
									// error='El valor mínimo es 32'
									placeholder='Ingrese un valor en pixeles'
									{...register('imgsz', {
										min: { value: 32, message: 'El valor mínimo es 32' },
										max: { value: 1920, message: 'El valor máximo es 1920' },
									})}
								/>

								<FormInput
									type='number'
									labelText='Número máximo de detecciones'
									// step='0.01'
									// error={namesError?.message}
									placeholder='Ingrese un valor entero'
									{...register('max_det', {
										min: { value: 1, message: 'El valor mínimo es 1' },
										max: { value: 1000, message: 'El valor máximo es 1000' },
									})}
								/>

								<RangeInput
									name='line_width'
									labelText='Ancho de línea del bounding box'
									step={1}
									control={control}
									min={1}
									max={10}
									thickNumber={9}
								/>

								<RangeInput
									name='conf'
									labelText='Umbral mínimo de confianza'
									step={0.01}
									control={control}
									min={0.01}
									max={1}
									thickNumber={9}
								/>

								<RangeInput
									name='iou'
									labelText='Umbral mínimo de IoU'
									step={0.01}
									control={control}
									min={0.01}
									max={1}
									thickNumber={9}
								/>

								<h3 className='w-full text-left font-bold my-3 col-span-2'>
									Parámetros de visualización
								</h3>

								<RangeInput
									name='iou'
									labelText='Umbral mínimo de IoU'
									step={0.01}
									control={control}
									min={0.01}
									max={1}
									thickNumber={9}
								/>
							</div>
						</form>
					</div>
				</section>
			</main>
		</>
	);
};
