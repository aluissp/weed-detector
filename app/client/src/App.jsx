import { FaCircleHalfStroke } from 'react-icons/fa6';
import { LiaListSolid } from 'react-icons/lia';
import { MdImageSearch } from 'react-icons/md';
import { RiHistoryFill } from 'react-icons/ri';

export const App = () => {
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
								<div className='flex items-center justify-center'>
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

				{/* Dropzone */}
				<section></section>
			</main>
		</>
	);
};
