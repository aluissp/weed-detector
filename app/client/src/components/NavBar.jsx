import { TbPhotoSearch } from 'react-icons/tb';
import { FormButton } from '../common/components';
import { LiaListSolid } from 'react-icons/lia';
import { RiHistoryFill } from 'react-icons/ri';

export const NavBar = () => {
	return (
		<nav className='text-white text-xs sm:text-sm bg-transparent border-t border-b border-zinc-800 my-6'>
			<div className='py-4 mx-auto flex items-center justify-between gap-2'>
				<div className='flex gap-2 justify-start'>
					<FormButton focus>
						<TbPhotoSearch className='text-xl' />
						Analizar imagen
					</FormButton>
					<FormButton>
						<LiaListSolid className='text-xl' />
						Resultados
					</FormButton>
				</div>
				<FormButton type='button' className='hover:bg-zinc-700 '>
					<RiHistoryFill className='text-xl' />
					Historial
				</FormButton>
			</div>
		</nav>
	);
};
