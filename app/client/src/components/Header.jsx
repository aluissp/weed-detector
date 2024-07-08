import { FaCircleHalfStroke } from 'react-icons/fa6';

export const Header = () => {
	return (
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
	);
};
