import { TbWorld } from 'react-icons/tb';
import { useTranslation } from 'react-i18next';
import { useUiContext } from '../hooks/useUiContext';

export const Header = () => {
	const [t] = useTranslation('global');
	const { lang, handleSetCurrentLang } = useUiContext();

	document.title = t('header.title.full');
	document.documentElement.lang = lang;

	return (
		<header className='absolute max-w-7xl mx-auto inset-x-0 top-0 z-50'>
			<nav className='flex items-center justify-between p-5 lg:px-7 relative'>
				<div className='hidden sm:flex'></div>
				<h1 className='text-3xl font-extrabold tracking-tight text-white sm:text-5xl'>
					{t('header.title.left') + ' '}
					<span className='bg-gradient-to-tl from-slate-800 via-teal-500 to-zinc-400 bg-clip-text text-transparent'>
						{t('header.title.right')}
					</span>
				</h1>
				<div />
				<button
					className='absolute right-5 lg:right-7 md:top-6 flex items-center flex-col text-white text-sm hover:text-teal-400 transition-colors'
					onClick={() => handleSetCurrentLang({ lang })}
				>
					<TbWorld className='text-3xl' />
					{t('header.lang')}
				</button>
			</nav>
		</header>
	);
};
